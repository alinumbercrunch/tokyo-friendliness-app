import styles from "./ValidationStatus.module.css";
import {
  OPTIMAL_SOLUTION_MESSAGE,
  OPTIMAL_SOLUTION_MESSAGE_JA,
  NOT_OPTIMAL_SOLUTION_MESSAGE,
  NOT_OPTIMAL_SOLUTION_MESSAGE_JA,
  VALIDATED_AGAINST_PREFIX,
  VALIDATED_AGAINST_SUFFIX,
  VALIDATED_AGAINST_JA,
} from "./constants";

interface ValidationStatusProps {
  isOptimal: boolean;
  totalPartitions: number;
}
// Validation Status Component
export function ValidationStatus({ isOptimal, totalPartitions }: ValidationStatusProps) {
  return (
    <div className={styles.validation}>
      {isOptimal ? (
        <p className={styles.success}>
          {OPTIMAL_SOLUTION_MESSAGE}
          <br />
          <span lang="ja">{OPTIMAL_SOLUTION_MESSAGE_JA}</span>
        </p>
      ) : (
        <p className={styles.warning}>
          {NOT_OPTIMAL_SOLUTION_MESSAGE}
          <br />
          <span lang="ja">{NOT_OPTIMAL_SOLUTION_MESSAGE_JA}</span>
        </p>
      )}
      <p className={styles.info}>
        {VALIDATED_AGAINST_PREFIX}
        {totalPartitions.toLocaleString()}
        {VALIDATED_AGAINST_SUFFIX}
        <br />
        <span lang="ja">
          {VALIDATED_AGAINST_JA}
          {totalPartitions.toLocaleString()}
        </span>
      </p>
    </div>
  );
}
