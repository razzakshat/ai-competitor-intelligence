import { ChatGroq } from "@langchain/groq";
import { retrieveIntelligence } from "../services/ragService";
import { ScrapedData } from "../types";

const llm = new ChatGroq({
  model: "llama-3.3-70b-versatile",
  apiKey: process.env.GROQ_API_KEY,
  temperature: 0.3,
});

export interface AnalysisResult {
  hasSignificantChanges: boolean;
  changes: string;
  significance: "low" | "medium" | "high";
  summary: string;
}

export const runAnalyzerAgent = async (
  newData: ScrapedData
): Promise<AnalysisResult> => {
  try {
    console.log(`🔍 Analyzing changes for ${newData.competitorName}...`);

    const historicalContext = await retrieveIntelligence(
      `${newData.competitorName} previous intelligence history`,
      3
    );

    const prompt = `You are a competitive intelligence analyst.

Compare this NEW competitor intelligence with the HISTORICAL data and identify significant changes.

COMPETITOR: ${newData.competitorName}

NEW INTELLIGENCE:
Summary: ${newData.extractedIntelligence.summary}
Key Features: ${newData.extractedIntelligence.keyFeatures.join(", ")}
Pricing: ${newData.extractedIntelligence.pricingInfo}
Recent Updates: ${newData.extractedIntelligence.recentUpdates}
Target Audience: ${newData.extractedIntelligence.targetAudience}

HISTORICAL CONTEXT:
${historicalContext}

Analyze and respond in valid JSON only. No markdown. No code blocks:
{
  "hasSignificantChanges": true or false,
  "changes": "describe what specifically changed, or 'No significant changes detected'",
  "significance": "low" or "medium" or "high",
  "summary": "2 sentence summary of current competitive position"
}

Significance guide:
- high: pricing changes, new major features, market pivot
- medium: new content, minor features, messaging updates
- low: cosmetic changes, no real changes`;

    const response = await llm.invoke([{ role: "user", content: prompt }]);
    const responseText = response.content as string;

    try {
      const cleaned = responseText
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();
      const result = JSON.parse(cleaned);
      console.log(`✅ Analysis complete. Significance: ${result.significance}`);
      return result;
    } catch {
      return {
        hasSignificantChanges: false,
        changes: "Analysis parsing failed",
        significance: "low",
        summary: newData.extractedIntelligence.summary,
      };
    }
  } catch (error: any) {
    console.error(`❌ Analyzer failed:`, error.message);
    throw error;
  }
};