"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Competitor, scrapeCompetitor, deleteCompetitor, api } from "@/lib/api";
import { 
  RefreshCw, 
  BrainCircuit, 
  Trash2, 
  ExternalLink, 
  Clock, 
  Activity 
} from "lucide-react";

export default function CompetitorList({
  competitors,
  onUpdate,
}: {
  competitors: Competitor[];
  onUpdate: () => void;
}) {
  const [scrapingId, setScrapingId] = useState<string | null>(null);
  const [analyzingId, setAnalyzingId] = useState<string | null>(null);

  const handleScrape = async (id: string) => {
    setScrapingId(id);
    try {
      await scrapeCompetitor(id);
      onUpdate();
    } catch (error) {
      console.error("Scrape failed:", error);
    } finally {
      setScrapingId(null);
    }
  };

  const handleAnalyze = async (id: string) => {
    setAnalyzingId(id);
    try {
      await api.post(`/competitors/${id}/analyze`);
      onUpdate();
      alert("Analysis complete! Check the Briefings tab.");
    } catch (error) {
      console.error("Analysis failed:", error);
      alert("Analysis failed. Check console.");
    } finally {
      setAnalyzingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to remove this competitor?")) return;
    await deleteCompetitor(id);
    onUpdate();
  };

  if (competitors.length === 0) {
    return (
      <Card className="bg-[#0b0f19]/25 backdrop-blur-xl border border-indigo-950/40 py-12 text-center text-slate-500 rounded-2xl">
        <CardContent className="flex flex-col items-center justify-center space-y-3">
          <GlobeIcon className="h-10 w-10 text-slate-700" />
          <p className="text-sm font-medium">No competitors registered in the intelligence matrix.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {competitors.map((c) => (
        <Card key={c._id} className="bg-[#0b0f19]/40 backdrop-blur-xl border border-indigo-950/60 hover:border-indigo-500/30 shadow-lg hover:shadow-[0_0_20px_rgba(99,102,241,0.1)] transition-all duration-300 rounded-2xl relative overflow-hidden group">
          {/* Accent glow corner */}
          <div className="absolute top-0 right-0 w-[80px] h-[80px] bg-gradient-to-bl from-indigo-500/5 to-transparent rounded-bl-full pointer-events-none" />
          
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div className="space-y-1">
              <CardTitle className="text-lg font-bold text-white flex items-center gap-1.5">
                {c.name}
              </CardTitle>
              <a 
                href={c.website} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-xs text-indigo-400 hover:text-indigo-300 inline-flex items-center gap-1 hover:underline transition-all"
              >
                {c.website}
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
            
            <Badge 
              className={`text-[10px] font-semibold uppercase tracking-wider rounded-full px-2 py-0.5 border ${
                c.lastScraped 
                  ? "bg-indigo-950/50 text-indigo-400 border-indigo-500/30" 
                  : "bg-slate-950/50 text-slate-400 border-slate-800"
              }`}
            >
              {c.lastScraped ? "MONITORED" : "NEW NODE"}
            </Badge>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {c.description && (
              <p className="text-xs text-slate-300 bg-slate-950/30 border border-slate-950/40 p-2.5 rounded-xl">
                {c.description}
              </p>
            )}
            
            <div className="flex items-center justify-between text-[11px] text-slate-400 border-t border-indigo-950/40 pt-3">
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3 text-slate-500" />
                <span>Last scraped:</span>
              </div>
              <span className="font-semibold text-slate-300">
                {c.lastScraped ? new Date(c.lastScraped).toLocaleString() : "Never"}
              </span>
            </div>

            <div className="flex gap-2 flex-wrap border-t border-indigo-950/20 pt-3">
              <button 
                onClick={() => handleScrape(c._id)} 
                disabled={scrapingId === c._id || analyzingId === c._id}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 border border-indigo-950/50 rounded-xl cursor-pointer hover:border-indigo-500/30 transition-all disabled:opacity-50"
              >
                <RefreshCw className={`h-3 w-3 ${scrapingId === c._id ? "animate-spin" : ""}`} />
                {scrapingId === c._id ? "Scraping..." : "Scrape Now"}
              </button>

              <button 
                onClick={() => handleAnalyze(c._id)} 
                disabled={scrapingId === c._id || analyzingId === c._id}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-gradient-to-r from-indigo-600/80 to-violet-600/80 hover:from-indigo-500 hover:to-violet-500 rounded-xl cursor-pointer shadow-[0_0_10px_rgba(99,102,241,0.15)] hover:shadow-[0_0_15px_rgba(99,102,241,0.35)] transition-all disabled:opacity-50"
              >
                <BrainCircuit className={`h-3.5 w-3.5 ${analyzingId === c._id ? "animate-pulse" : ""}`} />
                {analyzingId === c._id ? "Analyzing..." : "Full Analysis"}
              </button>

              <button 
                onClick={() => handleDelete(c._id)} 
                disabled={scrapingId === c._id || analyzingId === c._id}
                className="inline-flex items-center gap-1.5 ml-auto px-2.5 py-1.5 text-xs font-medium text-rose-400 hover:text-rose-300 bg-rose-950/10 hover:bg-rose-950/30 border border-rose-900/20 rounded-xl cursor-pointer transition-all disabled:opacity-50"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Remove
              </button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// Simple fallback global icon
function GlobeIcon(props: React.ComponentProps<"svg">) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
      <path d="M2 12h20" />
    </svg>
  );
}