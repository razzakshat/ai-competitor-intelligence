import { Request, Response } from "express";
import { Competitor } from "../models/Competitor";
import { runScraperAgent } from "../agents/scraperAgent";

// GET /api/competitors
export const getCompetitors = async (req: Request, res: Response) => {
  try {
    const competitors = await Competitor.find({ isActive: true });
    res.json({ success: true, data: competitors });
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to fetch competitors" });
  }
};

// POST /api/competitors
export const createCompetitor = async (req: Request, res: Response) => {
  try {
    const { name, website, description } = req.body;

    if (!name || !website) {
      return res.status(400).json({ success: false, error: "Name and website are required" });
    }

    const competitor = new Competitor({ name, website, description });
    await competitor.save();

    res.status(201).json({ success: true, data: competitor });
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to create competitor" });
  }
};

// DELETE /api/competitors/:id
export const deleteCompetitor = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await Competitor.findByIdAndUpdate(id, { isActive: false });
    res.json({ success: true, message: "Competitor removed" });
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to delete competitor" });
  }
};

// POST /api/competitors/:id/scrape
export const scrapeCompetitor = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const competitor = await Competitor.findById(id);
    if (!competitor) {
      return res.status(404).json({ success: false, error: "Competitor not found" });
    }

    console.log(`🚀 Starting scrape for ${competitor.name}...`);
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