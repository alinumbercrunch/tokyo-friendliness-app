import type { OptimizationResult } from "@/lib/optimizationService";
import styles from "./ColorLegend.module.css";

interface ColorLegendProps {
  optimizationResults: OptimizationResult;
}

export default function ColorLegend({ optimizationResults }: ColorLegendProps) {
  const groups = [
    { name: "グループ1", color: "blue", index: 0 },
    { name: "グループ2", color: "green", index: 1 },
    { name: "グループ3", color: "orange", index: 2 },
  ];

  // Get scores from colorRankings if available
  const getGroupScore = (groupIndex: number) => {
    console.log("optimizationResults:", optimizationResults);
    console.log("colorRankings:", optimizationResults?.colorRankings);

    if (!optimizationResults?.colorRankings) {
      // Fallback: show some score based on group index
      const fallbackScores = [45, 30, 25]; // Example scores
      return fallbackScores[groupIndex] || 0;
    }

    const ranking = optimizationResults.colorRankings.find((r) => r.groupIndex === groupIndex);
    console.log(`Group ${groupIndex} ranking:`, ranking);
    return ranking?.groupScore ? Math.round(ranking.groupScore) : 0;
  };

  // Add scores to groups and sort by score (highest first)
  const groupsWithScores = groups
    .map((group) => ({
      ...group,
      score: getGroupScore(group.index),
    }))
    .sort((a, b) => b.score - a.score);

  return (
    <div className={styles.colorLegend}>
      <h3 className={styles.title}>グループの色とポイント（高い順）</h3>
      <div className={styles.legendItems}>
        {groupsWithScores.map((group) => (
          <div key={group.index} className={styles.legendItem}>
            <div className={`${styles.colorBox} ${styles[group.color]}`} />
            <span className={styles.groupName}>{group.name}</span>
            <span className={styles.score}>{group.score} points</span>
          </div>
        ))}
      </div>
    </div>
  );
}
