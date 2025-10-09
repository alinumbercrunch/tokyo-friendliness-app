import type { OptimizationResult } from "@/lib/services/optimizationService";
import { processGroupsWithScores } from "@/lib/ui-utils/colorLegendUtils";
import styles from "./ColorLegend.module.css";
import { COLOR_LEGEND_TITLE, POINTS_SUFFIX } from "./constants";

/**
 * Props for the ColorLegend component
 */
interface ColorLegendProps {
  /**
   * Optimization results containing group rankings and scores
   * Used to display group scores and determine color rankings
   * Groups are automatically sorted by score (highest to lowest)
   */
  optimizationResults: OptimizationResult;
}

/**
 * Color Legend Component
 *
 * Displays a visual legend showing the color coding system used throughout
 * the application. Each group is shown with its corresponding color, name,
 * and score points, sorted by score from highest to lowest.
 *
 * Features:
 * - Shows 3 friendship groups (グループ1, グループ2, グループ3)
 * - Displays color swatches (blue, green, orange)
 * - Shows point scores for each group
 * - Automatically sorts groups by score (highest first)
 * - Uses extracted utility functions for score processing
 * - Graceful fallback scores when optimization data is unavailable
 *
 * Color Mapping:
 * - Blue: Typically highest scoring group
 * - Green: Medium scoring group
 * - Orange: Lower scoring group
 *
 * @param props - Component props
 * @returns JSX element rendering the color legend with scores
 */
export default function ColorLegend({ optimizationResults }: ColorLegendProps) {
  // Process groups using extracted utility function
  const groupsWithScores = processGroupsWithScores(optimizationResults);

  return (
    <div className={styles.colorLegend}>
      <h3 className={styles.title}>{COLOR_LEGEND_TITLE}</h3>
      <div className={styles.legendItems}>
        {groupsWithScores.map((group) => (
          <div key={group.index} className={styles.legendItem}>
            <div className={`${styles.colorBox} ${styles[group.color]}`} />
            <span className={styles.groupName}>{group.name}</span>
            <span className={styles.score}>
              {group.score}
              {POINTS_SUFFIX}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
