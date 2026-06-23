import dotenv from "dotenv";
dotenv.config();

import { runScraperAgent } from "./agents/scraperAgent";
import { storeIntelligence, retrieveIntelligence } from "./services/ragService";

async function testRAG() {
  console.log("🧪 Testing RAG Pipeline...\n");

  // Step 1: Scrape a competitor
  console.log("STEP 1: Scraping Stripe...");
  const scrapeResult = await runScraperAgent(
    "stripe-001",
    "Stripe",
    "https://stripe.com"
  );

  if (!scrapeResult.success || !scrapeResult.data) {
    console.log("❌ Scraping failed:", scrapeResult.error);
    return;
  }
  console.log("✅ Scraping complete\n");

  // Step 2: Store in ChromaDB
  console.log("STEP 2: Storing in ChromaDB...");
  await storeIntelligence(scrapeResult.data);
  console.log("✅ Storage complete\n");

  // Step 3: Retrieve using semantic search
  console.log("STEP 3: Testing semantic search...\n");

  const queries = [
    "What are the payment features?",
    "Who is the target customer?",
    "What is the pricing model?",
  ];

  for (const query of queries) {
    console.log(`❓ Query: "${query}"`);
    const result = await retrieveIntelligence(query, 1);
    console.log(`📄 Result preview: ${result.slice(0, 200)}...`);
    console.log("─".repeat(50));
  }

  console.log("\n✅ RAG Pipeline working perfectly!");
}

testRAG().catch(console.error);