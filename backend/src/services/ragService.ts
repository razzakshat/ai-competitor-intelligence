import { ChromaClient } from "chromadb";
import { getEmbeddings } from "./embeddingService";
import { Chroma } from "@langchain/community/vectorstores/chroma";
import { ScrapedData } from "../types";

const COLLECTION_NAME = "competitor_intelligence";
const CHROMA_URL = process.env.CHROMA_URL || "http://localhost:8000";

let vectorStore: Chroma | null = null;

// Get or create the vector store
export const getVectorStore = async (): Promise<Chroma> => {
  if (!vectorStore) {
    vectorStore = await Chroma.fromExistingCollection(
      getEmbeddings(),
      {
        collectionName: COLLECTION_NAME,
        url: CHROMA_URL,
      }
    ).catch(async () => {
      // Collection doesn't exist yet — create it
      return new Chroma(getEmbeddings(), {
        collectionName: COLLECTION_NAME,
        url: CHROMA_URL,
      });
    });
  }
  return vectorStore;
};

// Store scraped intelligence in ChromaDB
export const storeIntelligence = async (data: ScrapedData): Promise<void> => {
  try {
    console.log(`📦 Storing intelligence for ${data.competitorName}...`);

    const store = await getVectorStore();

    // What we store as text (what gets embedded)
    const textToStore = `
      Competitor: ${data.competitorName}
      Website: ${data.website}
      Summary: ${data.extractedIntelligence.summary}
      Key Features: ${data.extractedIntelligence.keyFeatures.join(", ")}
      Pricing: ${data.extractedIntelligence.pricingInfo}
      Recent Updates: ${data.extractedIntelligence.recentUpdates}
      Target Audience: ${data.extractedIntelligence.targetAudience}
    `.trim();

    // Metadata stored alongside the embedding
    const metadata = {
      competitorId: data.competitorId,
      competitorName: data.competitorName,
      website: data.website,
      scrapedAt: data.scrapedAt.toISOString(),
      contentHash: data.contentHash,
    };

    await store.addDocuments([
      {
        pageContent: textToStore,
        metadata,
      },
    ]);

    console.log(`✅ Stored intelligence for ${data.competitorName} in ChromaDB`);
  } catch (error: any) {
    console.error(`❌ Failed to store in ChromaDB:`, error.message);
    throw error;
  }
};

// Retrieve relevant intelligence using semantic search
export const retrieveIntelligence = async (
  query: string,
  numResults: number = 3
): Promise<string> => {
  try {
    console.log(`🔍 Searching ChromaDB for: "${query}"`);

    const store = await getVectorStore();
    const results = await store.similaritySearch(query, numResults);

    if (results.length === 0) {
      return "No relevant intelligence found.";
    }

    const context = results
      .map((doc, index) => {
        return `--- Source ${index + 1}: ${doc.metadata.competitorName} (${doc.metadata.scrapedAt}) ---\n${doc.pageContent}`;
      })
      .join("\n\n");

    console.log(`✅ Found ${results.length} relevant results`);
    return context;
  } catch (error: any) {
    console.error(`❌ Retrieval failed:`, error.message);
    return "Failed to retrieve intelligence.";
  }
};