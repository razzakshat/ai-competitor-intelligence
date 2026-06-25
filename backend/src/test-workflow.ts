import dotenv from "dotenv";
dotenv.config();

import { connectDB } from "./config/database";
import { runScraperAgent } from "./agents/scraperAgent";
import { runStrategistAgent } from "./agents/strategistAgent";
import { storeIntelligence } from "./services/ragService";

async function test() {
  await connectDB();

  console.log("🧪 Testing full pipeline with forced briefing...\n");

  // Step 1: Scrape
  const scrapeResult = await runScraperAgent(
    "notion-001",
    "Notion",
    "https://www.notion.so"
  );

  if (!scrapeResult.success || !scrapeResult.data) {
    console.log("❌ Scrape failed");
    return;
  }
  console.log("✅ Scrape complete\n");

  // Step 2: Store
  await storeIntelligence(scrapeResult.data);
  console.log("✅ Stored in ChromaDB\n");

  // Step 3: Force strategist (skip analyzer)
  const forcedAnalysis = {
    hasSignificantChanges: true,
    changes: "New competitor detected for first time - full analysis required",
    significance: "high" as const,
    summary: scrapeResult.data.extractedIntelligence.summary,
  };

  const briefing = await runStrategistAgent(scrapeResult.data, forcedAnalysis);

  console.log("\n🎯 STRATEGIC BRIEFING GENERATED:");
  console.log("=".repeat(60));
  console.log("📋 SUMMARY:");
  console.log(briefing.summary);
  console.log("\n🔄 CHANGES:");
  console.log(briefing.changes);
  console.log("\n💡 STRATEGIC INSIGHTS:");
  console.log(briefing.strategicInsights);
  console.log("\n✅ RECOMMENDATIONS:");
  console.log(briefing.recommendations);
  console.log("\n🚨 SIGNIFICANCE:", briefing.significance);
  console.log("=".repeat(60));

  process.exit(0);
}

test().catch(console.error);