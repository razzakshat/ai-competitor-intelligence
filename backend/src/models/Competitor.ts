import mongoose, { Schema, Document } from "mongoose";

export interface ICompetitor extends Document {
  name: string;
  website: string;
  description: string;
  isActive: boolean;
  lastScraped: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const CompetitorSchema = new Schema<ICompetitor>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    website: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastScraped: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export const Competitor = mongoose.model<ICompetitor>(
  "Competitor",
  CompetitorSchema
);