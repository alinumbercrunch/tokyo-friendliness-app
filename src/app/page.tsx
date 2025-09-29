import styles from "./page.module.css";
import { Header } from "@/components/ui/Header";
import OptimizationResults from "@/components/features/OptimizationResults";
import { ValidationStatus } from "@/components/stats/ValidationStatus";
import { CTASection } from "@/components/ui/CTASection";
import { Footer } from "@/components/footer/Footer";
import { performOptimization } from "@/lib/optimizationService";

export default async function Home() {
  // Perform heavy server-side optimization
  const optimizationResults = await performOptimization();

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

        {/* Validation status for optimization */}
        <ValidationStatus
          isOptimal={optimizationResults.isOptimal}
          totalPartitions={optimizationResults.validationDetails.totalPartitions}
        />

        {/* Call-to-action section (customizable) */}
        <CTASection />
      </main>

      {/* App footer (customizable) */}
      <Footer />
    </div>
  );
}
