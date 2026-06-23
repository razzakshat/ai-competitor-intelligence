import { ChatGroq } from "@langchain/groq";
import { scrapeWebsite, generateContentHash } from "../services/scraperService";
import { ScrapedData, ScraperResult } from "../types";

const llm = new ChatGroq({
  model: "llama-3.3-70b-versatile",
  apiKey: process.env.GROQ_API_KEY,
  temperature: 0.3,
});

export const runScraperAgent = async (
  competitorId: string,
  competitorName: string,
  website: string
): Promise<ScraperResult> => {
  try {
    // Step 1: Scrape the website
    const rawContent = await scrapeWebsite(website);
    const contentHash = generateContentHash(rawContent);

    // Step 2: Use AI to extract intelligence
    console.log(`🤖 Analyzing ${competitorName} with AI...`);

    const prompt = `You are a business intelligence analyst. Analyze this competitor website content and extract key information.

Competitor: ${competitorName}
Website: ${website}

Website Content:
${rawContent}

Extract the following information and respond in valid JSON format only:
{
  "summary": "2-3 sentence summary of what this company does",
  "keyFeatures": ["feature1", "feature2", "feature3"],
  "pricingInfo": "any pricing information found or 'Not publicly available'",
  "recentUpdates": "any recent news, updates, or changes found",
  "targetAudience": "who this product/service is designed for"
}

Respond with JSON only. No explanation. No markdown.`;

    const response = await llm.invoke([{ role: "user", content: prompt }]);

    // Step 3: Parse the AI response
    const responseText = response.content as string;

    let extractedIntelligence;
    try {
      extractedIntelligence = JSON.parse(responseText);
    } catch {
      // If JSON parsing fails, create a basic structure
      extractedIntelligence = {
        summary: responseText,
        keyFeatures: [],
        pricingInfo: "Not available",
        recentUpdates: "Not available",
        targetAudience: "Not available",
      };
    }

    // Step 4: Build the result
    const scrapedData: ScrapedData = {
      competitorId,
      competitorName,
      website,
      scrapedAt: new Date(),
      rawContent: rawContent.slice(0, 2000),
      extractedIntelligence,
      contentHash,
    };

    console.log(`✅ Successfully analyzed ${competitorName}`);
    return { success: true, data: scrapedData };

  } catch (error: any) {
    console.error(`❌ Scraper agent failed for ${competitorName}:`, error.message);
    return { success: false, error: error.message };
  }
};