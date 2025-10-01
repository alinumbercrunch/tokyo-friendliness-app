/**
 * Population Data Hook
 * 
 * Custom React hook for fetching and managing population data from the e-Stat API.
 * Provides a clean separation between data fetching logic and UI components.
 */

"use client";

import { useState, useEffect } from "react";
import type { PopulationRow } from "@/lib/data/estatTypes";
import { getBestPopulationData } from "@/lib/data/getStatsData";
import { logger } from "@/lib/shared/logger";

/**
 * Return type for the usePopulationData hook
 */
interface UsePopulationDataResult {
  /** Population data array, null if not loaded or error occurred */
  data: PopulationRow[] | null;
  /** Error message if data fetching failed, null if no error */
  error: string | null;
  /** Loading state indicator, true while fetching data */
  loading: boolean;
}

/**
 * Custom hook for fetching population data from e-Stat API
 * 
 * Encapsulates the data fetching logic and state management for population data.
 * Automatically fetches data on component mount and handles loading, error, and success states.
 * 
 * Features:
 * - Automatic data fetching on hook initialization
 * - Loading state management
 * - Error handling with user-friendly messages
 * - Logging for debugging and monitoring
 * - Clean state management with proper cleanup
 * 
 * Usage:
 * ```tsx
 * const { data, error, loading } = usePopulationData();
 * 
 * if (loading) return <LoadingComponent />;
 * if (error) return <ErrorComponent error={error} />;
 * if (data) return <DataComponent data={data} />;
 * ```
 * 
 * @returns Object containing data, error, and loading states
 */
export function usePopulationData(): UsePopulationDataResult {
  const [data, setData] = useState<PopulationRow[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        logger.info("Fetching population data from e-Stat API");
        const result = await getBestPopulationData();

        if (!result || result.length === 0) {
          throw new Error("No population data found");
        }

        setData(result);
        setError(null);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Unknown error occurred";
        logger.error("Failed to fetch population data from e-Stat API", {
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