import { getBestPopulationData } from "@/lib/getStatsData";
import { logger } from "@/lib/logger";
import styles from "./PopulationTable.module.css";
import type { PopulationRow } from "@/lib/estatTypes";
import type { OptimizationResult } from "@/lib/optimizationService";

interface PopulationTableProps {
  optimizationResults: OptimizationResult;
}

export default async function PopulationTable({ optimizationResults }: PopulationTableProps) {
  let data: PopulationRow[] | null = null;
  let error: string | undefined;

  try {
    logger.info("Fetching population data from e-Stat API");
    data = await getBestPopulationData();

    if (!data || data.length === 0) {
      throw new Error("No population data found");
    }
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error occurred";
    logger.error("Failed to fetch population data from e-Stat API", {
      error: errorMessage,
      timestamp: new Date().toISOString(),
    });
    error = errorMessage;
  }

  if (error) {
    return (
      <div className={styles.error}>
        <h2>e-Stat API データ取得エラー</h2>
        <p>{error}</p>
        <p>APIキーの確認とネットワーク接続を確認してください。</p>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className={styles.noData}>
        <h2>首都圏人口データ</h2>
        <p>e-Stat APIからデータを取得できませんでした。</p>
      </div>
    );
  }

  // Get unique years and prefectures from data
  const years = [...new Set(data.map((row) => row.year))].sort((a, b) => b - a); // Descending order (newer first)

  // Get prefectures sorted by population in descending order (highest population first)
  const prefecturePopulations = data.reduce(
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
    const row = data.find((d) => d.prefecture === prefecture && d.year === year);
    return row?.population?.toLocaleString() || "-";
  };

  // Function to get group CSS class for a prefecture
  const getGroupClass = (prefecture: string) => {
    // Find which group this prefecture belongs to
    for (let i = 0; i < optimizationResults.bestPartition.length; i++) {
      if (optimizationResults.bestPartition[i].includes(prefecture)) {
        const groupColors = ["goldGroup", "silverGroup", "bronzeGroup"];
        return groupColors[i] || "bronzeGroup";
      }
    }
    return ""; // Default - no special coloring
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>首都圏人口データ（友好度グループ別色分け）</h2>
      <div className={styles.info}>
        <p>
          データ件数: {data.length}件 | グループ数: {optimizationResults.bestPartition.length}つ
        </p>
        <p>
          友好度合計スコア: <strong>{optimizationResults.totalScore.toFixed(1)}</strong>
        </p>
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.tableHeader}>西暦</th>
              {prefectures.map((prefecture) => (
                <th
                  key={prefecture}
                  className={`${styles.tableHeader} ${styles[getGroupClass(prefecture)]}`}
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
                  <strong>{year}年</strong>
                </td>
                {prefectures.map((prefecture) => (
                  <td
                    key={`${year}-${prefecture}`}
                    className={`${styles.tableCell} ${styles[getGroupClass(prefecture)]}`}
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
        <p>データ提供: e-Stat (政府統計の総合窓口) | 色分け: 友好度最適化グループ</p>
      </div>
    </div>
  );
}
