import dotenv from "dotenv";
dotenv.config();

import { sendCompetitorAlert } from "./services/slackService";

async function test() {
  console.log("🧪 Testing Slack alert...");

  await sendCompetitorAlert(
    "Stripe",
    "Stripe has launched a new AI-powered payment processing feature targeting enterprise customers.",
    "Stripe removed their free tier and introduced a new enterprise pricing model starting at $500/month.",
    "This signals Stripe is moving upmarket, abandoning small developers in favor of enterprise contracts.",
    "1. Target Stripe's abandoned free tier users immediately\n2. Launch a 'Stripe alternative' campaign\n3. Offer free migration support for developers leaving Stripe",
    "high"
  );

  console.log("✅ Test complete — check your Slack channel!");
}

test().catch(console.error);