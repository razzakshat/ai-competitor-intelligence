import dotenv from "dotenv";
dotenv.config();

import { connectDB } from "./config/database";
import { runCompetitorWorkflow } from "./services/workflowService";

async function test() {
  await connectDB();

  await runCompetitorWorkflow(
    "notion-001",
    "Notion",
    "https://www.notion.so"
  );

  process.exit(0);
}

test().catch(console.error);