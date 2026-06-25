import mongoose, { Schema, Document } from "mongoose";

export interface IBriefing extends Document {
  competitorId: string;
  competitorName: string;
  summary: string;
  changes: string;
  strategicInsights: string;
  recommendations: string;
  significance: "low" | "medium" | "high";
  createdAt: Date;
}

const BriefingSchema = new Schema<IBriefing>(
  {
    competitorId: { type: String, required: true },
    competitorName: { type: String, required: true },
    summary: { type: String, required: true },
    changes: { type: String, default: "" },
    strategicInsights: { type: String, default: "" },
    recommendations: { type: String, default: "" },
    significance: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
  },
  { timestamps: true }
);

export const Briefing = mongoose.model<IBriefing>("Briefing", BriefingSchema);