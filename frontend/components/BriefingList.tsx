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
  medium: "bg-indigo-950/50 text-indigo-400 border-indigo-500/20",
  high: "bg-rose-950/40 text-rose-400 border-rose-500/20 shadow-[0_0_15px_rgba(244,63,94,0.1)]",
} as const;

export default function BriefingList({ briefings }: { briefings: Briefing[] }) {
  if (briefings.length === 0) {
    return (
      <Card className="bg-[#0b0f19]/25 backdrop-blur-xl border border-indigo-950/40 py-16 text-center text-slate-500 rounded-2xl">
        <CardContent className="flex flex-col items-center justify-center space-y-3">
          <AlertTriangle className="h-10 w-10 text-slate-700" />
          <p className="text-sm font-medium">No briefings generated yet. Analyze a competitor to generate intelligence.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {briefings.map((b) => (
        <Card key={b._id} className="bg-[#0b0f19]/40 backdrop-blur-xl border border-indigo-950/60 shadow-xl overflow-hidden rounded-2xl relative group">
          {/* Top border ambient indicator based on significance */}
          <div className={`absolute top-0 inset-x-0 h-[3px] bg-gradient-to-r ${
            b.significance === "high" 
              ? "from-rose-500/40 to-violet-600/40" 
              : b.significance === "medium"
              ? "from-indigo-500/40 to-violet-500/40"
              : "from-slate-700/20 to-slate-600/20"
          }`} />

          <CardHeader className="flex flex-row items-center justify-between border-b border-indigo-950/40 pb-4">
            <div>
              <span className="text-[10px] font-semibold tracking-wider text-indigo-400 uppercase">Competitive Briefing</span>
              <CardTitle className="text-xl font-bold text-white mt-0.5">{b.competitorName}</CardTitle>
            </div>
            <Badge className={`text-xs font-semibold px-2.5 py-0.5 border rounded-full ${significanceBadge[b.significance]}`}>
              {b.significance.toUpperCase()} IMPACT
            </Badge>
          </CardHeader>
          
          <CardContent className="py-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-5">
              {/* Summary */}
              <div className="space-y-1.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <FileText className="h-3.5 w-3.5 text-indigo-400" />
                  Executive Summary
                </h4>
                <p className="text-sm text-slate-300 leading-relaxed bg-slate-950/20 p-3 rounded-xl border border-indigo-950/20">
                  {b.summary}
                </p>
              </div>

              {/* What Changed */}
              <div className="space-y-1.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Zap className="h-3.5 w-3.5 text-amber-400" />
                  Observed Activity & Changes
                </h4>
                <p className="text-sm text-slate-300 leading-relaxed bg-slate-950/20 p-3 rounded-xl border border-indigo-950/20">
                  {b.changes}
                </p>
              </div>
            </div>

            <div className="space-y-5">
              {/* Strategic Insights */}
              <div className="space-y-1.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <BrainCircuit className="h-3.5 w-3.5 text-violet-400" />
                  Strategic Insights
                </h4>
                <p className="text-sm text-slate-300 leading-relaxed bg-slate-950/20 p-3 rounded-xl border border-indigo-950/20">
                  {b.strategicInsights}
                </p>
              </div>

              {/* Recommendations */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Lightbulb className="h-3.5 w-3.5 text-emerald-400" />
                  Actionable Recommendations
                </h4>
                <ul className="space-y-2 bg-slate-950/20 p-3.5 rounded-xl border border-indigo-950/20">
                  {b.recommendations.split("\n").filter(Boolean).map((rec, i) => {
                    // Clean up markdown bullet points if present
                    const cleanRec = rec.replace(/^-\s*/, "").replace(/^\d+\.\s*/, "");
                    return (
                      <li key={i} className="flex items-start gap-2.5 text-sm text-slate-300 leading-snug">
                        <ArrowRightCircle className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{cleanRec}</span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>

            {/* Footer */}
            <div className="col-span-1 md:col-span-2 border-t border-indigo-950/40 pt-4 flex items-center justify-between text-[11px] text-slate-400">
              <span className="font-mono">Node ID: {b._id.slice(-8)}</span>
              <div className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5 text-slate-500" />
                <span>Generated: {new Date(b.createdAt).toLocaleString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}