// Population Data Hook for fetching and managing population data from the e-Stat API

"use client";

import { useState, useEffect } from "react";
import type { PopulationRow } from "@/lib/data/estatTypes";
import { getBestPopulationData } from "@/lib/data/getStatsData";
import { logger } from "@/lib/shared/logger";
import {
  FETCHING_POPULATION_DATA_MESSAGE,
  NO_POPULATION_DATA_FOUND_MESSAGE,
  UNKNOWN_ERROR_MESSAGE,
  FAILED_TO_FETCH_POPULATION_DATA_MESSAGE,
} from "./constants";

/**
 * Return type for the usePopulationData hook
 */
interface UsePopulationDataResult {
  // Population data array, null if not loaded or error occurred
  data: PopulationRow[] | null;
  // Error message if data fetching failed, null if no error
  error: string | null;
  // Loading state indicator, true while fetching data
  loading: boolean;
}

// Custom hook for fetching population data from e-Stat API
export function usePopulationData(): UsePopulationDataResult {
  const [data, setData] = useState<PopulationRow[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        logger.info(FETCHING_POPULATION_DATA_MESSAGE);
        const result = await getBestPopulationData();

        if (!result || result.length === 0) {
          throw new Error(NO_POPULATION_DATA_FOUND_MESSAGE);
        }

        setData(result);
        setError(null);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : UNKNOWN_ERROR_MESSAGE;
        logger.error(FAILED_TO_FETCH_POPULATION_DATA_MESSAGE, {
          error: errorMessage,
          timestamp: new Date().toISOString(),
        });
        setError(errorMessage);
        setData(null);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return { data, error, loading };
}
