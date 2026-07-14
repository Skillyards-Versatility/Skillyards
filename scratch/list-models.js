import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI } from "@google/genai";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, "../apps/ai-service/.env") });

async function main() {
  const apiKey = process.env.GEMINI_API_KEY;
  console.log(`Checking models using API key: ${apiKey.slice(0, 10)}...`);
  
  const ai = new GoogleGenAI({ apiKey });
  
  try {
    const response = await ai.models.list();
    console.log("Keys of response:", Object.keys(response));
    if (Array.isArray(response)) {
      console.log("Response is an array. Length:", response.length);
      console.log("First item:", response[0]);
    } else {
      console.log("Response is not an array. Trying iteration or properties...");
      // Try standard async iteration
      try {
        const models = [];
        for await (const model of response) {
          models.push(model.name);
        }
        console.log("Iterated models:", models.filter(name => name.includes("gemini")));
      } catch (e) {
        console.log("Async iteration failed:", e.message);
      }
    }
  } catch (err) {
    console.error("Error listing models:", err.message || err);
  }
}

main();
