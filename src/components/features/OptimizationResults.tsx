"use client";

import type { GroupColorRanking } from "@/lib/shared/types";
import styles from "./OptimizationResults.module.css";

/**
 * Props for the OptimizationResults component
 */
interface OptimizationResultsProps {
  /**
   * Initial optimization results to display
   */
  initialResults: {
    /** 
     * The optimal prefecture grouping found by the algorithm
     * Array of groups, where each group is an array of prefecture names
     */
    bestPartition: string[][];
    
    /** 
     * Total friendship score achieved by the optimal grouping
     * Higher scores indicate better friendship optimization
     */
    totalScore: number;
    
    /** 
     * Color rankings for each group with detailed scoring information
     * Used for visual representation and detailed analysis
     */
    colorRankings: GroupColorRanking[];
  };
}

/**
 * Optimization Results Component
 * 
 * Displays a summary of the prefecture grouping optimization results.
 * Shows key metrics like total number of groups and the overall friendship score
 * achieved by the optimization algorithm.
 * 
 * This component provides a high-level overview of the optimization outcome
 * without showing detailed group breakdowns (those are handled by other components
 * like ColorLegend and PopulationTable).
 * 
 * Features:
 * - Shows total number of groups created
 * - Displays the overall optimization score
 * - Clean, focused summary presentation
 * - Client-side component for potential future interactivity
 * 
 * @param props - Component props containing optimization results
 * @returns JSX element rendering the optimization summary
 */
export default function OptimizationResults({ initialResults }: OptimizationResultsProps) {
  const { bestPartition, totalScore } = initialResults;

  return (
    <div className={styles.optimizationResults}>
      <h2>都道府県グループ化結果</h2>

      {/* Display optimization stats */}
      <div className={styles.stats}>
        <p>
          <strong>総グループ数:</strong> {bestPartition.length}
        </p>
        <p>
          <strong>総合スコア:</strong> {totalScore}
        </p>
      </div>

      {/* Group breakdown removed as requested */}
    </div>
  );
}
