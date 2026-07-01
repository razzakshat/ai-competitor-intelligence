import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://backend-production-2cb7.up.railway.app/api";

export const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

export interface Competitor {
  _id: string;
  name: string;
  website: string;
  description: string;
  isActive: boolean;
  lastScraped: string | null;
  createdAt: string;
}

export interface Briefing {
  _id: string;
  competitorId: string;
  competitorName: string;
  summary: string;
  changes: string;
  strategicInsights: string;
  recommendations: string;
  significance: "low" | "medium" | "high";
  createdAt: string;
}

export const getCompetitors = async (): Promise<Competitor[]> => {
  const res = await api.get("/competitors");
  return res.data.data;
};

export const createCompetitor = async (
  name: string,
  website: string,
  description: string
): Promise<Competitor> => {
  const res = await api.post("/competitors", { name, website, description });
  return res.data.data;
};

export const deleteCompetitor = async (id: string): Promise<void> => {
  await api.delete(`/competitors/${id}`);
};

export const scrapeCompetitor = async (id: string): Promise<any> => {
  const res = await api.post(`/competitors/${id}/scrape`);
  return res.data.data;
};

export const getBriefings = async (): Promise<Briefing[]> => {
  const res = await api.get("/competitors/briefings");
  return res.data.data;
};