export interface DailyData {
  [domain: string]: {
    time: number; // milliseconds
    favicon: string;
    lastVisited: number; // timestamp
  };
}

export interface Settings {
  trackingDelaySeconds: number; // 1-100, default 15
}

export interface StorageData {
  whitelist?: string[];
  settings?: Settings;
  [dateKey: string]: DailyData | string[] | Settings | undefined;
}

export interface AggregatedData {
  totalTime: number;
  byDomain: {
    domain: string;
    time: number;
    favicon: string;
  }[];
}

export type TimeRange = "today" | "week" | "month" | "year" | "all-time";

export interface Insights {
  mostActiveDay: {
    date: string;
    time: number;
  } | null;
  dailyAverage: number;
}
