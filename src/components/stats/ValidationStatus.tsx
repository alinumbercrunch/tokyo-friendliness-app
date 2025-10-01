import styles from "./ValidationStatus.module.css";

/**
 * Props for the ValidationStatus component
 */
interface ValidationStatusProps {
  /**
   * Whether the optimization algorithm found the optimal solution
   * When true, displays success message; when false, shows warning
   */
  isOptimal: boolean;

  /**
   * Total number of possible partition combinations that were validated against
   * Used to show the scale of the optimization problem solved
   */
  totalPartitions: number;
}

/**
 * Validation Status Component
 *
 * Displays the validation status of the optimization algorithm results.
 * Shows whether the algorithm successfully found the optimal solution and
 * provides context about the scale of the problem by showing the total
 * number of possible combinations evaluated.
 *
 * Features:
 * - Success/warning indicator with appropriate emoji and styling
 * - Shows scale of optimization problem (total combinations)
 * - Formatted number display with thousands separators
 * - Clear messaging about algorithm performance
 *
 * Visual States:
 * - ✅ Success: When optimal solution is found
 * - ⚠️ Warning: When algorithm may not have found optimal solution
 *
 * @param props - Component props
 * @returns JSX element rendering the validation status
 */
export function ValidationStatus({ isOptimal, totalPartitions }: ValidationStatusProps) {
  return (
    <div className={styles.validation}>
      {isOptimal ? (
        <p className={styles.success}>✅ Algorithm found the optimal solution!</p>
      ) : (
        <p className={styles.warning}>⚠️ Algorithm may not have found the optimal solution</p>
      )}
      <p className={styles.info}>
        Validated against {totalPartitions.toLocaleString()} possible combinations
      </p>
    </div>
  );
}
