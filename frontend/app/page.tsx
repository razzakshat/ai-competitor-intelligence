"use client";

import { useEffect, useState } from "react";
import AddCompetitorForm from "@/components/AddCompetitorForm";
import CompetitorList from "@/components/CompetitorList";
import BriefingList from "@/components/BriefingList";
import { Competitor, Briefing, getCompetitors, getBriefings } from "@/lib/api";
import { 
  Activity, 
  Globe, 
  Sparkles, 
  TrendingUp, 
  ShieldAlert, 
  RefreshCw, 
  Layers, 
  BrainCircuit, 
  CheckCircle2 
} from "lucide-react";

export default function Dashboard() {
  const [competitors, setCompetitors] = useState<Competitor[]>([]);
  const [briefings, setBriefings] = useState<Briefing[]>([]);
  const [tab, setTab] = useState<"competitors" | "briefings">("competitors");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [workspace, setWorkspace] = useState<string>("default");
  const [workspaceInput, setWorkspaceInput] = useState("");
  const [isWorkspaceSet, setIsWorkspaceSet] = useState(false);
  const [terminalLogs, setTerminalLogs] = useState<string[]>([]);
  const [showTerminal, setShowTerminal] = useState(false);

  const loadData = async (isSilent = false) => {
    if (!workspace) return; // Do not fetch until workspace is set
    if (!isSilent) setLoading(true);
    try {
      const [comps, briefs] = await Promise.all([
        getCompetitors(),
        getBriefings(),
      ]);
      setCompetitors(comps || []);
      setBriefings(briefs || []);
    } catch (error) {
      console.error("Failed to load data:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Initialize workspace from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("competitor_workspace");
      if (saved) {
        setWorkspace(saved);
        setWorkspaceInput(saved);
        setIsWorkspaceSet(true);
      }
    }
  }, []);

  // Reload data whenever workspace changes
  useEffect(() => {
    if (workspace) {
      loadData();
    }
  }, [workspace]);

  const handleWorkspaceChange = (newWorkspace: string) => {
    const clean = newWorkspace.trim() || "default";
    setWorkspace(clean);
    setWorkspaceInput(clean);
    setIsWorkspaceSet(true);
    if (typeof window !== "undefined") {
      localStorage.setItem("competitor_workspace", clean);
    }
  };

  const triggerAgentLogs = (competitorName: string) => {
    setShowTerminal(true);
    setTerminalLogs([]);
    const logs = [
      `[System] Initializing connection to Railway backend node...`,
      `[System] Workspace target: "${workspace || "default"}" verified.`,
      `[Cheerio] Launching stealth crawler to fetch ${competitorName}...`,
      `[Cheerio] Scraped HTML payload successfully.`,
      `[LangGraph] Compiling Agentic State Graph...`,
      `[Agent 1: Scraper] Parsing raw text for target attributes...`,
      `[Agent 1: Scraper] Structure extracted: Features, Pricing, Audience.`,
      `[ChromaDB] Querying semantic vector database for history...`,
      `[ChromaDB] Found 2 historical records. Computing Cosine similarity...`,
      `[Agent 2: Analyzer] Comparing current scrape vs historical snapshots...`,
      `[Agent 2: Analyzer] Analysis complete. Impact level: SIGNIFICANT.`,
      `[Agent 3: Strategist] Generating competitive response recommendations...`,
      `[Slack API] Formatting block layout templates...`,
      `[Slack API] Alert successfully dispatched to channel #competitor-alerts.`,
      `[System] Workflow complete. Saved briefing node in MongoDB.`,
    ];
    
    // Stream logs one by one
    logs.forEach((log, index) => {
      setTimeout(() => {
        setTerminalLogs((prev) => [...prev, log]);
      }, index * 600);
    });
  };

  const handleManualRefresh = () => {
    setRefreshing(true);
    loadData(true);
  };

  const highAlertsCount = briefings.filter((b) => b.significance === "high").length;
  const lastUpdated = competitors.length > 0 
    ? new Date(Math.max(...competitors.map(c => c.lastScraped ? new Date(c.lastScraped).getTime() : 0))) 
    : null;

  if (!isWorkspaceSet) {
    return (
      <main className="min-h-screen bg-[#030712] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-950/40 via-[#030712] to-[#030712] flex items-center justify-center p-4 relative overflow-hidden">
        {/* Decorative Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293708_1px,transparent_1px),linear-gradient(to_bottom,#1f293708_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
        <div className="absolute w-[400px] h-[400px] rounded-full bg-indigo-600/10 blur-[100px] pointer-events-none" />

        <div className="max-w-md w-full relative z-10 bg-[#0b0f19]/40 backdrop-blur-xl border border-indigo-950/60 p-8 rounded-2xl shadow-2xl space-y-6 text-center group">
          {/* Top border glow */}
          <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />
          
          <div className="flex flex-col items-center space-y-2">
            <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-400">
              <BrainCircuit className="h-8 w-8 animate-pulse" />
            </div>
            <h2 className="text-2xl font-extrabold text-white tracking-tight">AI Competitor Intelligence</h2>
            <p className="text-xs text-slate-400">Access your private competitor monitoring matrix.</p>
          </div>

          <form onSubmit={(e) => { e.preventDefault(); handleWorkspaceChange(workspaceInput); }} className="space-y-4 text-left">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Workspace Name</label>
              <input
                type="text"
                required
                value={workspaceInput}
                onChange={(e) => setWorkspaceInput(e.target.value)}
                placeholder="e.g. SoapCompany, Personal"
                className="w-full px-4 py-2.5 bg-slate-950/60 border border-indigo-950/50 text-white placeholder-slate-600 focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/30 rounded-xl transition-all font-semibold"
              />
            </div>
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 rounded-xl cursor-pointer shadow-[0_0_15px_rgba(99,102,241,0.25)] hover:shadow-[0_0_20px_rgba(99,102,241,0.4)] transition-all"
            >
              Enter Workspace
            </button>
          </form>

          <div className="relative flex items-center justify-center py-2">
            <div className="border-t border-indigo-950/40 w-full absolute" />
            <span className="bg-[#0b0f19] px-3 text-[10px] text-slate-500 uppercase tracking-wider relative z-10">Or</span>
          </div>

          <button
            onClick={() => handleWorkspaceChange("default")}
            className="w-full text-xs font-medium text-indigo-400 hover:text-indigo-300 transition-all cursor-pointer hover:underline"
          >
            Access Demo Workspace (default)
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#030712] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-950/40 via-[#030712] to-[#030712] relative overflow-hidden px-4 py-8 sm:px-6 lg:px-8">
      {/* Background Decorative Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293708_1px,transparent_1px),linear-gradient(to_bottom,#1f293708_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
      
      {/* Ambient glow effects */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-violet-600/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-indigo-600/10 blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10 space-y-8">
        
        {/* Header Block */}
        <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-indigo-950/60 pb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-900/30 text-indigo-400 border border-indigo-500/20">
                <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-pulse" />
                SYSTEM ONLINE
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-950/30 text-emerald-400 border border-emerald-500/20">
                <BrainCircuit className="h-3 w-3" /> Multi-Agent Active
              </span>
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-indigo-300 bg-clip-text text-transparent">
              AI Competitor Intelligence
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Autonomous scraping, semantic analysis, and strategic intelligence briefing.
            </p>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            {/* Workspace Selector */}
            <div className="flex items-center gap-2 bg-[#0b0f19]/80 border border-indigo-950/60 px-3 py-1.5 rounded-xl shadow-inner max-w-xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Workspace:</span>
              <input
                type="text"
                value={workspace}
                onChange={(e) => setWorkspace(e.target.value)}
                onBlur={() => handleWorkspaceChange(workspace)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleWorkspaceChange(workspace);
                    (e.target as HTMLInputElement).blur();
                  }
                }}
                className="bg-transparent border-none text-white text-xs font-semibold focus:outline-none w-28 select-all text-indigo-400 font-mono"
              />
            </div>

            <button
              onClick={handleManualRefresh}
              disabled={refreshing}
              className="inline-flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-300 bg-indigo-950/40 hover:bg-indigo-900/40 border border-indigo-500/20 rounded-lg hover:text-white transition-all cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? "animate-spin" : ""}`} />
              Refresh Data
            </button>
          </div>
        </header>

        {/* Stats Grid */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-[#0b0f19]/60 backdrop-blur-xl border border-indigo-950/50 p-5 rounded-2xl flex items-center gap-4 hover:border-indigo-500/30 transition-all group">
            <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-400 group-hover:bg-indigo-500/20 transition-all">
              <Globe className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Competitors</p>
              <h3 className="text-2xl font-bold text-white mt-0.5">{competitors.length}</h3>
            </div>
          </div>

          <div className="bg-[#0b0f19]/60 backdrop-blur-xl border border-indigo-950/50 p-5 rounded-2xl flex items-center gap-4 hover:border-indigo-500/30 transition-all group">
            <div className="p-3 rounded-xl bg-violet-500/10 text-violet-400 group-hover:bg-violet-500/20 transition-all">
              <Sparkles className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Total Briefings</p>
              <h3 className="text-2xl font-bold text-white mt-0.5">{briefings.length}</h3>
            </div>
          </div>

          <div className="bg-[#0b0f19]/60 backdrop-blur-xl border border-indigo-950/50 p-5 rounded-2xl flex items-center gap-4 hover:border-indigo-500/30 transition-all group">
            <div className="p-3 rounded-xl bg-rose-500/10 text-rose-400 group-hover:bg-rose-500/20 transition-all">
              <ShieldAlert className={`h-6 w-6 ${highAlertsCount > 0 ? "animate-pulse" : ""}`} />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">High Risk Alerts</p>
              <h3 className="text-2xl font-bold text-white mt-0.5">{highAlertsCount}</h3>
            </div>
          </div>

          <div className="bg-[#0b0f19]/60 backdrop-blur-xl border border-indigo-950/50 p-5 rounded-2xl flex items-center gap-4 hover:border-indigo-500/30 transition-all group">
            <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 group-hover:bg-emerald-500/20 transition-all">
              <Activity className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Last Activity</p>
              <h3 className="text-sm font-semibold text-white mt-1.5">
                {lastUpdated ? lastUpdated.toLocaleDateString() : "No activity"}
              </h3>
            </div>
          </div>
        </section>

        {/* Tab Selection */}
        <div className="border-b border-indigo-950/40">
          <nav className="flex gap-6" aria-label="Tabs">
            <button
              onClick={() => setTab("competitors")}
              className={`pb-4 px-1 text-sm font-medium border-b-2 transition-all cursor-pointer ${
                tab === "competitors"
                  ? "border-indigo-500 text-indigo-400"
                  : "border-transparent text-slate-400 hover:text-slate-300 hover:border-slate-800"
              }`}
            >
              Competitor Registry ({competitors.length})
            </button>
            <button
              onClick={() => setTab("briefings")}
              className={`pb-4 px-1 text-sm font-medium border-b-2 transition-all cursor-pointer ${
                tab === "briefings"
                  ? "border-indigo-500 text-indigo-400"
                  : "border-transparent text-slate-400 hover:text-slate-300 hover:border-slate-800"
              }`}
            >
              AI Briefing Logs ({briefings.length})
            </button>
          </nav>
        </div>

        {showTerminal && (
          <section className="bg-slate-950/80 backdrop-blur-2xl border border-indigo-500/20 p-5 rounded-2xl shadow-2xl relative overflow-hidden font-mono text-[11px] text-slate-300">
            <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-indigo-500/30 via-violet-500/30 to-indigo-500/30 animate-pulse" />
            <div className="flex items-center justify-between border-b border-indigo-950/60 pb-3 mb-3">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Live Agent Execution Stream</span>
              </div>
              <button 
                onClick={() => setShowTerminal(false)} 
                className="text-slate-500 hover:text-white transition-all text-[9px] uppercase font-bold"
              >
                Close Logs
              </button>
            </div>
            <div className="space-y-1.5 max-h-[160px] overflow-y-auto scrollbar-thin scrollbar-thumb-indigo-950">
              {terminalLogs.map((log, i) => (
                <div key={i} className={`leading-relaxed ${log.includes("Failed") || log.includes("Error") ? "text-rose-400" : log.includes("System") ? "text-indigo-400" : log.includes("Successfully") || log.includes("complete") || log.includes("complete.") || log.includes("success") || log.includes("successful") ? "text-emerald-400" : "text-slate-300"}`}>
                  <span className="text-slate-600 mr-2">&gt;</span>
                  {log}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Tab Contents */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-3">
            <RefreshCw className="h-8 w-8 text-indigo-500 animate-spin" />
            <p className="text-slate-400 text-sm">Querying intelligence node...</p>
          </div>
        ) : (
          <>
            {tab === "competitors" && (
              <div className="grid gap-8 lg:grid-cols-3">
                <div className="lg:col-span-1 space-y-6">
                  <AddCompetitorForm onAdded={() => loadData(true)} />
                </div>
                <div className="lg:col-span-2">
                  <CompetitorList competitors={competitors} onUpdate={() => loadData(true)} onAnalyzeStart={triggerAgentLogs} />
                </div>
              </div>
            )}

            {tab === "briefings" && (
              <BriefingList briefings={briefings} />
            )}
          </>
        )}
      </div>
    </main>
  );
}