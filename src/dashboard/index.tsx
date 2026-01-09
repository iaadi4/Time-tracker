import React, { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import {
  getAggregatedData,
  getInsights,
  getStorageData,
  addToWhitelist,
  removeFromWhitelist,
  getSettings,
  setSettings,
} from "../utils/storage";
import type { TimeRange, AggregatedData, Insights } from "../utils/types";
import { formatDuration, formatDurationLong } from "../utils/format";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import {
  Calendar,
  Clock,
  LayoutGrid,
  Shield,
  Target,
  TrendingUp,
  Activity,
  BarChart3,
  Trash2,
  Plus,
  Settings as SettingsIcon,
} from "lucide-react";
import "../index.css";

const COLORS = [
  "#f87171", // Red 400
  "#fb923c", // Orange 400
  "#fbbf24", // Amber 400
  "#f472b6", // Pink 400
  "#e879f9", // Fuchsia 400
  "#c084fc", // Purple 400
];

export function Dashboard() {
  const [range, setRange] = useState<TimeRange>("today");
  const [data, setData] = useState<AggregatedData>({
    totalTime: 0,
    byDomain: [],
  });
  const [insights, setInsights] = useState<Insights>({
    mostActiveDay: null,
    dailyAverage: 0,
  });
  const [whitelist, setWhitelist] = useState<string[]>([]);
  const [newDomain, setNewDomain] = useState("");
  const [view, setView] = useState<"dashboard" | "whitelist" | "settings">(
    "dashboard"
  );
  const [trackingDelay, setTrackingDelay] = useState(15);

  const fetchData = async () => {
    const result = await getAggregatedData(range);
    const insightsResult = await getInsights(range);
    const whitelistData = await getStorageData("whitelist");
    setData(result);
    setInsights(insightsResult);
    setWhitelist(whitelistData.whitelist || []);
  };

  const fetchSettings = async () => {
    const settingsData = await getSettings();
    setTrackingDelay(settingsData.trackingDelaySeconds);
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, [range]);

  const handleAddWhitelist = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newDomain) {
      await addToWhitelist(newDomain);
      setNewDomain("");
      await fetchData();
    }
  };

  const handleRemoveWhitelist = async (domain: string) => {
    await removeFromWhitelist(domain);
    await fetchData();
  };

  const handleSaveSettings = async () => {
    await setSettings({ trackingDelaySeconds: trackingDelay });
  };

  const navItems = [
    { id: "today", label: "Today", icon: Clock },
    { id: "week", label: "Week", icon: Calendar },
    { id: "month", label: "Month", icon: Calendar },
    { id: "all-time", label: "All Time", icon: LayoutGrid },
  ];

  return (
    <div className="h-screen bg-black text-white font-sans flex relative overflow-hidden selection:bg-red-500/30">

      {/* Sidebar */}
      <aside className="w-72 h-full p-6 flex flex-col gap-10 border-r border-white/10 relative z-10 bg-black overflow-y-auto">
        <div className="flex items-center gap-3 px-2">
          <img
            src="/icon128.png"
            className="w-12 h-12 rounded-xl shadow-lg shadow-red-500/20"
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
                    ? "text-red-400"
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
                view === "whitelist" ? "text-red-400" : ""
              }`}
            />
            Excluded Sites
          </button>
          <button
            onClick={() => setView("settings")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
              view === "settings"
                ? "bg-white/10 text-white shadow-inner"
                : "text-neutral-400 hover:bg-white/5 hover:text-white"
            }`}
          >
            <SettingsIcon
              className={`w-4 h-4 ${view === "settings" ? "text-red-400" : ""}`}
            />
            Settings
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 flex flex-col overflow-hidden relative z-10">
        <header className="mb-8">
          <h2 className="text-4xl font-black tracking-tight mb-2 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500">
            {view === "dashboard" && "Your Performance"}
            {view === "whitelist" && "Excluded Sites"}
            {view === "settings" && "Settings"}
          </h2>
          <p className="text-neutral-400 font-medium">
            {view === "dashboard" &&
              `Deep dive into your focus metrics for ${range.replace(
                "-",
                " "
              )}.`}
            {view === "whitelist" && "Manage websites that won't be tracked."}
            {view === "settings" &&
              "Configure how the extension tracks your time."}
          </p>
        </header>

        {view === "dashboard" && (
          <div className="flex-1 flex flex-col min-h-0 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-2">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Total Browsing */}
              <div className="p-5 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors group relative overflow-hidden">
                <h3 className="text-xs font-semibold text-red-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5" />
                  Total Browsing
                </h3>
                <div className="text-3xl font-bold text-white tracking-tight">
                  {formatDuration(data.totalTime)}
                </div>
              </div>

              {/* Avg Per Site (Today) or Daily Average (other ranges) */}
              <div className="p-5 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors group relative overflow-hidden">
                <h3 className="text-xs font-semibold text-red-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                  <Activity className="w-3.5 h-3.5" />
                  {range === "today" ? "Avg Per Site" : "Daily Average"}
                </h3>
                <div className="text-3xl font-bold text-white tracking-tight">
                  {range === "today"
                    ? formatDuration(
                        data.byDomain.length > 0
                          ? Math.round(data.totalTime / data.byDomain.length)
                          : 0
                      )
                    : formatDuration(Math.round(insights.dailyAverage))}
                </div>
              </div>

              {/* Most Visited */}
              <div className="p-5 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors group relative overflow-hidden">
                <h3 className="text-xs font-semibold text-red-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                  <Target className="w-3.5 h-3.5" />
                  Most Visited
                </h3>
                <div className="text-xl font-bold truncate text-white">
                  {data.byDomain[0]?.domain || "-"}
                </div>
                <div className="text-xs text-neutral-400 mt-1 font-mono">
                  {data.byDomain[0]
                    ? formatDuration(data.byDomain[0].time)
                    : ""}
                </div>
              </div>

              {/* Unique Sites */}
              <div className="p-5 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors group relative overflow-hidden">
                <h3 className="text-xs font-semibold text-red-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                  <TrendingUp className="w-3.5 h-3.5" />
                  Unique Sites
                </h3>
                <div className="text-3xl font-bold text-white tracking-tight">
                  {data.byDomain.length}
                </div>
              </div>
            </div>

            {/* Most Active Day (Only show if not 'today' range or valid) */}
            {range !== "today" && insights.mostActiveDay && (
              <div className="p-5 rounded-2xl bg-gradient-to-r from-red-900/20 to-rose-900/20 border border-red-500/10 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-red-500/20 text-red-400">
                    <BarChart3 className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-red-200">
                      Most Active Day
                    </div>
                    <div className="text-white font-bold text-lg">
                      {insights.mostActiveDay.date}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-neutral-400">Total Duration</div>
                  <div className="text-2xl font-bold text-white">
                    {formatDuration(insights.mostActiveDay.time)}
                  </div>
                </div>
              </div>
            )}

            {/* Charts Area - Equal Width - Takes remaining space */}
            <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="p-6 rounded-2xl bg-white/5 border border-white/5 flex flex-col relative overflow-hidden h-full">
                <h3 className="text-lg font-bold mb-6 text-neutral-200">
                  Distribution
                </h3>
                <div className="flex-1 min-h-[250px] relative z-10 flex items-center gap-4">
                  <div className="w-2/3 h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={data.byDomain.slice(0, 8)}
                          dataKey="time"
                          nameKey="domain"
                          cx="50%"
                          cy="50%"
                          innerRadius={70}
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
                  </div>

                  {/* Legend Side */}
                  <div className="w-1/3 max-h-full overflow-y-auto custom-scrollbar pr-2 space-y-3">
                    {data.byDomain.slice(0, 8).map((d, i) => (
                      <div
                        key={d.domain}
                        className="flex items-center gap-2 text-xs"
                      >
                        <div
                          className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                          style={{ backgroundColor: COLORS[i % COLORS.length] }}
                        ></div>
                        <span
                          className="truncate text-neutral-300 font-medium"
                          title={d.domain}
                        >
                          {d.domain}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-white/5 border border-white/5 flex flex-col h-full overflow-hidden">
                <h3 className="text-lg font-bold mb-6 text-neutral-200 flex-shrink-0">
                  Detailed Activity
                </h3>
                <div className="flex-1 overflow-y-scroll pr-2 space-y-3">
                  {data.byDomain.map((site, index) => (
                    <div
                      key={site.domain}
                      className="group flex items-center justify-between p-4 rounded-xl hover:bg-white/5 transition-all duration-200 border border-transparent hover:border-white/5"
                    >
                      <div className="flex items-center gap-4 overflow-hidden flex-1">
                        <span className="text-xs font-mono text-neutral-600 w-6 group-hover:text-red-500 transition-colors flex-shrink-0">
                          {index + 1}
                        </span>
                        <img
                          src={
                            site.favicon ||
                            `https://www.google.com/s2/favicons?domain=${site.domain}`
                          }
                          className="w-8 h-8 rounded-lg bg-black/50 p-1 opacity-70 group-hover:opacity-100 transition-all grayscale group-hover:grayscale-0 flex-shrink-0"
                          alt=""
                        />
                        <div className="flex flex-col overflow-hidden flex-1 min-w-0">
                          <span className="truncate font-semibold text-sm text-neutral-300 group-hover:text-white transition-colors">
                            {site.domain}
                          </span>
                          <div className="h-1.5 w-full bg-neutral-800 rounded-full mt-2 overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-red-600 to-rose-600 rounded-full"
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
                      <span className="text-sm font-mono font-bold text-neutral-500 group-hover:text-red-400 transition-colors whitespace-nowrap ml-4">
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
          <div className="space-y-6 animate-in fade-in duration-500">
            <div className="p-8 rounded-2xl bg-white/5 border border-white/5">
              <h3 className="text-lg font-bold mb-2 text-neutral-200 flex items-center gap-2">
                <Shield className="w-5 h-5 text-red-400" />
                Excluded Domains
              </h3>
              <p className="text-sm text-neutral-400 mb-6">
                Add domains that should not be tracked. Time spent on these
                sites won't count towards your stats.
              </p>
              <form onSubmit={handleAddWhitelist} className="flex gap-4">
                <input
                  type="text"
                  value={newDomain}
                  onChange={(e) => setNewDomain(e.target.value)}
                  placeholder="example.com"
                  className="flex-1 bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500/50 transition-colors placeholder:text-neutral-600"
                />
                <button
                  type="submit"
                  disabled={!newDomain}
                  className="bg-red-500 text-white font-bold px-6 py-3 rounded-xl hover:bg-red-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Add Domain
                </button>
              </form>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {whitelist.map((domain) => (
                <div
                  key={domain}
                  className="p-4 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between group hover:border-red-500/30 transition-colors"
                >
                  <span className="font-medium text-neutral-300">{domain}</span>
                  <button
                    onClick={() => handleRemoveWhitelist(domain)}
                    className="p-2 rounded-lg text-neutral-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              {whitelist.length === 0 && (
                <div className="col-span-full p-8 text-center text-neutral-500 border border-dashed border-white/10 rounded-xl">
                  No excluded domains yet.
                </div>
              )}
            </div>
          </div>
        )}

        {view === "settings" && (
          <div className="space-y-6 animate-in fade-in duration-500">
            <div className="p-8 rounded-2xl bg-white/5 border border-white/5">
              <h3 className="text-lg font-bold mb-2 text-neutral-200 flex items-center gap-2">
                <SettingsIcon className="w-5 h-5 text-red-400" />
                Tracking Delay
              </h3>
              <p className="text-sm text-neutral-400 mb-6">
                Set how many seconds you need to stay on a website before it
                starts counting towards your tracked time. This helps filter out
                quick visits.
              </p>
              <div className="flex items-center gap-4">
                <input
                  type="number"
                  min={1}
                  max={100}
                  value={trackingDelay}
                  onChange={(e) => {
                    const val = Math.min(
                      100,
                      Math.max(1, parseInt(e.target.value) || 1)
                    );
                    setTrackingDelay(val);
                  }}
                  className="w-24 bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white text-center focus:outline-none focus:border-red-500/50 transition-colors"
                />
                <span className="text-neutral-400">seconds</span>
                <button
                  onClick={handleSaveSettings}
                  className="bg-red-500 text-white font-bold px-6 py-3 rounded-xl hover:bg-red-400 transition-colors flex items-center gap-2 ml-auto"
                >
                  Save
                </button>
              </div>
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
