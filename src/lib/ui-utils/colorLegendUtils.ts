/**
 * Color Legend Utilities
 * 
 * Utility functions for processing and formatting group data for the ColorLegend component.
 * Handles score extraction, group processing, and sorting logic.
 */

import type { OptimizationResult } from "@/lib/services/optimizationService";

/**
 * Represents a group with its associated score information
 */
export interface GroupWithScore {
  /** Display name of the group (in Japanese) */
  name: string;
  /** CSS color class name (blue, green, orange) */
  color: string;
  /** Numeric index of the group (0, 1, 2) */
  index: number;
  /** Calculated score for this group */
  score: number;
}

/**
 * Default group configuration
 * Defines the standard 3 groups used in the friendship optimization
 */
const DEFAULT_GROUPS = [
  { name: "グループ1", color: "blue", index: 0 },
  { name: "グループ2", color: "green", index: 1 },
  { name: "グループ3", color: "orange", index: 2 },
];

/**
 * Fallback scores used when optimization results are not available
 * Provides reasonable default scores for demonstration purposes
 */

const FALLBACK_SCORES = [45, 30, 25];

/**
 * Extracts group score from optimization results
 */
export function getGroupScore(
  groupIndex: number,
  optimizationResults?: OptimizationResult
): number {
  if (!optimizationResults?.colorRankings) {
    return FALLBACK_SCORES[groupIndex] || 0;
  }

  const ranking = optimizationResults.colorRankings.find(
    (r) => r.groupIndex === groupIndex
  );
  return ranking?.groupScore ? Math.round(ranking.groupScore) : 0;
}

/**
 * Processes groups with scores and sorts by highest score first
 */
export function processGroupsWithScores(
  optimizationResults?: OptimizationResult
): GroupWithScore[] {
  return DEFAULT_GROUPS
    .map((group) => ({
      ...group,
      score: getGroupScore(group.index, optimizationResults),
    }))
    .sort((a, b) => b.score - a.score);
}