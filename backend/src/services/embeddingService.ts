import { HuggingFaceInferenceEmbeddings } from "@langchain/community/embeddings/hf";

let embeddings: HuggingFaceInferenceEmbeddings | null = null;

export const getEmbeddings = (): HuggingFaceInferenceEmbeddings => {
  if (!embeddings) {
    embeddings = new HuggingFaceInferenceEmbeddings({
      apiKey: process.env.HUGGINGFACE_API_KEY,
      model: "sentence-transformers/all-MiniLM-L6-v2",
    });
  }
  return embeddings;
};

export const embedText = async (text: string): Promise<number[]> => {
  const embeddingModel = getEmbeddings();
  const result = await embeddingModel.embedQuery(text);
  return result;
};