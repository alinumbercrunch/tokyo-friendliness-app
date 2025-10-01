import Image from "next/image";
import styles from "./Header.module.css";

/**
 * Header Component
 *
 * Displays the main application header with branding and description.
 * Provides an introduction to the Tokyo Friendliness App and its purpose.
 *
 * Features:
 * - Next.js logo with optimized loading
 * - Application title in English
 * - Descriptive text explaining the app's functionality
 * - Responsive design with centered layout
 * - Clean typography and spacing
 *
 * This is a pure UI component with no props - it displays static content
 * that introduces users to the prefecture friendship optimization application.
 *
 * @returns JSX element rendering the application header
 */
export function Header() {
  return (
    <header className={styles.header}>
      <Image
        className={styles.logo}
        src="/next.svg"
        alt="Next.js logo"
        width={180}
        height={38}
        priority
      />
      <h1 className={styles.title}>Tokyo Friendliness App</h1>
      <p className={styles.description}>
        This app optimizes prefecture groupings based on friendliness data to maximize total
        friendship scores using advanced algorithms.
      </p>
    </header>
  );
}
