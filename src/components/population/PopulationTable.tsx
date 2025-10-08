import styles from "./PopulationTable.module.css";
import type { PopulationRow } from "@/lib/data/estatTypes";
import type { OptimizationResult } from "@/lib/services/optimizationService";
import {
  ESTAT_API_ERROR_TITLE,
  ESTAT_API_ERROR_MESSAGE,
  POPULATION_DATA_TITLE,
  POPULATION_DATA_ERROR_MESSAGE,
  NO_DATA_SYMBOL,
  GOLD_GROUP_CLASS,
  SILVER_GROUP_CLASS,
  BRONZE_GROUP_CLASS,
  TABLE_TITLE,
  DATA_COUNT_LABEL,
  GROUP_COUNT_LABEL,
  GROUP_COUNT_UNIT,
  TOTAL_SCORE_LABEL,
  YEAR_HEADER,
  YEAR_UNIT,
  FOOTER_TEXT,
} from "./constants";

/**
 * Props for the PopulationTable component
 */
interface PopulationTableProps {
  /**
   * Optimization results containing prefecture groupings and scores
   * Used to apply color coding to table cells based on friendship groups
   */
  optimizationResults: OptimizationResult;

  /**
   * Population data fetched from e-Stat API
   * Contains prefecture population numbers by year
   * @default null
   */
  populationData?: PopulationRow[] | null;

  /**
   * Error message if data fetching failed
   * When provided, component renders error state instead of table
   * @default null
   */
  error?: string | null;
}

/**
 * Population Table Component
 *
 * Displays Japanese prefecture population data in a tabular format with color-coded
 * groupings based on friendship optimization results. Each prefecture is colored
 * according to its friendship group ranking (gold, silver, bronze).
 *
 * Features:
 * - Displays population data by prefecture and year
 * - Color-codes table cells based on friendship optimization groups
 * - Sorts prefectures by population (highest first)
 * - Shows years in descending order (newest first)
 * - Handles error and no-data states gracefully
 * - Displays summary statistics (data count, group count, total score)
 *
 * @param props - Component props
 * @returns JSX element rendering the population table or error/no-data states
 */
export default function PopulationTable({
  optimizationResults,
  populationData = null,
  error = null,
}: PopulationTableProps) {
  // Handle error state
  if (error) {
    return (
      <div className={styles.error}>
        <h2>{ESTAT_API_ERROR_TITLE}</h2>
        <p>{error}</p>
        <p>{ESTAT_API_ERROR_MESSAGE}</p>
      </div>
    );
  }

  // Handle no data state
  if (!populationData || populationData.length === 0) {
    return (
      <div className={styles.noData}>
        <h2>{POPULATION_DATA_TITLE}</h2>
        <p>{POPULATION_DATA_ERROR_MESSAGE}</p>
      </div>
    );
  }

  // Get unique years and prefectures from populationData
  const years = [...new Set(populationData.map((row) => row.year))].sort(
    (a, b) => b - a
  ); // Descending order (newer first)

  // Get prefectures sorted by population in descending order (highest population first)
  const prefecturePopulations = populationData.reduce(
    (acc, row) => {
      if (!acc[row.prefecture]) {
        acc[row.prefecture] = 0;
      }
      acc[row.prefecture] += row.population;
      return acc;
    },
    {} as Record<string, number>
  );

  const prefectures = Object.entries(prefecturePopulations)
    .sort(([, popA], [, popB]) => popB - popA) // Sort by population descending
    .map(([prefecture]) => prefecture);

  // Function to get population for a specific prefecture and year
  const getPopulation = (prefecture: string, year: number) => {
    const row = populationData.find(
      (d) => d.prefecture === prefecture && d.year === year
    );
    return row ? row.population.toLocaleString() : NO_DATA_SYMBOL;
  };

  // Function to get group CSS class for a prefecture
  const getGroupClass = (prefecture: string) => {
    // Find which group this prefecture belongs to
    for (let i = 0; i < optimizationResults.bestPartition.length; i++) {
      if (optimizationResults.bestPartition[i].includes(prefecture)) {
        const groupColors = [
          GOLD_GROUP_CLASS,
          SILVER_GROUP_CLASS,
          BRONZE_GROUP_CLASS,
        ];
        return groupColors[i] || BRONZE_GROUP_CLASS;
      }
    }
    return ""; // Default - no special coloring
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>{TABLE_TITLE}</h2>
      <div className={styles.info}>
        <p>
          {DATA_COUNT_LABEL}
          {populationData.length}
          {GROUP_COUNT_LABEL}
          {optimizationResults.bestPartition.length}
          {GROUP_COUNT_UNIT}
        </p>
        <p>
          {TOTAL_SCORE_LABEL}
          <strong>{optimizationResults.totalScore.toFixed(1)}</strong>
        </p>
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.tableHeader}>{YEAR_HEADER}</th>
              {prefectures.map((prefecture) => (
                <th
                  key={prefecture}
                  className={`${styles.tableHeader} ${
                    styles[getGroupClass(prefecture)]
                  }`}
                >
                  <strong>{prefecture}</strong>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {years.map((year) => (
              <tr key={year} className={styles.tableRow}>
                <td className={styles.yearCell}>
                  <strong>
                    {year}
                    {YEAR_UNIT}
                  </strong>
                </td>
                {prefectures.map((prefecture) => (
                  <td
                    key={`${year}-${prefecture}`}
                    className={`${styles.tableCell} ${
                      styles[getGroupClass(prefecture)]
                    }`}
                  >
                    {getPopulation(prefecture, year)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className={styles.footer}>
        <p>{FOOTER_TEXT}</p>
      </div>
    </div>
  );
}

