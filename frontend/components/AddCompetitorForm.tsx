"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { createCompetitor } from "@/lib/api";
import { Plus, HelpCircle } from "lucide-react";

export default function AddCompetitorForm({ onAdded }: { onAdded: () => void }) {
  const [name, setName] = useState("");
  const [website, setWebsite] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !website) return;

    setLoading(true);
    try {
      await createCompetitor(name, website, description);
      setName("");
      setWebsite("");
      setDescription("");
      onAdded();
    } catch (error) {
      console.error("Failed to add competitor:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="bg-[#0b0f19]/40 backdrop-blur-xl border border-indigo-950/60 shadow-xl overflow-hidden relative group">
      {/* Decorative top border glow */}
      <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />
      
      <CardHeader className="space-y-1">
        <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
          <Plus className="h-5 w-5 text-indigo-400" />
          Add Competitor
        </CardTitle>
        <CardDescription className="text-slate-400 text-xs">
          Register a new competitor domain for tracking.
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <Label htmlFor="name" className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Company Name
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Stripe"
              required
              className="bg-slate-950/60 border-indigo-950/50 text-white placeholder-slate-600 focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/30 rounded-xl transition-all h-10"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="website" className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Website URL
            </Label>
            <Input
              id="website"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              placeholder="https://stripe.com"
              required
              type="url"
              className="bg-slate-950/60 border-indigo-950/50 text-white placeholder-slate-600 focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/30 rounded-xl transition-all h-10"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="description" className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Internal Context / Description
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Primary payment processing competitor. Focus on checkout updates."
              className="bg-slate-950/60 border-indigo-950/50 text-white placeholder-slate-600 focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/30 rounded-xl min-h-[90px] transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 active:scale-[0.98] transition-all rounded-xl cursor-pointer disabled:opacity-50 shadow-[0_0_15px_rgba(99,102,241,0.25)] hover:shadow-[0_0_20px_rgba(99,102,241,0.4)]"
          >
            {loading ? "Registering Node..." : "Register Competitor"}
          </button>
        </form>
      </CardContent>
    </Card>
  );
}