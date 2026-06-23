import dotenv from "dotenv";
dotenv.config();

import { ChatGroq } from "@langchain/groq";

async function main() {
  console.log("🚀 Starting AI Competitor Intelligence System...");
  console.log("🔑 Groq API Key loaded:", process.env.GROQ_API_KEY ? "✅ Yes" : "❌ Missing");
  console.log("🍃 MongoDB URI loaded:", process.env.MONGODB_URI ? "✅ Yes" : "❌ Missing");
  console.log("🔵 ChromaDB URL:", process.env.CHROMA_URL);

  const llm = new ChatGroq({
    model: "llama-3.3-70b-versatile",
    apiKey: process.env.GROQ_API_KEY,
    temperature: 0.7,
  });

  console.log("\n🤖 Sending first message to Groq...\n");

  const response = await llm.invoke([
    {
      role: "user",
      content: "You are a business intelligence analyst. In 3 bullet points, what are the most important things to monitor when tracking a competitor?",
    },
  ]);

  console.log("✅ Groq Response:");
  console.log("─".repeat(50));
  console.log(response.content);
  console.log("─".repeat(50));
  console.log("\n🎉 Day 1 Complete! Your AI system is alive.");
}

main().catch(console.error);