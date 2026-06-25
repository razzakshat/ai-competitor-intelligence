import { ChatGroq } from "@langchain/groq";
import { retrieveIntelligence } from "../services/ragService";
import { ScrapedData } from "../types";
import { AnalysisResult } from "./analyzerAgent";

const llm = new ChatGroq({
  model: "llama-3.3-70b-versatile",
  apiKey: process.env.GROQ_API_KEY,
  temperature: 0.7,
});

export interface BriefingResult {
  summary: string;
  changes: string;
  strategicInsights: string;
  recommendations: string;
  significance: "low" | "medium" | "high";
}

export const runStrategistAgent = async (
  competitor: ScrapedData,
  analysis: AnalysisResult
): Promise<BriefingResult> => {
  try {
    console.log(`🧠 Generating strategic briefing for ${competitor.competitorName}...`);

    const marketContext = await retrieveIntelligence(
      `competitive strategy insights market positioning`,
      2
    );

    const prompt = `You are a senior business strategist and competitive intelligence expert.

Generate a strategic briefing based on this competitor analysis.

COMPETITOR: ${competitor.competitorName}
WEBSITE: ${competitor.website}

CURRENT INTELLIGENCE:
${competitor.extractedIntelligence.summary}
Features: ${competitor.extractedIntelligence.keyFeatures.join(", ")}
Pricing: ${competitor.extractedIntelligence.pricingInfo}
Target: ${competitor.extractedIntelligence.targetAudience}

DETECTED CHANGES:
${analysis.changes}
Significance: ${analysis.significance}

MARKET CONTEXT:
${marketContext}

Generate a strategic briefing in valid JSON only. No markdown. No code blocks:
{
  "summary": "Executive summary in 2-3 sentences",
  "changes": "What specifically changed and why it matters",
  "strategicInsights": "Deep strategic implications of these changes",
  "recommendations": "3 specific actionable recommendations for our business",
  "significance": "${analysis.significance}"
}

Be specific and actionable. No generic advice.`;

    const response = await llm.invoke([{ role: "user", content: prompt }]);
    const responseText = response.content as string;

    try {
      const cleaned = responseText
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();
      const result = JSON.parse(cleaned);
      console.log(`✅ Strategic briefing generated`);
      return result;
    } catch {
      return {
        summary: analysis.summary,
        changes: analysis.changes,
        strategicInsights: "Strategic analysis unavailable",
        recommendations: "Manual review recommended",
        significance: analysis.significance,
      };
    }
  } catch (error: any) {
    console.error(`❌ Strategist failed:`, error.message);
    throw error;
  }
};