/**
 * Error boundary for the PopulationTable component.
 * Catches client-side rendering errors and displays a fallback UI.
 */
"use client";
import React from "react";
import styles from "./PopulationTable.module.css";
import { POPULATION_TABLE_ERROR_BOUNDARY_MESSAGE } from "./constants";

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

export class PopulationTableErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch() {
    // Optionally log error to an external service
  }

  render() {
    if (this.state.hasError) {
      return <div className={styles.errorBoundary}>{POPULATION_TABLE_ERROR_BOUNDARY_MESSAGE}</div>;
    }
    return this.props.children;
  }
}
