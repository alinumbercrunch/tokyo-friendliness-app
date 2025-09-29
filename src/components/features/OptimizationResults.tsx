"use client";

import ColorLegend from "@/components/features/ColorLegend";
import type { GroupColorRanking } from "@/lib/types";
import styles from "./OptimizationResults.module.css";

interface OptimizationResultsProps {
  initialResults: {
    bestPartition: string[][];
    totalScore: number;
    colorRankings: GroupColorRanking[];
  };
}

export default function OptimizationResults({ initialResults }: OptimizationResultsProps) {
  const { bestPartition, totalScore, colorRankings } = initialResults;

  return (
    <div className={styles.optimizationResults}>
      <h2>Prefecture Grouping Results</h2>

      {/* Display optimization stats */}
      <div className={styles.stats}>
        <p>
          <strong>Total Groups:</strong> {bestPartition.length}
        </p>
        <p>
          <strong>Total Score:</strong> {totalScore}
        </p>
      </div>

      {/* Display Color Rankings */}
      <ColorLegend colorRankings={colorRankings} title="Group Rankings (by performance)" />

      {/* Group breakdown removed as requested */}
    </div>
  );
}
