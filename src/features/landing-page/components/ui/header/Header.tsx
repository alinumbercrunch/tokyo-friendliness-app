import styles from "./Header.module.css";
import { APP_TITLE, APP_DESCRIPTION, APP_DESCRIPTION_JA } from "./constants";

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
      <h1 className={styles.title}>{APP_TITLE}</h1>
      <p className={styles.description}>{APP_DESCRIPTION}</p>
      <p className={styles.description}>{APP_DESCRIPTION_JA}</p>
    </header>
  );
}
