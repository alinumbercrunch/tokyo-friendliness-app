import styles from "./page.module.css";
import { Header } from "@/components/ui/header/Header";
import OptimizationResults from "@/components/features/optimization/OptimizationResults";
import PopulationTable from "@/components/features/population/PopulationTable";
import ColorLegend from "@/components/features/color-system/ColorLegend";
import { ValidationStatus } from "@/components/stats/ValidationStatus";
import { CTASection } from "@/components/ui/cta-section/CTASection";
import { performOptimization } from "@/lib/services/optimizationService";
import { getBestPopulationData } from "@/lib/data/getStatsData";

// Static generation: pre-build page with hourly updates
export const revalidate = 3600; // Regenerate every hour (CACHE_DURATION.PAGE_REVALIDATE)
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
    <div className={styles.page}>
      <main className={styles.main}>
        {/* App header and description */}
        <Header />

        {/* Main optimization results summary */}
        <OptimizationResults
          initialResults={{
            bestPartition: optimizationResults.bestPartition,
            totalScore: optimizationResults.totalScore,
            colorRankings: optimizationResults.colorRankings,
          }}
        />

        {/* Group color legend (Japanese) */}
        <ColorLegend optimizationResults={optimizationResults} />

        {/* Population data table with friendliness-based grouping colors */}
        <PopulationTable
          optimizationResults={optimizationResults}
          populationData={populationData}
          error={populationError}
        />

        {/* Validation status for optimization */}
        <ValidationStatus
          isOptimal={optimizationResults.isOptimal}
          totalPartitions={optimizationResults.validationDetails.totalPartitions}
        />

        {/* Call-to-action section (customizable) */}
        <CTASection />
      </main>
    </div>
  );
}
