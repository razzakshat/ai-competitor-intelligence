"use client";

import { useEffect, useState } from "react";
import AddCompetitorForm from "@/components/AddCompetitorForm";
import CompetitorList from "@/components/CompetitorList";
import BriefingList from "@/components/BriefingList";
import { Competitor, Briefing, getCompetitors, getBriefings } from "@/lib/api";

export default function Dashboard() {
  const [competitors, setCompetitors] = useState<Competitor[]>([]);
  const [briefings, setBriefings] = useState<Briefing[]>([]);
  const [tab, setTab] = useState<"competitors" | "briefings">("competitors");

  const loadData = async () => {
    try {
      const [comps, briefs] = await Promise.all([
        getCompetitors(),
        getBriefings(),
      ]);
      setCompetitors(comps);
      setBriefings(briefs);
    } catch (error) {
      console.error("Failed to load data:", error);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <main className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-2">AI Competitor Intelligence</h1>
      <p className="text-gray-500 mb-6">
        Automated competitor monitoring powered by AI agents
      </p>

      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setTab("competitors")}
          className={`px-4 py-2 rounded ${
            tab === "competitors" ? "bg-black text-white" : "bg-gray-200"
          }`}
        >
          Competitors ({competitors.length})
        </button>
        <button
          onClick={() => setTab("briefings")}
          className={`px-4 py-2 rounded ${
            tab === "briefings" ? "bg-black text-white" : "bg-gray-200"
          }`}
        >
          Briefings ({briefings.length})
        </button>
      </div>

      {tab === "competitors" && (
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <AddCompetitorForm onAdded={loadData} />
          </div>
          <div>
            <CompetitorList competitors={competitors} onUpdate={loadData} />
          </div>
        </div>
      )}

      {tab === "briefings" && <BriefingList briefings={briefings} />}
    </main>
  );
}