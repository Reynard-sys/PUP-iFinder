import { GoogleGenAI } from "@google/genai";

// Ensure you are passing the apiKey inside the config object
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY, 
});

async function run() {
  try {
    // This call requires the API key to be set correctly above
    const response = await ai.models.list();
    
    console.log("--- Available Models ---");
    response.items.forEach(model => {
      console.log(`Model ID: ${model.name}`);
    });
  } catch (error) {
    // If you see 'API_KEY_INVALID', check your .env file
    console.error("Error:", error.message);
  }
}

run();