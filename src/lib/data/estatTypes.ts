// e-Stat API types
export interface PopulationRow {
  prefecture: string;
  year: number;
  population: number;
  [key: string]: unknown;
}

// Detailed e-Stat API response structure
export interface EStatDataValue {
  $?: string; // Population value
  "@tab"?: string; // Table code
  "@cat01"?: string; // Category 01 (often prefecture code)
  "@cat04"?: string; // Category 04 (population type)
  "@area"?: string; // Area code
  "@time"?: string; // Time period (year)
  "@unit"?: string; // Unit (人 = people)
  "@pref"?: string; // Prefecture code (alternative)
  "@year"?: string; // Year (alternative)
  value?: string; // Population value (alternative)
  VALUE?: string; // Population value (alternative)
  year?: string; // Year (alternative)
  [key: string]: unknown; // Allow other fields
}

export interface EStatResult {
  STATUS?: string; // "0" = success
  ERROR_MSG?: string; // Error message if any
  DATE?: string; // Response date
}

export interface EStatDataInfo {
  VALUE?: EStatDataValue[]; // Array of data values
}

export interface EStatStatisticalData {
  DATA_INF?: EStatDataInfo; // Data information
  TABLE_INF?: unknown; // Table information (not used currently)
  CLASS_INF?: unknown; // Classification information (not used currently)
}

export interface EStatGetStatsData {
  RESULT?: EStatResult; // API result status
  PARAMETER?: unknown; // Request parameters (not used currently)
  STATISTICAL_DATA?: EStatStatisticalData; // The actual data
}

export interface EStatResponse {
  GET_STATS_DATA?: EStatGetStatsData; // Main response wrapper
}

export interface CachedData<T> {
  data: T;
  timestamp: number;
}

// API configuration
export interface EStatConfig {
  baseUrl: string;
  appId: string;
  statsCode: string;
}
