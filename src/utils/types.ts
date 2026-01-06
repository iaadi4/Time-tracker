export interface DailyData {
  [domain: string]: {
    time: number; // milliseconds
    favicon: string;
    lastVisited: number; // timestamp
  };
}

export interface StorageData {
  whitelist?: string[];
  [dateKey: string]: DailyData | string[] | undefined;
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
