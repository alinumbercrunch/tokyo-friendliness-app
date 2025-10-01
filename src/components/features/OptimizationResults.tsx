"use client";

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
