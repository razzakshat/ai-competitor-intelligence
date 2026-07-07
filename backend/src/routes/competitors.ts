import { Router } from "express";
import {
  getCompetitors,
  createCompetitor,
  deleteCompetitor,
  scrapeCompetitor,
  getBriefings,
  analyzeCompetitor,
} from "../api/competitors";

const router = Router();

router.get("/briefings", getBriefings);
router.get("/", getCompetitors);
router.post("/", createCompetitor);
router.delete("/:id", deleteCompetitor);
router.post("/:id/scrape", scrapeCompetitor);
router.post("/:id/analyze", analyzeCompetitor);

export default router;