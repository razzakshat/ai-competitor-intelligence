"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Competitor, scrapeCompetitor, deleteCompetitor } from "@/lib/api";

export default function CompetitorList({
  competitors,
  onUpdate,
}: {
  competitors: Competitor[];
  onUpdate: () => void;
}) {
  const [scrapingId, setScrapingId] = useState<string | null>(null);

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

  const handleDelete = async (id: string) => {
    await deleteCompetitor(id);
    onUpdate();
  };

  if (competitors.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-gray-500">
          No competitors added yet. Add one to get started.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {competitors.map((c) => (
        <Card key={c._id}>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>{c.name}</CardTitle>
              <a href={c.website} target="_blank" className="text-sm text-blue-600 hover:underline">
                {c.website}
              </a>
            </div>
            <Badge variant={c.lastScraped ? "default" : "secondary"}>
              {c.lastScraped ? "Monitored" : "Not scraped yet"}
            </Badge>
          </CardHeader>
          <CardContent>
            {c.description && (
              <p className="text-sm text-gray-600 mb-3">{c.description}</p>
            )}
            <p className="text-xs text-gray-400 mb-3">
              Last scraped: {c.lastScraped ? new Date(c.lastScraped).toLocaleString() : "Never"}
            </p>
            <div className="flex gap-2">
              <Button size="sm" onClick={() => handleScrape(c._id)} disabled={scrapingId === c._id}>
                {scrapingId === c._id ? "Scraping..." : "Scrape Now"}
              </Button>
              <Button size="sm" variant="destructive" onClick={() => handleDelete(c._id)}>
                Remove
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}