"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Briefing } from "@/lib/api";
import { 
  FileText, 
  Zap, 
  BrainCircuit, 
  Lightbulb, 
  Calendar, 
  ArrowRightCircle,
  AlertTriangle
} from "lucide-react";

const significanceBadge = {
  low: "bg-slate-900/50 text-slate-400 border-slate-800",
  medium: "bg-indigo-950/50 text-indigo-400 border-indigo-500/30",
  high: "bg-rose-950/40 text-rose-400 border-rose-500/30 shadow-[0_0_15px_rgba(244,63,94,0.15)]",
} as const;

export default function BriefingList({ briefings }: { briefings: Briefing[] }) {
  if (briefings.length === 0) {
    return (
      <Card className="bg-[#0b0f19]/25 backdrop-blur-xl border border-indigo-950/40 py-16 text-center text-slate-500 rounded-2xl">
        <CardContent className="flex flex-col items-center justify-center space-y-3">
          <AlertTriangle className="h-10 w-10 text-slate-700 animate-pulse" />
          <p className="text-sm font-medium">No briefings generated yet. Run analysis on a competitor node.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {briefings.map((b) => (
        <Card key={b._id} className="bg-[#0b0f19]/40 backdrop-blur-xl border border-indigo-950/60 hover:border-indigo-500/40 shadow-2xl overflow-hidden rounded-2xl relative group transition-all duration-300 hover:-translate-y-0.5">
          {/* Top border ambient indicator based on significance */}
          <div className={`absolute top-0 inset-x-0 h-[3px] bg-gradient-to-r ${
            b.significance === "high" 
              ? "from-rose-500 via-violet-600 to-rose-500" 
              : b.significance === "medium"
              ? "from-indigo-500 via-violet-500 to-indigo-500"
              : "from-slate-700 to-slate-600"
          }`} />

          <CardHeader className="flex flex-row items-center justify-between border-b border-indigo-950/40 pb-4">
            <div>
              <span className="text-[9px] font-bold tracking-widest text-indigo-400 uppercase">Tactical Intelligence Briefing</span>
              <CardTitle className="text-xl font-extrabold text-white mt-0.5">{b.competitorName}</CardTitle>
            </div>
            <Badge className={`text-[10px] font-bold px-3 py-1 border rounded-full tracking-wider ${significanceBadge[b.significance]}`}>
              {b.significance.toUpperCase()} IMPACT ALERT
            </Badge>
          </CardHeader>
          
          <CardContent className="py-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-5">
              {/* Summary */}
              <div className="space-y-2">
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
                  <FileText className="h-4 w-4 text-indigo-400" />
                  Executive Summary
                </h4>
                <div className="text-sm text-slate-300 leading-relaxed bg-slate-950/40 p-4 rounded-xl border border-indigo-950/30 shadow-inner">
                  {b.summary}
                </div>
              </div>

              {/* What Changed */}
              <div className="space-y-2">
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
                  <Zap className="h-4 w-4 text-amber-400" />
                  Observed Activities & Changes
                </h4>
                <div className="text-sm text-slate-300 leading-relaxed bg-slate-950/40 p-4 rounded-xl border border-indigo-950/30 shadow-inner">
                  {b.changes}
                </div>
              </div>
            </div>

            <div className="space-y-5">
              {/* Strategic Insights */}
              <div className="space-y-2">
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
                  <BrainCircuit className="h-4 w-4 text-violet-400" />
                  Strategic Insights
                </h4>
                <div className="text-sm text-slate-300 leading-relaxed bg-slate-950/40 p-4 rounded-xl border border-indigo-950/30 shadow-inner">
                  {b.strategicInsights}
                </div>
              </div>

              {/* Recommendations */}
              <div className="space-y-2">
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
                  <Lightbulb className="h-4 w-4 text-emerald-400" />
                  Actionable Recommendations
                </h4>
                <ul className="space-y-2.5 bg-slate-950/40 p-4 rounded-xl border border-indigo-950/30 shadow-inner">
                  {b.recommendations.split("\n").filter(Boolean).map((rec, i) => {
                    const cleanRec = rec.replace(/^-\s*/, "").replace(/^\d+\.\s*/, "");
                    return (
                      <li key={i} className="flex items-start gap-2.5 text-xs text-slate-300 leading-relaxed">
                        <ArrowRightCircle className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{cleanRec}</span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>

            {/* Footer */}
            <div className="col-span-1 md:col-span-2 border-t border-indigo-950/40 pt-4 flex items-center justify-between text-[10px] text-slate-500">
              <span className="font-mono">INTELLIGENCE ID: {b._id.toUpperCase()}</span>
              <div className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5 text-slate-600" />
                <span>Generated: {new Date(b.createdAt).toLocaleString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}