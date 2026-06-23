import { Request, Response } from "express";
import { Competitor } from "../models/Competitor";

// GET /api/competitors - get all competitors
export const getCompetitors = async (req: Request, res: Response) => {
  try {
    const competitors = await Competitor.find({ isActive: true });
    res.json({ success: true, data: competitors });
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to fetch competitors" });
  }
};

// POST /api/competitors - add a new competitor
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

// DELETE /api/competitors/:id - remove a competitor
export const deleteCompetitor = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await Competitor.findByIdAndUpdate(id, { isActive: false });
    res.json({ success: true, message: "Competitor removed" });
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to delete competitor" });
  }
};