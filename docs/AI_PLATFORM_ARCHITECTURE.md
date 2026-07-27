# SkillYards AI Platform — Engineering Context & Architecture Brief

This document serves as the comprehensive architectural specification for the **SkillYards AI Platform**, a reusable AI infrastructure that powers multiple downstream products.

---

## 1. Vision & Core Philosophy

Instead of building siloed, product-specific AI applications, we are establishing a **unified intelligence layer**. This platform handles all backend tasks such as real-time audio streaming, speech-to-text (STT), text-to-speech (TTS), conversation state management, tool execution, and vector search, exposing clean and reusable interfaces to various client products.

```text
                             SkillYards AI Platform
                                        │
                                 AI Gateway (Gemini / OpenAI fallback)
                                        │
         ┌──────────────────────────────┼──────────────────────────────┐
         ▼                              ▼                              ▼
    Voice Agent                    Call Analyzer                Website Chatbot
         │                              │                              │
         └──────────────────────────────┼──────────────────────────────┘
                                        ▼
                           Shared Conversation Engine
                                        │
                             Shared Prompt Manager
                                        │
                                 Shared RAG Core
                                        │
                          Neon PostgreSQL + pgvector
                                        │
                             Shared Tool Calling API
                                        │
                              Cloudflare R2 Storage
```

---

## 2. Directory Layout & Architecture

The refactored `apps/ai-service` directory is structured modularly as follows:

```text
apps/
└── ai-service/
    src/
        server.js             # HTTP/WS Server entry point (Express + ws)
        routes/
            audit.routes.js   # Async call auditing endpoints
            voice.routes.js   # Telephony callback / streaming webhook routes
            chat.routes.js    # Chatbot & CRM Copilot endpoints
            rag.routes.js     # Knowledge document upload & search routes
        controllers/
            audit.controller.js
            voice.controller.js
            chat.controller.js
            rag.controller.js
        services/
            gateway.service.js   # Unified AI Gateway (Gemini / OpenAI)
            embedding.service.js # Vector embedding generator
            evaluation.service.js# Score and metric evaluator for calls/mocks
        voice/
            conversation.js   # Stateful dialog state machine
            session.js        # Call session manager (active calls, WebSockets)
            memory.js         # Conversation memory and history store
            tool-calling.js   # Core tool declarations and handlers
            telephony.js      # Streaming telephony connection handler
            prompt.js         # Contextual stage-based prompt assembler
        rag/
            chunker.js        # Text chunking rules
            embeddings.js     # Text-to-embedding sync services
            vector-search.js  # pgvector similarity search
            retriever.js      # Hybrid retriever (pgvector + FTS)
            reranker.js       # Scoring and sorting search hits
        queue/
            bullmq.js         # BullMQ queue configuration
            workers.js        # Worker scripts running asynchronous tasks
        prompts/              # Base prompt templates
        tools/                # Tool schema declarations
        config/               # System and model configuration files
        utils/                # Helper utilities
```

---

## 3. Core Subsystems

### A. AI Gateway

Every AI-related query (text generation, audio parsing, vector embedding generation) is routed through the **AI Gateway**. 

* **Primary Provider**: Gemini API (utilizing the modern `@google/genai` library).
* **Fallback Provider**: OpenAI API (triggered automatically upon rate-limit `429` errors, timeouts, or specific regional failures).

```text
Client Application ──► AI Gateway ──► [Gemini (Primary)] ──(on failure)──► [OpenAI (Fallback)]
```

#### Gateway Interface Schema:
```typescript
interface GenerateParams {
  provider?: 'gemini' | 'openai';
  model?: string;
  prompt: string;
  systemInstruction?: string;
  schema?: Record<string, any>; // For Structured JSON generation
}

interface EmbedParams {
  provider?: 'gemini' | 'openai';
  text: string;
}
```

---

### B. Shared RAG (Retrieval-Augmented Generation)

The knowledge retrieval system is shared by the Website Chatbot, Voice Agent, CRM Copilot, and Mock Trainer.

```text
Document Upload ──► Extract Text ──► Chunk ──► Generate Embeddings ──► Store in Neon (pgvector)
                                                                                │
                                                                                ▼
User Question ──► Generate Query Embedding ──► Hybrid Search (pgvector + FTS) ──┘
                                                       │
                                                       ▼
                                            Gemini ──► Structured Answer
```

#### Vector Schema (`packages/db`)
* **`knowledge_documents`**: Stores document metadata (name, R2 storage URL, type).
* **`knowledge_chunks`**: Stores raw content segments, metadata, and the vector embedding.
* **Vector type**: Configured on **768 dimensions** (matching Gemini `text-embedding-004`). OpenAI embeddings are generated with standard 768 dimensions using its dynamic dimensionality API param.

```sql
-- SQL Representation
CREATE TABLE knowledge_chunks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID REFERENCES knowledge_documents(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  embedding VECTOR(768),
  metadata JSONB,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
```

#### Hybrid Search Pipeline
1. **Semantic Search**: Computes cosine similarity of query embedding against `knowledge_chunks.embedding` using `pgvector`.
2. **Lexical Search**: Executes PostgreSQL Full Text Search (FTS) using `to_tsvector` and `to_tsquery` on `content`.
3. **Combination & Rerank**: Merges and reranks the results using Reciprocal Rank Fusion (RRF) or basic score normalization to produce the final top-$K$ contexts.

---

### C. Voice Agent & Stateful Conversation Engine

The Voice Agent manages real-time, stateful phone conversations. Instead of delegating conversational flow entirely to the LLM, the **Conversation Engine** enforces a strict stage-based state machine.

```text
[Greeting] ──► [Verification] ──► [Discovery] ──► [Qualification] ──► [Pitch] ──► [Objection Handling] ──► [Closing] ──► [Callback / End]
```

#### State and Memory Tracking
Each call session maintains an active, in-memory state serialized to the database at checkpoints:
* **Lead Info**: Customer profile, name, phone, history.
* **Current Stage**: Active step in the conversation flow.
* **Memory Buffer**: Recent transcript turns, summarizing long logs as token limits approach.
* **CRM Context**: Live fields (e.g., student interest markers, booked times).

#### Tool Calling Structure
The LLM never runs SQL or updates databases directly. It only outputs tool calls, which the **Tool Calling** module intercepts and executes locally:
* `searchLead()`: Queries database for current lead metadata.
* `updateLead()`: Adjusts lead progress or contact attributes.
* `bookDemo()`: Inserts calendar events/demo sessions.
* `scheduleCallback()`: Schedules follow-up events.
* `sendWhatsapp()` / `sendEmail()`: Dispatches out-of-band communication.
* `markInterested()`: Flags lead status in CRM.

---

### D. Telephony & WebSocket Streaming

Exotel (or Twilio) handles the voice transport, routing real-time audio streams via WebSockets (`AgentStream`) to our Express microservice.

```text
CRM Webhook ──► AI Service ──► Exotel Voice API ──► Customer Call
                                                         │
                                                  (AgentStream WS)
                                                         │
                                                         ▼
                                                    AI Service
                                                ┌──────────────────┐
                                                │ - STT (Live)     │
                                                │ - State Machine  │
                                                │ - Tool Call / RAG│
                                                │ - TTS response   │
                                                └──────────────────┘
```

1. **WebSocket Handler**: Connects to the Exotel stream, receiving linear PCM/$\mu$-law audio chunks.
2. **Speech-to-Text (STT)**: Transcribes incoming audio in real-time.
3. **Core Processing**: Feeds transcribed text into the Conversation Engine, trigger RAG/Tools as needed, and fetches the LLM response text.
4. **Text-to-Speech (TTS)**: Translates response tokens into native Indian-accented audio streams using **Google Cloud Text-to-Speech** (via Neural2/Wavenet models, e.g., `hi-IN-Neural2` or `en-IN-Wavenet`), which is then piped back through the WebSocket connection to the customer. Google Cloud TTS provides 1 million characters free per month.

---

### E. Mock Call Trainer

Reuses the same Conversation Engine and Prompts, substituting live lead profiles with mock personas:
* **Scenarios**: *Angry Parent, Price-Sensitive Lead, Busy Working Professional, Competitor Comparison, Scholarship Inquiry, etc.*
* **Evaluation Matrix**: After session completion, it generates a comprehensive evaluation JSON:
  * Overall Score (0-100)
  * Greeting Quality
  * Product Knowledge
  * Confidence Level
  * Objection Handling effectiveness
  * Closing script compliance
  * Communication clarity
  * Actionable Coaching Suggestions

---

### F. Call Analyzer

The existing offline Call Analyzer continues to audit telephony calls but is refactored to utilize the shared **AI Gateway**, common **Prompt Templates**, and the unified **Evaluation Engine**.

---

### G. Asynchronous Job Queue

We are replacing the in-memory array queue with **BullMQ** backed by **Redis**.

```text
   HTTP /api/audit
          │
          ▼
   [BullMQ Queue] ──► [Redis Store] ──► [BullMQ Workers] ──► Gemini Files API / Auditing
```

* **Persistence**: Ensures no audits are lost in case of server restarts.
* **Concurrency**: Limits concurrent LLM calls to adhere to rate-limits.
* **Retries**: Automatically retries on network failures or temporary rate-limiting (`429`).

---

## 4. Hardware & Cost Estimations (Current Scale)

### Deployments
* **Web/Admin/API**: Vercel.
* **AI Service**: AWS EC2 instance (instance size: `t3.small` - ~₹2,000/month).
* **Storage**: Cloudflare R2 (audio, recordings, PDFs).
* **Database**: Neon PostgreSQL (utilizing the free/base tier with pgvector enabled).
* **Queue Backbone**: Redis (managed instance or hosted next to EC2).

### Scaled Costs (Based on ~100 calls, ~50 audits, ~20 mock calls per week)
* Total monthly operating costs are estimated to be between **₹5,500 – ₹6,000**, with the largest shares going to Telephony (Exotel/Twilio voice connection minutes) and LLM Tokens (Gemini/OpenAI API consumption).
