import styles from "./PopulationTable.module.css";

/**
 * Props for the ErrorDisplay component
 */
interface ErrorDisplayProps {
  /**
   * Error message to display to the user
   * Should be a descriptive message about what went wrong
   */
  error: string;
}

/**
 * Error Display Component
 *
 * Displays an error state when population data fetching fails.
 * Provides user-friendly error messaging with troubleshooting suggestions.
 *
 * Features:
 * - Clear error heading in Japanese
 * - Displays the specific error message
 * - Provides troubleshooting guidance
 * - Consistent styling with error state design
 *
 * @param props - Component props containing error message
 * @returns JSX element rendering the error state
 */
export function ErrorDisplay({ error }: ErrorDisplayProps) {
  return (
    <div className={styles.error}>
      <h2>e-Stat API データ取得エラー</h2>
      <p>{error}</p>
      <p>APIキーの確認とネットワーク接続を確認してください。</p>
    </div>
  );
}

/**
 * No Data Display Component
 *
 * Displays a no-data state when population data is unavailable or empty.
 * Provides user-friendly messaging when the e-Stat API returns no results.
 *
 * Features:
 * - Clear messaging in Japanese
 * - Explains the data source (e-Stat API)
 * - Consistent styling with no-data state design
 * - Graceful fallback when data is unavailable
 *
 * @returns JSX element rendering the no-data state
 */
export function NoDataDisplay() {
  return (
    <div className={styles.noData}>
      <h2>首都圏人口データ</h2>
      <p>e-Stat APIからデータを取得できませんでした。</p>
    </div>
  );
}

/**
 * Loading Display Component
 *
 * Displays a loading state while population data is being fetched.
 * Provides user feedback during data loading operations.
 *
 * Features:
 * - Clear loading message in Japanese
 * - Consistent styling with loading state design
 * - User-friendly feedback during async operations
 *
 * @returns JSX element rendering the loading state
 */
export function LoadingDisplay() {
  return (
    <div className={styles.noData}>
      <h2>首都圏人口データ</h2>
      <p>データを読み込み中...</p>
    </div>
  );
}
