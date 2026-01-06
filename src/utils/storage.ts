import type {
  StorageData,
  DailyData,
  AggregatedData,
  TimeRange,
} from "./types";

const WHITELIST_KEY = "whitelist";

export const getTodayKey = (): string => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const getStorageData = async (
  keys?: string | string[] | null
): Promise<StorageData> => {
  return new Promise((resolve) => {
    chrome.storage.local.get(keys || null, (result) => {
      resolve(result as StorageData);
    });
  });
};

export const setStorageData = async (
  data: Partial<StorageData>
): Promise<void> => {
  return new Promise((resolve) => {
    chrome.storage.local.set(data, () => {
      resolve();
    });
  });
};

export const addToWhitelist = async (domain: string): Promise<void> => {
  const data = await getStorageData(WHITELIST_KEY);
  const whitelist = data[WHITELIST_KEY] || [];
  if (!whitelist.includes(domain)) {
    whitelist.push(domain);
    await setStorageData({ [WHITELIST_KEY]: whitelist });
  }
};

export const removeFromWhitelist = async (domain: string): Promise<void> => {
  const data = await getStorageData(WHITELIST_KEY);
  const whitelist = data[WHITELIST_KEY] || [];
  const newWhitelist = whitelist.filter((d: string) => d !== domain);
  await setStorageData({ [WHITELIST_KEY]: newWhitelist });
};

export const saveTime = async (
  domain: string,
  duration: number,
  favicon: string
) => {
  if (!domain || duration <= 0) return;

  const today = getTodayKey();
  const data = await getStorageData([today, WHITELIST_KEY]);

  const whitelist = data[WHITELIST_KEY] || [];
  if (whitelist.includes(domain)) return;

  const todayData: DailyData = (data[today] as DailyData) || {};

  if (!todayData[domain]) {
    todayData[domain] = {
      time: 0,
      favicon: favicon,
      lastVisited: Date.now(),
    };
  }

  todayData[domain].time += duration;
  todayData[domain].lastVisited = Date.now();
  // Update favicon if it was missing or generic, but let's just update it always for now or check if exists
  if (favicon) todayData[domain].favicon = favicon;

  await setStorageData({ [today]: todayData });
};

export const getAggregatedData = async (
  range: TimeRange
): Promise<AggregatedData> => {
  const data = await getStorageData(null); // Fetch all data
  const today = new Date();
  const result: DailyData = {};

  Object.keys(data).forEach((key) => {
    if (key === WHITELIST_KEY) return;

    // Check if key is a date and within range
    // Simple date check
    if (!key.match(/^\d{4}-\d{2}-\d{2}$/)) return;

    const date = new Date(key);
    let include = false;

    const diffTime = Math.abs(today.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    switch (range) {
      case "today":
        include = key === getTodayKey();
        break;
      case "week":
        include = diffDays <= 7;
        break;
      case "month":
        include = diffDays <= 30;
        break;
      case "year":
        include = diffDays <= 365;
        break;
      case "all-time":
        include = true;
        break;
    }

    if (include) {
      const dayData = data[key] as DailyData;
      Object.keys(dayData).forEach((domain) => {
        if (!result[domain]) {
          result[domain] = {
            time: 0,
            favicon: dayData[domain].favicon,
            lastVisited: dayData[domain].lastVisited,
          };
        }
        result[domain].time += dayData[domain].time;
        // Keep the most recent lastVisited
        if (dayData[domain].lastVisited > result[domain].lastVisited) {
          result[domain].lastVisited = dayData[domain].lastVisited;
          result[domain].favicon = dayData[domain].favicon; // Update favicon to most recent
        }
      });
    }
  });

  const byDomain = Object.keys(result)
    .map((domain) => ({
      domain,
      ...result[domain],
    }))
    .sort((a, b) => b.time - a.time);

  const totalTime = byDomain.reduce((acc, curr) => acc + curr.time, 0);

  return { totalTime, byDomain };
};
