import type { Partition, FriendlinessMap, DebugOptions, MemoResult } from "@/lib/shared/types";
import { DEFAULT_MAX_GROUPS } from "@/lib/shared/types";
import { validatePartitionInputs, validateFriendlinessMap } from "@/lib/shared/validators";
import { calculateMaxRemainingPotential, calculateIncrementalScore } from "@/lib/algorithm/scoring";
import { makeMemoKey } from "@/lib/algorithm/memoization";
import { deepCopy, sortPartition } from "@/lib/algorithm/partitionUtils";
import {
  MEMO_HIT_MESSAGE,
  SCORE_MESSAGE,
  NEW_BEST_SCORE_MESSAGE,
  PARTITION_MESSAGE,
  PRUNED_BRANCH_MESSAGE,
  ALGORITHM_PERFORMANCE_SUMMARY_TITLE,
  SEPARATOR,
  MEMOIZATION_HITS_MESSAGE,
  CACHE_EFFICIENCY_MESSAGE,
  BRANCHES_PRUNED_MESSAGE,
  OPTIMIZATION_EFFECTIVENESS_MESSAGE,
  BEST_SOLUTIONS_FOUND_MESSAGE,
  SOLUTION_QUALITY_IMPROVEMENTS_MESSAGE,
  FINAL_BEST_SCORE_MESSAGE,
} from "./constants";

// Re-export utility functions and types
export {
  generateAllPartitions as generatePartitions,
  deepCopy,
  sortPartition,
} from "./partitionUtils";
export { calculatePartitionScore, normalizeScore } from "./scoring";
export type {
  Partition,
  PartitionSet,
  FriendlinessMap,
  FriendlinessMatrix,
  DebugOptions,
} from "../shared/types";
export { DEFAULT_MAX_GROUPS } from "../shared/types";

/**
 * Core logic for the Tokyo Friendliness Optimization algorithm.
 * Finds the optimal partitioning of prefectures into groups to maximize a "friendliness score".
 *
 * For a detailed walkthrough and educational explanation, see:
 *   docs/optimization-algorithm.md
 */
export function generateBestPartition(
  prefectures: string[],
  friendlinessMap: FriendlinessMap,
  maxGroups: number = DEFAULT_MAX_GROUPS,
  debugOptions: DebugOptions = {}
): Partition {
  // STEP 1: Handle edge cases
  if (prefectures.length === 0) return [];

  // STEP 2: Input validation - ensure data integrity
  validatePartitionInputs(prefectures, maxGroups);
  validateFriendlinessMap(prefectures, friendlinessMap);

  // STEP 3: Initialize global state for optimization
  let globalBestScore = -Infinity;
  let globalBestPartition: Partition = [];
  const memoCache = new Map<string, MemoResult>();
  let memoHits = 0;
  let pruningCount = 0;
  let bestUpdateCount = 0;

  /**
   * Recursive DP with memoization. See docs/optimization-algorithm.md.
   */
  function buildOptimalPartitions(
    remainingPrefectures: string[],
    currentPartition: Partition,
    currentScore: number
  ): MemoResult {
    // Memoization check
    const memoKey = makeMemoKey(remainingPrefectures, currentPartition);
    const cached = memoCache.get(memoKey);
    if (cached) {
      memoHits++;
      if (debugOptions.logMemoHits) {
        console.log(`${MEMO_HIT_MESSAGE}${memoKey}${SCORE_MESSAGE}${cached.score}`);
      }
      return cached;
    }

    // Base case: all assigned
    if (remainingPrefectures.length === 0) {
      return handleBaseCase(currentPartition, currentScore, memoKey);
    }

    // Pruning: branch-and-bound
    const maxRemainingPotential = calculateMaxRemainingPotential(
      remainingPrefectures,
      friendlinessMap,
      currentPartition
    );

    // Prune if best-case can't beat current best
    if (currentScore + maxRemainingPotential <= globalBestScore) {
      return handlePruning(memoKey);
    }

    // Recursive exploration
    const result = explorePartitionMoves(remainingPrefectures, currentPartition, currentScore);

    // Cache result
    memoCache.set(memoKey, result);
    return result;
  }

  /**
   * Handle base case: update global best if needed.
   */
  function handleBaseCase(
    currentPartition: Partition,
    currentScore: number,
    memoKey: string
  ): MemoResult {
    if (currentPartition.length > 0) {
      // New best solution?
      if (currentScore > globalBestScore) {
        globalBestScore = currentScore;
        globalBestPartition = currentPartition.map((group) => [...group]);
        bestUpdateCount++;
        if (debugOptions.logBestUpdates) {
          console.log(
            `${NEW_BEST_SCORE_MESSAGE}${currentScore}${PARTITION_MESSAGE}`,
            currentPartition
          );
        }
      }

      // Shallow copy result
      const result = {
        score: currentScore,
        partition: currentPartition.map((group) => [...group]),
      };
      memoCache.set(memoKey, result);
      return result;
    }

    // Handle empty partition
    const emptyResult = { score: -Infinity, partition: [] };
    memoCache.set(memoKey, emptyResult);
    return emptyResult;
  }

  /**
   * Prune branch if it can't improve best.
   */
  function handlePruning(memoKey: string): MemoResult {
    pruningCount++;
    if (debugOptions.logPruning) {
      console.log(`${PRUNED_BRANCH_MESSAGE}${memoKey}`);
    }
    const prunedResult = { score: -Infinity, partition: [] };
    memoCache.set(memoKey, prunedResult);
    return prunedResult;
  }

  /**
   * Explore all possible moves for next prefecture.
   */
  function explorePartitionMoves(
    remainingPrefectures: string[],
    currentPartition: Partition,
    currentScore: number
  ): MemoResult {
    // Next prefecture
    const [nextPrefecture, ...restPrefectures] = remainingPrefectures;
    let bestLocalScore = -Infinity;
    let bestLocalPartition: Partition = [];

    // Try adding to existing groups
    for (let groupIndex = 0; groupIndex < currentPartition.length; groupIndex++) {
      // Score gain for this group
      const incrementalScore = calculateIncrementalScore(
        nextPrefecture,
        currentPartition[groupIndex],
        friendlinessMap
      );

      // Make change
      currentPartition[groupIndex].push(nextPrefecture);

      // Recurse
      const result = buildOptimalPartitions(
        restPrefectures,
        currentPartition,
        currentScore + incrementalScore
      );

      // Update best if better
      if (result.score > bestLocalScore) {
        bestLocalScore = result.score;
        bestLocalPartition = deepCopy(result.partition);
      }

      // Undo change
      currentPartition[groupIndex].pop();
    }

    // Try creating new group
    if (currentPartition.length < maxGroups) {
      // Make new group
      currentPartition.push([nextPrefecture]);

      // Recurse with new group
      const result = buildOptimalPartitions(restPrefectures, currentPartition, currentScore);

      // Update best if better
      if (result.score > bestLocalScore) {
        bestLocalScore = result.score;
        bestLocalPartition = deepCopy(result.partition);
      }

      // Undo new group
      currentPartition.pop();
    }

    return { score: bestLocalScore, partition: bestLocalPartition };
  }

  // Run optimization
  buildOptimalPartitions(prefectures, [], 0);

  // Report metrics
  if (debugOptions.logMemoHits || debugOptions.logPruning || debugOptions.logBestUpdates) {
    console.log(ALGORITHM_PERFORMANCE_SUMMARY_TITLE);
    console.log(SEPARATOR);
    console.log(MEMOIZATION_HITS_MESSAGE + memoHits + CACHE_EFFICIENCY_MESSAGE);
    console.log(BRANCHES_PRUNED_MESSAGE + pruningCount + OPTIMIZATION_EFFECTIVENESS_MESSAGE);
    console.log(
      BEST_SOLUTIONS_FOUND_MESSAGE + bestUpdateCount + SOLUTION_QUALITY_IMPROVEMENTS_MESSAGE
    );
    console.log(FINAL_BEST_SCORE_MESSAGE + globalBestScore);
  }

  // Return sorted result
  return sortPartition(globalBestPartition);
}
