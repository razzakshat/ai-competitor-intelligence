import { Router } from "express";
import {
  getCompetitors,
  createCompetitor,
  deleteCompetitor,
} from "../api/competitors";

const router = Router();

router.get("/", getCompetitors);
router.post("/", createCompetitor);
router.delete("/:id", deleteCompetitor);

export default router;