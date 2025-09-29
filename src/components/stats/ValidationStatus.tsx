import styles from "./ValidationStatus.module.css";

interface ValidationStatusProps {
  isOptimal: boolean;
  totalPartitions: number;
}

export function ValidationStatus({ isOptimal, totalPartitions }: ValidationStatusProps) {
  return (
    <div className={styles.validation}>
      {isOptimal ? (
        <p className={styles.success}>
          ✅ Algorithm found the optimal solution!
        </p>
      ) : (
        <p className={styles.warning}>
          ⚠️ Algorithm may not have found the optimal solution
        </p>
      )}
      <p className={styles.info}>
        Validated against {totalPartitions.toLocaleString()} possible combinations
      </p>
    </div>
  );
}