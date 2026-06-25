import { StateGraph, Annotation, END } from "@langchain/langgraph";
import { runScraperAgent } from "../agents/scraperAgent";
import { runAnalyzerAgent, AnalysisResult } from "../agents/analyzerAgent";
import { runStrategistAgent, BriefingResult } from "../agents/strategistAgent";
import { storeIntelligence } from "./ragService";
import { Briefing } from "../models/Briefing";
import { ScrapedData } from "../types";

// Define state using Annotation (new LangGraph 1.x syntax)
const WorkflowAnnotation = Annotation.Root({
  competitorId: Annotation<string>(),
  competitorName: Annotation<string>(),
  website: Annotation<string>(),
  scrapedData: Annotation<ScrapedData | undefined>(),
  analysis: Annotation<AnalysisResult | undefined>(),
  briefing: Annotation<BriefingResult | undefined>(),
  error: Annotation<string | undefined>(),
  shouldGenerateBriefing: Annotation<boolean>(),
});

type WorkflowState = typeof WorkflowAnnotation.State;

// Node 1: Scrape
const scrapeNode = async (state: WorkflowState): Promise<Partial<WorkflowState>> => {
  console.log(`\n🔄 [Node 1] Scraping ${state.competitorName}...`);
  const result = await runScraperAgent(
    state.competitorId,
    state.competitorName,
    state.website
  );
  if (!result.success || !result.data) {
    return { error: result.error };
  }
  return { scrapedData: result.data };
};

// Node 2: Store in ChromaDB
const storeNode = async (state: WorkflowState): Promise<Partial<WorkflowState>> => {
  console.log(`\n🔄 [Node 2] Storing intelligence in ChromaDB...`);
  if (!state.scrapedData) return { error: "No scraped data to store" };
  await storeIntelligence(state.scrapedData);
  return {};
};

// Node 3: Analyze
const analyzeNode = async (state: WorkflowState): Promise<Partial<WorkflowState>> => {
  console.log(`\n🔄 [Node 3] Analyzing changes...`);
  if (!state.scrapedData) return { error: "No data to analyze" };
  const analysis = await runAnalyzerAgent(state.scrapedData);
  return {
    analysis,
    shouldGenerateBriefing: analysis.hasSignificantChanges,
  };
};

// Node 4: Strategize
const strategizeNode = async (state: WorkflowState): Promise<Partial<WorkflowState>> => {
  console.log(`\n🔄 [Node 4] Generating strategic briefing...`);
  if (!state.scrapedData || !state.analysis) {
    return { error: "Missing data for strategy" };
  }
  const briefing = await runStrategistAgent(state.scrapedData, state.analysis);
  return { briefing };
};

// Node 5: Save briefing
const saveBriefingNode = async (state: WorkflowState): Promise<Partial<WorkflowState>> => {
  console.log(`\n🔄 [Node 5] Saving briefing to MongoDB...`);
  if (!state.briefing) return { error: "No briefing to save" };
  const briefingDoc = new Briefing({
    competitorId: state.competitorId,
    competitorName: state.competitorName,
    summary: state.briefing.summary,
    changes: state.briefing.changes,
    strategicInsights: state.briefing.strategicInsights,
    recommendations: state.briefing.recommendations,
    significance: state.briefing.significance,
  });
  await briefingDoc.save();
  console.log(`✅ Briefing saved to MongoDB`);
  return {};
};

// Decision function
const routeAfterAnalysis = (state: WorkflowState): string => {
  if (state.error) return "end";
  if (state.shouldGenerateBriefing) {
    console.log(`🚨 Significant changes → generating briefing`);
    return "strategize";
  }
  console.log(`✅ No significant changes → ending`);
  return "end";
};

// Build the graph
export const createWorkflow = () => {
  const workflow = new StateGraph(WorkflowAnnotation)
    .addNode("scrape", scrapeNode)
    .addNode("store", storeNode)
    .addNode("analyze", analyzeNode)
    .addNode("strategize", strategizeNode)
    .addNode("saveBriefing", saveBriefingNode)
    .addEdge("__start__", "scrape")
    .addEdge("scrape", "store")
    .addEdge("store", "analyze")
    .addConditionalEdges("analyze", routeAfterAnalysis, {
      strategize: "strategize",
      end: END,
    })
    .addEdge("strategize", "saveBriefing")
    .addEdge("saveBriefing", END);

  return workflow.compile();
};

// Run workflow for one competitor
export const runCompetitorWorkflow = async (
  competitorId: string,
  competitorName: string,
  website: string
): Promise<void> => {
  console.log(`\n${"=".repeat(60)}`);
  console.log(`🚀 Starting workflow for ${competitorName}`);
  console.log(`${"=".repeat(60)}`);

  const app = createWorkflow();

  const result = await app.invoke({
    competitorId,
    competitorName,
    website,
    shouldGenerateBriefing: false,
    scrapedData: undefined,
    analysis: undefined,
    briefing: undefined,
    error: undefined,
  });

  if (result.error) {
    console.log(`\n❌ Workflow failed: ${result.error}`);
  } else if (result.briefing) {
    const briefing = result.briefing as BriefingResult;
    console.log(`\n✅ Workflow complete — briefing generated`);
    console.log(`📊 Significance: ${briefing.significance}`);
    console.log(`📝 Summary: ${briefing.summary}`);
  } else {
    console.log(`\n✅ Workflow complete — no significant changes`);
  }
};