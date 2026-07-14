import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI } from "@google/genai";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, "../apps/ai-service/.env") });

async function main() {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: "Hello, tell me a 1-sentence joke."
    });
    console.log(`✅ Success: "${response.text.trim()}"`);
  } catch (err) {
    console.error(`❌ Failed: ${err.message}`);
  }
}

main();
