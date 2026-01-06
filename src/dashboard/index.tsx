import React, { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { getAggregatedData } from "../utils/storage";
import type { TimeRange, AggregatedData } from "../utils/types";
import { formatDuration, formatDurationLong } from "../utils/format";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import {
  Calendar,
  Clock,
  LayoutGrid,
  Shield,
  Target,
  TrendingUp,
} from "lucide-react";
import "../index.css";

const COLORS = [
  "#22d3ee", // Cyan 400
  "#3b82f6", // Blue 500
  "#818cf8", // Indigo 400
  "#c084fc", // Purple 400
  "#2dd4bf", // Teal 400
  "#fbbf24", // Amber 400
];

export function Dashboard() {
  const [range, setRange] = useState<TimeRange>("today");
  const [data, setData] = useState<AggregatedData>({
    totalTime: 0,
    byDomain: [],
  });
  const [view, setView] = useState<"dashboard" | "whitelist">("dashboard");

  useEffect(() => {
    const fetchData = async () => {
      const result = await getAggregatedData(range);
      setData(result);
    };
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, [range]);

  const navItems = [
    { id: "today", label: "Today", icon: Clock },
    { id: "week", label: "Week", icon: Calendar },
    { id: "month", label: "Month", icon: Calendar },
    { id: "all-time", label: "All Time", icon: LayoutGrid },
  ];

  return (
    <div className="min-h-screen bg-black text-white font-sans flex relative overflow-hidden selection:bg-cyan-500/30">
      {/* Background Gradients */}
      <div className="fixed top-[-20%] right-[-10%] w-[800px] h-[800px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="fixed bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-cyan-600/10 rounded-full blur-[100px] pointer-events-none"></div>

      {/* Sidebar */}
      <aside className="w-72 p-6 flex flex-col gap-10 border-r border-white/10 relative z-10 bg-black">
        <div className="flex items-center gap-3 px-2">
          <img
            src="/icon128.png"
            className="w-12 h-12 rounded-xl shadow-lg shadow-cyan-500/20"
            alt="Logo"
          />
          <div>
            <h1 className="font-bold text-xl tracking-tight">Time Tracker</h1>
            <p className="text-xs text-neutral-500 font-medium">
              Browsing Tracker
            </p>
          </div>
        </div>

        <nav className="flex-1 space-y-2">
          <div className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-4 px-2">
            Time Range
          </div>
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setRange(item.id as TimeRange);
                setView("dashboard");
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                range === item.id && view === "dashboard"
                  ? "bg-white/10 text-white shadow-inner"
                  : "text-neutral-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <item.icon
                className={`w-4 h-4 ${
                  range === item.id && view === "dashboard"
                    ? "text-cyan-400"
                    : ""
                }`}
              />
              {item.label}
            </button>
          ))}

          <div className="mt-10 text-xs font-bold text-neutral-500 uppercase tracking-widest mb-4 px-2">
            Configuration
          </div>
          <button
            onClick={() => setView("whitelist")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
              view === "whitelist"
                ? "bg-white/10 text-white shadow-inner"
                : "text-neutral-400 hover:bg-white/5 hover:text-white"
            }`}
          >
            <Shield
              className={`w-4 h-4 ${
                view === "whitelist" ? "text-cyan-400" : ""
              }`}
            />
            Excluded Sites
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10 overflow-y-auto relative z-10">
        <header className="mb-10">
          <h2 className="text-4xl font-black tracking-tight mb-2 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500">
            {view === "dashboard" ? "Your Performance" : "Settings"}
          </h2>
          <p className="text-neutral-400 font-medium">
            {view === "dashboard"
              ? `Deep dive into your focus metrics for ${range.replace(
                  "-",
                  " "
                )}.`
              : "Manage websites that don't count towards your time."}
          </p>
        </header>

        {view === "dashboard" && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors group relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/10 rounded-bl-full blur-2xl group-hover:bg-cyan-500/20 transition-colors"></div>
                <h3 className="text-sm font-semibold text-cyan-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Total Browsing
                </h3>
                <div className="text-4xl font-bold text-white tracking-tight">
                  {formatDuration(data.totalTime)}
                </div>
              </div>
              <div className="p-6 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors group relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/10 rounded-bl-full blur-2xl group-hover:bg-purple-500/20 transition-colors"></div>
                <h3 className="text-sm font-semibold text-purple-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  Most Visited
                </h3>
                <div className="text-2xl font-bold truncate text-white">
                  {data.byDomain[0]?.domain || "-"}
                </div>
                <div className="text-sm text-neutral-400 mt-1 font-mono">
                  {data.byDomain[0]
                    ? formatDuration(data.byDomain[0].time)
                    : ""}
                </div>
              </div>
              <div className="p-6 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors group relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-bl-full blur-2xl group-hover:bg-amber-500/20 transition-colors"></div>
                <h3 className="text-sm font-semibold text-amber-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  Unique Sites
                </h3>
                <div className="text-4xl font-bold text-white tracking-tight">
                  {data.byDomain.length}
                </div>
              </div>
            </div>

            {/* Charts Area */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="p-8 rounded-2xl bg-white/5 border border-white/5 flex flex-col relative overflow-hidden [&_.recharts-sector]:outline-none [&_.recharts-pie]:outline-none">
                <h3 className="text-lg font-bold mb-8 text-neutral-200">
                  Distribution
                </h3>
                <div className="flex-1 min-h-0 relative z-10">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={data.byDomain.slice(0, 8)}
                        dataKey="time"
                        nameKey="domain"
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        stroke="none"
                      >
                        {data.byDomain.slice(0, 8).map((_, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(
                          value:
                            | number
                            | string
                            | ReadonlyArray<number | string>
                            | null
                            | undefined
                        ) => [formatDuration(Number(value) || 0), "Time"]}
                        contentStyle={{
                          backgroundColor: "#09090b",
                          borderColor: "rgba(255,255,255,0.1)",
                          borderRadius: "12px",
                          color: "#fff",
                        }}
                        itemStyle={{ color: "#e4e4e7" }}
                        cursor={{ fill: "transparent" }}
                      />
                    </PieChart>
                  </ResponsiveContainer>

                  {/* Legend Overlay */}
                  <div className="absolute bottom-0 right-0 p-4 max-h-[150px] overflow-y-auto scrollbar-hide w-1/3">
                    {data.byDomain.slice(0, 5).map((d, i) => (
                      <div
                        key={d.domain}
                        className="flex items-center gap-2 mb-2 text-xs"
                      >
                        <div
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: COLORS[i % COLORS.length] }}
                        ></div>
                        <span className="truncate text-neutral-400">
                          {d.domain}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-8 rounded-2xl bg-white/5 border border-white/5 flex flex-col max-h-[450px]">
                <h3 className="text-lg font-bold mb-8 text-neutral-200">
                  Detailed Activity
                </h3>
                <div className="flex-1 overflow-y-auto pr-2 space-y-2">
                  {data.byDomain.map((site, index) => (
                    <div
                      key={site.domain}
                      className="group flex items-center justify-between p-4 rounded-xl hover:bg-white/5 transition-all duration-200"
                    >
                      <div className="flex items-center gap-4 overflow-hidden">
                        <span className="text-xs font-mono text-neutral-600 w-6 group-hover:text-cyan-500 transition-colors">
                          {index + 1}
                        </span>
                        <img
                          src={
                            site.favicon ||
                            `https://www.google.com/s2/favicons?domain=${site.domain}`
                          }
                          className="w-8 h-8 rounded-lg bg-black/50 p-1 opacity-70 group-hover:opacity-100 transition-all grayscale group-hover:grayscale-0"
                          alt=""
                        />
                        <div className="flex flex-col overflow-hidden">
                          <span className="truncate font-semibold text-sm text-neutral-300 group-hover:text-white transition-colors">
                            {site.domain}
                          </span>
                          <div className="h-1 w-24 bg-neutral-800 rounded-full mt-1 overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-cyan-600 to-blue-600"
                              style={{
                                width: `${Math.min(
                                  (site.time / (data.byDomain[0]?.time || 1)) *
                                    100,
                                  100
                                )}%`,
                              }}
                            ></div>
                          </div>
                        </div>
                      </div>
                      <span className="text-sm font-mono font-bold text-neutral-500 group-hover:text-cyan-400 transition-colors whitespace-nowrap">
                        {formatDurationLong(site.time)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {view === "whitelist" && (
          <div className="p-8 rounded-2xl bg-white/5 border border-white/5 animate-in fade-in duration-500">
            <p className="text-neutral-400 mb-4">
              Add domains here to exclude them from tracking.
            </p>
            <div className="p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20 text-yellow-200 text-sm">
              Feature currently under development. All sites are tracked by
              default.
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Dashboard />
  </React.StrictMode>
);
