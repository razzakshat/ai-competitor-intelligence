import { Request, Response } from "express";
import { Competitor } from "../models/Competitor";
import { Briefing } from "../models/Briefing";
import { runScraperAgent } from "../agents/scraperAgent";
import { runCompetitorWorkflow } from "../services/workflowService";

export const getCompetitors = async (req: Request, res: Response) => {
  try {
    const userId = (req.headers["x-user-id"] as string) || "default";
    const competitors = await Competitor.find({ userId, isActive: true });
    res.json({ success: true, data: competitors });
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to fetch competitors" });
  }
};

export const createCompetitor = async (req: Request, res: Response) => {
  try {
    const { name, website, description } = req.body;
    if (!name || !website) {
      return res.status(400).json({ success: false, error: "Name and website are required" });
    }
    const userId = (req.headers["x-user-id"] as string) || "default";
    const competitor = new Competitor({ name, website, description, userId });
    await competitor.save();
    res.status(201).json({ success: true, data: competitor });
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to create competitor" });
  }
};

export const deleteCompetitor = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req.headers["x-user-id"] as string) || "default";
    await Competitor.findOneAndUpdate({ _id: id, userId }, { isActive: false });
    res.json({ success: true, message: "Competitor removed" });
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to delete competitor" });
  }
};

export const scrapeCompetitor = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req.headers["x-user-id"] as string) || "default";
    const competitor = await Competitor.findOne({ _id: id, userId });
    if (!competitor) {
      return res.status(404).json({ success: false, error: "Competitor not found" });
    }
    const result = await runScraperAgent(
      competitor._id.toString(),
      competitor.name,
      competitor.website
    );
    if (result.success) {
      await Competitor.findByIdAndUpdate(id, { lastScraped: new Date() });
      res.json({ success: true, data: result.data });
    } else {
      res.status(500).json({ success: false, error: result.error });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: "Scraping failed" });
  }
};

export const analyzeCompetitor = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req.headers["x-user-id"] as string) || "default";
    const competitor = await Competitor.findOne({ _id: id, userId });
    if (!competitor) {
      return res.status(404).json({ success: false, error: "Competitor not found" });
    }
    await runCompetitorWorkflow(
      competitor._id.toString(),
      competitor.name,
      competitor.website,
      userId
    );
    res.json({ success: true, message: "Workflow complete" });
  } catch (error: any) {
    console.error("Workflow error:", error);
    res.status(500).json({ success: false, error: `Workflow failed: ${error.message || error}` });
  }
};

export const getBriefings = async (req: Request, res: Response) => {
  try {
    const userId = (req.headers["x-user-id"] as string) || "default";
    const briefings = await Briefing.find({ userId }).sort({ createdAt: -1 }).limit(20);
    res.json({ success: true, data: briefings });
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to fetch briefings" });
  }
};