import { formatDurationLong } from "../../utils/format";

interface Site {
  domain: string;
  time: number;
  favicon: string;
}

interface ActivityListProps {
  sites: Site[];
  maxTime: number;
}

export function ActivityList({ sites, maxTime }: ActivityListProps) {
  return (
    <div className="flex-1 overflow-y-scroll pr-2 space-y-3">
      {sites.map((site, index) => (
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
                    width: `${Math.min((site.time / maxTime) * 100, 100)}%`,
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
  );
}
