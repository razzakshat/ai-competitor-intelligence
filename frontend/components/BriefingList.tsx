"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Briefing } from "@/lib/api";

const significanceColor = {
  low: "secondary",
  medium: "default",
  high: "destructive",
} as const;

export default function BriefingList({ briefings }: { briefings: Briefing[] }) {
  if (briefings.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-gray-500">
          No briefings generated yet. Scrape a competitor to generate intelligence.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {briefings.map((b) => (
        <Card key={b._id}>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>{b.competitorName}</CardTitle>
            <Badge variant={significanceColor[b.significance]}>
              {b.significance.toUpperCase()}
            </Badge>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="font-semibold text-sm">Summary</p>
              <p className="text-sm text-gray-600">{b.summary}</p>
            </div>
            <div>
              <p className="font-semibold text-sm">What Changed</p>
              <p className="text-sm text-gray-600">{b.changes}</p>
            </div>
            <div>
              <p className="font-semibold text-sm">Strategic Insights</p>
              <p className="text-sm text-gray-600">{b.strategicInsights}</p>
            </div>
            <div>
              <p className="font-semibold text-sm">Recommendations</p>
              <p className="text-sm text-gray-600 whitespace-pre-line">
                {b.recommendations}
              </p>
            </div>
            <p className="text-xs text-gray-400">
              {new Date(b.createdAt).toLocaleString()}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}