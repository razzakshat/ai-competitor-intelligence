import cron from "node-cron";
import { Competitor } from "../models/Competitor";
import { runCompetitorWorkflow } from "./workflowService";

export const initCronJobs = () => {
  console.log("⏰ Initializing Competitor Intelligence Cron Service...");

  // Schedule a daily scan at 9:00 AM
  // Pattern: minute hour day-of-month month day-of-week
  cron.schedule("0 9 * * *", async () => {
    console.log("⏰ [Cron Job] Starting daily competitor tracking scan...");
    try {
      // Find all active competitors across all workspaces
      const competitors = await Competitor.find({ isActive: true });
      console.log(`⏰ [Cron Job] Found ${competitors.length} active competitors to scan.`);

      for (const competitor of competitors) {
        try {
          console.log(`⏰ [Cron Job] Running automated tracking for ${competitor.name} (${competitor.website}) in workspace: ${competitor.userId}`);
          await runCompetitorWorkflow(
            competitor._id.toString(),
            competitor.name,
            competitor.website,
            competitor.userId
          );
          console.log(`⏰ [Cron Job] Successfully finished tracking for ${competitor.name}`);
        } catch (err) {
          console.error(`❌ [Cron Job] Failed to run automated tracking for ${competitor.name}:`, err);
        }
      }
      console.log("⏰ [Cron Job] Daily competitor tracking scan finished successfully.");
    } catch (error) {
      console.error("❌ [Cron Job] Daily competitor tracking scan error:", error);
    }
  });

  console.log("✅ Daily competitor tracking cron job scheduled at 09:00 AM every day.");
};
