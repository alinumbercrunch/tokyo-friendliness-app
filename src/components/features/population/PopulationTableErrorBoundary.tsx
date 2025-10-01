"use client";
import React from "react";
import styles from "./PopulationTable.module.css";

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
      return (
        <div className={styles.errorBoundary}>
          An error occurred while displaying the population table.
        </div>
      );
    }
    return this.props.children;
  }
}
