import { Router } from "express";
import {
  getCompetitors,
  createCompetitor,
  deleteCompetitor,
  scrapeCompetitor,
} from "../api/competitors";

const router = Router();

router.get("/", getCompetitors);
router.post("/", createCompetitor);
router.delete("/:id", deleteCompetitor);
router.post("/:id/scrape", scrapeCompetitor);
export default router;

import {
  getCompetitors,
  createCompetitor,
  deleteCompetitor,
  scrapeCompetitor,
  getBriefings,
} from "../api/competitors";

router.get("/briefings", getBriefings);