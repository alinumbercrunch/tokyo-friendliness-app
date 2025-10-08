import { Header } from "./components/ui/header/Header";
import OptimizationResults from "@/components/optimization/OptimizationResults";
import PopulationTable from "@/components/population/PopulationTable";
import { PopulationTableErrorBoundary } from "@/components/population/PopulationTableErrorBoundary";
import ColorLegend from "@/components/color-system/ColorLegend";
import { ValidationStatus } from "@/components/stats/ValidationStatus";
import { CTASection } from "./components/ui/cta-section/CTASection";
import styles from "./LandingPage.module.css";
import type { OptimizationResult } from "@/lib/services/optimizationService";
import type { PopulationRow } from "@/lib/data/estatTypes";

interface LandingPageProps {
  optimizationResults: OptimizationResult;
  populationData: PopulationRow[] | null;
  populationError: string | null;
}

export default function LandingPage({
  optimizationResults,
  populationData,
  populationError,
}: LandingPageProps) {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <Header />
        <OptimizationResults
          initialResults={{
            bestPartition: optimizationResults.bestPartition,
            totalScore: optimizationResults.totalScore,
            colorRankings: optimizationResults.colorRankings,
          }}
        />
        <ColorLegend optimizationResults={optimizationResults} />
        <PopulationTableErrorBoundary>
          <PopulationTable
            optimizationResults={optimizationResults}
            populationData={populationData}
            error={populationError}
          />
        </PopulationTableErrorBoundary>
        <ValidationStatus
          isOptimal={optimizationResults.isOptimal}
          totalPartitions={optimizationResults.validationDetails.totalPartitions}
        />
        <CTASection />
      </main>
    </div>
  );
}
