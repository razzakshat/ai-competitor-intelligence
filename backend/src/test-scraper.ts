import dotenv from "dotenv";
dotenv.config();

import { runScraperAgent } from "./agents/scraperAgent";

async function test() {
  console.log("🧪 Testing Scraper Agent...\n");

  const result = await runScraperAgent(
    "test-123",
    "Stripe",
    "https://stripe.com"
  );

  if (result.success && result.data) {
    console.log("\n📊 EXTRACTED INTELLIGENCE:");
    console.log("─".repeat(50));
    console.log("Summary:", result.data.extractedIntelligence.summary);
    console.log("\nKey Features:", result.data.extractedIntelligence.keyFeatures);
    console.log("\nPricing:", result.data.extractedIntelligence.pricingInfo);
    console.log("\nTarget Audience:", result.data.extractedIntelligence.targetAudience);
    console.log("\nContent Hash:", result.data.contentHash);
    console.log("─".repeat(50));
    console.log("\n✅ Scraper Agent working perfectly!");
  } else {
    console.log("❌ Failed:", result.error);
  }
}

test().catch(console.error);