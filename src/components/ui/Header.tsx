import Image from "next/image";
import styles from "./Header.module.css";

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
