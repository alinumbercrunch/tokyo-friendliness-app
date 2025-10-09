/**
 * Defines and exports React components for displaying various states of the PopulationTable,
 * such as error, no data, and loading.
 */
import styles from "./PopulationTable.module.css";
import {
  ESTAT_API_ERROR_TITLE,
  ESTAT_API_ERROR_MESSAGE,
  POPULATION_DATA_TITLE,
  POPULATION_DATA_ERROR_MESSAGE,
  LOADING_MESSAGE,
} from "./constants";

interface ErrorDisplayProps {
  error: string;
}

export function ErrorDisplay({ error }: ErrorDisplayProps) {
  return (
    <div className={styles.error}>
      <h2>{ESTAT_API_ERROR_TITLE}</h2>
      <p>{error}</p>
      <p>{ESTAT_API_ERROR_MESSAGE}</p>
    </div>
  );
}

export function NoDataDisplay() {
  return (
    <div className={styles.noData}>
      <h2>{POPULATION_DATA_TITLE}</h2>
      <p>{POPULATION_DATA_ERROR_MESSAGE}</p>
    </div>
  );
}

export function LoadingDisplay() {
  return (
    <div className={styles.noData}>
      <h2>{POPULATION_DATA_TITLE}</h2>
      <p>{LOADING_MESSAGE}</p>
    </div>
  );
}
