import LandingPage from "@/features/landing-page/LandingPage";
import { performOptimization } from "@/lib/services/optimizationService";
import { getBestPopulationData } from "@/lib/data/getStatsData";

/**
 * Home page (static, revalidated hourly)
 * Handles optimization, data fetching, and error display.
 * See error.tsx for server error handling.
 */

// Static generation: pre-build page with hourly updates
// Note: Next.js requires literal values for segment configs, so we can't use CACHE_DURATION.PAGE_REVALIDATE here
export const revalidate = 3600; // Regenerate every hour
export const dynamic = "force-static"; // Force static generation

export default async function Home() {
  // Perform heavy server-side optimization
  const optimizationResults = await performOptimization();

  // Fetch population data at page level (separation of concerns)
  let populationData = null;
  let populationError = null;

  try {
    populationData = await getBestPopulationData();
  } catch (error) {
    populationError = error instanceof Error ? error.message : "Failed to fetch population data";
  }

  return (
    <LandingPage
      optimizationResults={optimizationResults}
      populationData={populationData}
      populationError={populationError}
    />
  );
}
