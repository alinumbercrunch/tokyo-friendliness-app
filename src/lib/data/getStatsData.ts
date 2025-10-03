import { PopulationRow, EStatResponse, EStatDataValue } from "@/lib/data/estatTypes";
import { logger } from "@/lib/shared/logger";
import { cache } from "react";

const ESTAT_BASE_URL = "https://api.e-stat.go.jp/rest/3.0/app";

// Constants for data filtering
const MIN_YEAR = 2020; // Only include data from the last 5 years
const MAX_API_LIMIT = 1000;

// Dataset IDs we discovered that return results
const KNOWN_DATASETS = [
  "0000010101", // PERFECT: 1975-2024 data with all 7 prefectures every year!
  "0004019526", // Good: 2020 data with all 7 prefectures
  "0000030003", // Backup: 1980 data only
] as const;

// Target prefectures and their e-Stat codes
const TARGET_PREFECTURES = new Map([
  ["08000", "茨城県"],
  ["10000", "群馬県"],
  ["11000", "埼玉県"],
  ["12000", "千葉県"],
  ["13000", "東京都"],
  ["14000", "神奈川県"],
  ["19000", "山梨県"],
]);

// Fallback data for the 7 prefectures (2020 census data)
const FALLBACK_DATA: PopulationRow[] = [
  { prefecture: "東京都", year: 2020, population: 14047594 },
  { prefecture: "神奈川県", year: 2020, population: 9237337 },
  { prefecture: "埼玉県", year: 2020, population: 7344765 },
  { prefecture: "千葉県", year: 2020, population: 6284480 },
  { prefecture: "茨城県", year: 2020, population: 2867009 },
  { prefecture: "群馬県", year: 2020, population: 1939110 },
  { prefecture: "山梨県", year: 2020, population: 809974 },
];

// Validate environment variable on module load
function validateEstatAppId(): string {
  const appId = process.env.ESTAT_APP_ID;
  if (!appId) {
    logger.error("ESTAT_APP_ID environment variable is required but not found");
    throw new Error(
      "ESTAT_APP_ID environment variable is required. Please check your .env.local file."
    );
  }
  return appId;
}

// Helper function to build API URL
function buildApiUrl(datasetId: string): string {
  const appId = validateEstatAppId();
  return `${ESTAT_BASE_URL}/json/getStatsData?appId=${appId}&lang=J&statsDataId=${datasetId}&limit=${MAX_API_LIMIT}`;
}

// Helper function to parse a single data value from e-Stat response
function parseDataValue(value: EStatDataValue, datasetId: string): PopulationRow | null {
  // Try different field combinations for population value
  const populationValue = value.$ || value.value || value.VALUE;
  if (!populationValue || isNaN(Number(populationValue))) return null;

  // Try different field combinations for prefecture code
  const prefectureCode = value["@area"] || value["@cat01"] || value["@pref"];
  if (!prefectureCode) return null;

  // Check if this is one of our target prefectures
  const prefectureName = TARGET_PREFECTURES.get(String(prefectureCode));
  if (!prefectureName) return null;

  // For dataset 0000030003: only use total population (@cat04: T01)
  if (datasetId === "0000030003" && value["@cat04"] !== "T01") return null;

  // Try different field combinations for year
  const yearValue = value["@time"] || value["@year"] || value.year || "2020";
  const year = parseInt(String(yearValue).substring(0, 4)) || 2020;

  // Only include data from the last 5 years (2020-2024)
  if (year < MIN_YEAR) return null;

  return {
    prefecture: prefectureName,
    year: year,
    population: parseInt(String(populationValue)),
  };
}

// Helper function to fetch data from a single dataset
async function fetchDatasetData(datasetId: string): Promise<PopulationRow[]> {
  logger.info(`Trying dataset: ${datasetId}`);

  const url = buildApiUrl(datasetId);

  // Next.js 15 optimized fetch with caching
  const response = await fetch(url, {
    next: {
      revalidate: 300, // Cache for 5 minutes
      tags: ["e-stat-api", "population-data", `dataset-${datasetId}`],
    },
  });

  if (!response.ok) {
    logger.warn(`HTTP error ${response.status} for dataset ${datasetId}`);
    return [];
  }

  const data: EStatResponse = await response.json();

  // Check API response status
  const apiStatus = data?.GET_STATS_DATA?.RESULT?.STATUS;
  const apiMessage = data?.GET_STATS_DATA?.RESULT?.ERROR_MSG || "No message";

  logger.info(`API response status: ${apiStatus}`);
  logger.info(`API message: ${apiMessage}`);

  // Get the data values with proper typing
  const values: EStatDataValue[] = data?.GET_STATS_DATA?.STATISTICAL_DATA?.DATA_INF?.VALUE || [];
  logger.info(`Found ${values.length} raw data points`);

  if (values.length === 0) {
    logger.warn(`No data values in dataset ${datasetId}`);
    return [];
  }

  // Show sample of raw data with proper typing
  logger.info("Sample raw data:", {
    samples: values.slice(0, 3).map((value: EStatDataValue, index: number) => ({
      index: index + 1,
      data: value,
    })),
  });

  // Parse population data
  const populationData: PopulationRow[] = [];
  for (const value of values) {
    const parsed = parseDataValue(value, datasetId);
    if (parsed) {
      populationData.push(parsed);
    }
  }

  logger.info(`Parsed ${populationData.length} population records for target prefectures`);

  if (populationData.length > 0) {
    logger.info("Found population data:", {
      records: populationData.map((row) => ({
        prefecture: row.prefecture,
        year: row.year,
        population: row.population.toLocaleString(),
      })),
    });
  }

  return populationData;
}

// Simple approach: try known dataset IDs and return working data
export async function getRealPopulationData(): Promise<PopulationRow[]> {
  logger.info("Fetching population data from known datasets");

  for (const datasetId of KNOWN_DATASETS) {
    try {
      const populationData = await fetchDatasetData(datasetId);

      if (populationData.length > 0) {
        return populationData;
      }
    } catch (error) {
      logger.error(`Error with dataset ${datasetId}`, { error: String(error) });
      continue;
    }
  }

  // If no real data found, return fallback data for the 7 prefectures
  logger.warn("No real data found, using fallback data");
  return FALLBACK_DATA;
}

// React cache() wrapper for function-level caching
export const getCachedPopulationData = cache(async (): Promise<PopulationRow[]> => {
  logger.info("Cache miss - fetching fresh data");
  return getRealPopulationData();
});

// Export aliases for compatibility
export const getBestPopulationData = getCachedPopulationData; // Use cached version
export const getStatsData = getCachedPopulationData; // Use cached version
export const fetchPopulationData = getCachedPopulationData; // Use cached version
