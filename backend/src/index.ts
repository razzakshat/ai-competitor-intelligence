import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import helmet from "helmet";
import { connectDB } from "./config/database";
import competitorRoutes from "./routes/competitors";

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(cors({
  origin: "http://localhost:3000",
}));
app.use(express.json());

// Routes
app.use("/api/competitors", competitorRoutes);

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok", message: "AI Competitor Intelligence API running" });
});

// Start server
const start = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📡 Health check: http://localhost:${PORT}/health`);
    console.log(`🏢 Competitors API: http://localhost:${PORT}/api/competitors`);
  });
};

start().catch(console.error);