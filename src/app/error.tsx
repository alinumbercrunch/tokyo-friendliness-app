/**
 * Global error boundary for server-side errors (Next.js 15)
 * Displays a friendly error page and retry button.
 * @see https://nextjs.org/docs/app/building-your-application/routing/error-handling
 */
"use client";

import styles from "./error.module.css";

export default function GlobalError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <html>
      <body className={styles.errorPage}>
        <h1>サーバーエラーが発生しました</h1>
        <p>申し訳ありません。ページの表示中にエラーが発生しました。</p>
        <pre className={styles.errorBox}>{error.message}</pre>
        <button onClick={reset} className={styles.retryButton}>
          再試行
        </button>
      </body>
    </html>
  );
}
