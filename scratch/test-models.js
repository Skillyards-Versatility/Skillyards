import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI } from "@google/genai";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, "../apps/ai-service/.env") });

async function testModel(modelName) {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  console.log(`Testing model: ${modelName}...`);
  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: "Hello, tell me a 1-sentence joke."
    });
    console.log(`✅ Success with ${modelName}: "${response.text.trim()}"`);
    return true;
  } catch (err) {
    console.error(`❌ Failed with ${modelName}: ${err.message}`);
    return false;
  }
}

async function main() {
  const models = [
    "gemini-2.0-flash",
    "gemini-2.5-flash",
    "gemini-flash-latest",
    "gemini-2.0-flash-lite"
  ];
  for (const model of models) {
    await testModel(model);
    await new Promise(r => setTimeout(r, 1000)); // wait 1s
  }
}

main();
