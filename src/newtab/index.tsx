import React, { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { getAggregatedData } from "../utils/storage";
import type { AggregatedData } from "../utils/types";
import { formatDuration } from "../utils/format";
import { ArrowRight, Clock, Activity } from "lucide-react";
import "../index.css";

export function Sidebar() {
  const [data, setData] = useState<AggregatedData>({
    totalTime: 0,
    byDomain: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      const result = await getAggregatedData("today");
      setData(result);
    };
    fetchData();
    // Update every 5 seconds to keep it relatively fresh without killing performance
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  const openDashboard = () => {
    chrome.tabs.create({ url: "dashboard.html" });
  };

  return (
    <div className="h-screen w-screen bg-neutral-950 text-neutral-100 font-sans flex overflow-hidden selection:bg-cyan-500/30">
      {/* Sidebar Container */}
      <aside className="h-full w-[300px] flex flex-col p-6 glass-panel border-r border-white/10 relative z-10 bg-black/40 backdrop-blur-xl">
        {/* Header */}
        <div className="flex items-center gap-3 mb-10">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <Clock className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight">Focus</h1>
            <p className="text-xs text-neutral-400 font-medium">
              Daily Tracker
            </p>
          </div>
        </div>

        {/* Main Stats */}
        <div className="mb-10">
          <h2 className="text-sm font-medium text-neutral-400 mb-2 uppercase tracking-wider">
            Today's Focus
          </h2>
          <div className="text-5xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-neutral-400">
            {formatDuration(data.totalTime)}
          </div>
        </div>

        {/* Top Sites */}
        <div className="flex-1 overflow-y-auto mb-6 scrollbar-hide">
          <h2 className="text-sm font-medium text-neutral-400 mb-4 uppercase tracking-wider flex items-center gap-2">
            <Activity className="w-4 h-4" />
            Top Activity
          </h2>

          <div className="space-y-1">
            {data.byDomain.slice(0, 5).map((site, index) => (
              <div
                key={site.domain}
                className="group flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-all duration-200 cursor-default"
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <span className="text-xs font-mono text-neutral-600 group-hover:text-neutral-400 w-4 transition-colors">
                    {index + 1}
                  </span>
                  <img
                    src={
                      site.favicon ||
                      `https://www.google.com/s2/favicons?domain=${site.domain}`
                    }
                    className="w-5 h-5 rounded-md opacity-70 group-hover:opacity-100 transition-opacity grayscale group-hover:grayscale-0"
                    alt=""
                  />
                  <span className="truncate text-sm font-medium text-neutral-300 group-hover:text-white transition-colors">
                    {site.domain}
                  </span>
                </div>
                <span className="text-xs font-mono text-neutral-500 group-hover:text-cyan-400 transition-colors">
                  {formatDuration(site.time)}
                </span>
              </div>
            ))}

            {data.byDomain.length === 0 && (
              <div className="text-center py-8 text-neutral-600 text-sm">
                No activity yet.
              </div>
            )}
          </div>
        </div>

        {/* Footer Action */}
        <button
          onClick={openDashboard}
          className="w-full group flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-cyan-600/10 to-blue-600/10 hover:from-cyan-600 hover:to-blue-600 border border-white/5 hover:border-transparent transition-all duration-300 shadow-lg"
        >
          <span className="font-semibold text-sm group-hover:text-white transition-colors">
            Full Dashboard
          </span>
          <ArrowRight className="w-4 h-4 text-cyan-500 group-hover:text-white transform group-hover:translate-x-1 transition-all" />
        </button>
      </aside>

      {/* Aesthetic Background Area */}
      <div className="flex-1 relative overflow-hidden bg-black">
        {/* Abstract Gradients */}
        <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-blue-600/20 rounded-full blur-[120px] mix-blend-screen animate-pulse duration-[10000ms]"></div>
        <div className="absolute bottom-[-20%] right-[20%] w-[600px] h-[600px] bg-cyan-600/10 rounded-full blur-[100px] mix-blend-screen"></div>

        {/* Quote or Greeting could go here if requested, for now just clean aesthetic */}
        <div className="absolute bottom-12 right-12 text-right opacity-30 select-none pointer-events-none">
          <h3 className="text-9xl font-black text-white/5 leading-none">
            FOCUS
          </h3>
        </div>
      </div>
    </div>
  );
}

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Sidebar />
  </React.StrictMode>
);
