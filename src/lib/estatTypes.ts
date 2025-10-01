// e-Stat API types
export interface PopulationRow {
  prefecture: string;
  year: number;
  population: number;
  [key: string]: unknown;
}

export interface EStatResponse {
  GET_STATS_DATA?: {
    STATISTICAL_DATA?: {
      DATA_INF?: {
        VALUE?: Array<{
          $?: string; // Population value
          "@cat01"?: string; // Prefecture code/name
          "@time"?: string; // Year
        }>;
      };
    };
  };
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
