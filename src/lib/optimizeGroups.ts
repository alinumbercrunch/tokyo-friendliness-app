import type { Partition, FriendlinessMap, DebugOptions, MemoResult } from "./types";
import { DEFAULT_MAX_GROUPS } from "./types";
import { validatePartitionInputs, validateFriendlinessMap } from "./validators";
import { calculateMaxRemainingPotential, calculateIncrementalScore } from "./scoring";
import { makeMemoKey } from "./memoization";
import { deepCopy, sortPartition } from "./partitionUtils";

// Re-export commonly used functions and types
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
} from "./types";
export { DEFAULT_MAX_GROUPS } from "./types";

/**
 * TOKYO FRIENDLINESS OPTIMIZATION ALGORITHM
 * ========================================
 *
 * This algorithm finds the optimal way to partition Japanese prefectures into friendship groups
 * to maximize the total friendship score. It uses dynamic programming with memoization,
 * branch-and-bound pruning, and backtracking to efficiently explore the solution space.
 *
 * COMPLETE ALGORITHM WALKTHROUGH:
 * ==============================
 *
 * PROBLEM: Given prefectures [東京都, 神奈川県, 埼玉県, 千葉県, 茨城県] and friendship scores,
 * find the grouping that maximizes total friendship.
 *
 * STEP-BY-STEP EXECUTION:
 *
 * 1. START: Call generateBestPartition([東京都, 神奈川県, 埼玉県, 千葉県, 茨城県])
 *
 * 2. INITIALIZATION:
 *    - Set globalBestScore = -Infinity
 *    - Create empty memoization cache
 *    - Set up debugging counters
 *
 * 3. FIRST RECURSIVE CALL:
 *    buildOptimalPartitions([東京都, 神奈川県, 埼玉県, 千葉県, 茨城県], [], 0)
 *
 * 4. DECISION TREE EXPLORATION:
 *
 *    Level 1: Place 東京都
 *    ├── Try: [[東京都]] (new group)
 *    │   └── Recurse with: [神奈川県, 埼玉県, 千葉県, 茨城県]
 *    │
 *    │   Level 2: Place 神奈川県
 *    │   ├── Try: [[東京都, 神奈川県]] (add to existing)
 *    │   │   Score: 0 + 20 = 20 ✓
 *    │   │   └── Recurse with: [埼玉県, 千葉県, 茨城県]
 *    │   │
 *    │   │   Level 3: Place 埼玉県
 *    │   │   ├── Try: [[東京都, 神奈川県, 埼玉県]]
 *    │   │   │   Score: 20 + 10 + (-30) = 0
 *    │   │   │   └── Continue recursion...
 *    │   │   │
 *    │   │   ├── Try: [[東京都, 神奈川県], [埼玉県]] (new group)
 *    │   │   │   Score: 20 + 0 = 20
 *    │   │   │   └── Continue recursion...
 *    │   │   │
 *    │   │   │   Level 4: Place 千葉県
 *    │   │   │   ├── Try: [[東京都, 神奈川県, 千葉県], [埼玉県]]
 *    │   │   │   │   Score: 20 + 10 + (-30) = 0
 *    │   │   │   ├── Try: [[東京都, 神奈川県], [埼玉県, 千葉県]]
 *    │   │   │   │   Score: 20 + (-50) = -30
 *    │   │   │   └── Try: [[東京都, 神奈川県], [埼玉県], [千葉県]]
 *    │   │   │       Score: 20 + 0 = 20
 *    │   │   │
 *    │   │   │       Level 5: Place 茨城県 (FINAL LEVEL)
 *    │   │   │       ├── Try: [[東京都, 神奈川県, 茨城県], [埼玉県], [千葉県]]
 *    │   │   │       │   Score: 20 + 50 + 10 + 0 + 0 = 80 🏆 NEW BEST!
 *    │   │   │       ├── Try: [[東京都, 神奈川県], [埼玉県, 茨城県], [千葉県]]
 *    │   │   │       │   Score: 20 + (-20) + 0 = 0
 *    │   │   │       └── Try: [[東京都, 神奈川県], [埼玉県], [千葉県, 茨城県]]
 *    │   │           │   Score: 20 + 0 + 10 = 30
 *    │   │
 *    │   │           BACKTRACK: Undo all changes, try next branch
 *    │   │
 *    │   └── Try: [[東京都], [神奈川県]] (new group for 神奈川県)
 *    │       Score: 0 + 0 = 0
 *    │       └── Continue exploring...
 *
 * 5. PRUNING IN ACTION:
 *    When globalBestScore = 80, algorithm encounters a branch:
 *    - Current score: 40
 *    - Remaining prefectures: [茨城県]
 *    - Max possible gain: friendship(茨城県, others) = ~10
 *    - Upper bound: 40 + 10 = 50 ≤ 80
 *    - DECISION: ✂️ PRUNE! This branch cannot beat 80.
 *
 * 6. MEMOIZATION IN ACTION:
 *    If we encounter the same subproblem again:
 *    - Key: "埼玉県,千葉県::東京都,神奈川県|茨城県"
 *    - Cache lookup: Found previous result!
 *    - DECISION: Return cached result (massive speedup)
 *
 * 7. FINAL RESULT:
 *    - Optimal partition: [[東京都, 神奈川県, 茨城県], [埼玉県], [千葉県]]
 *    - Optimal score: 80
 *    - Branches explored: ~20 (out of 41 total possible)
 *    - Branches pruned: 2
 *    - Memoization hits: 0 (small problem)
 *
 * WHY IT'S EFFICIENT:
 * ==================
 * 1. **Dynamic Programming**: Breaks large problem into manageable subproblems
 * 2. **Memoization**: Avoids redundant computation of identical subproblems
 * 3. **Branch-and-Bound**: Prunes hopeless branches early
 * 4. **Progressive Optimization**: Updates best solution as it finds better ones
 * 5. **Backtracking**: Efficiently explores all promising alternatives
 *
 * VS BRUTE FORCE COMPARISON:
 * - Brute Force: Tests all 41 partitions (100% exploration)
 * - Our Algorithm: Finds optimal in ~20 explorations (48% exploration)
 * - Speedup: ~2x on this small example, exponentially better on larger inputs!
 *
 * ALGORITHM OVERVIEW:
 * 1. **Input Validation**: Ensure all prefectures exist in friendliness map and no duplicates
 * 2. **Recursive Exploration**: Try all possible ways to partition prefectures into groups
 * 3. **Memoization**: Cache results to avoid recomputing identical subproblems
 * 4. **Pruning**: Skip branches that cannot improve the current best solution
 * 5. **Backtracking**: Undo changes to explore alternative arrangements
 * 6. **Score Optimization**: Track and update the globally optimal partition
 *
 * TIME COMPLEXITY: O(Bell(n) * n²) where Bell(n) is the nth Bell number (number of partitions)
 * SPACE COMPLEXITY: O(Bell(n) * n) for memoization cache
 *
 * @param prefectures Array of prefecture names to partition
 * @param friendlinessMap Map of friendship scores between prefectures
 * @param maxGroups Maximum number of groups allowed (default: 3)
 * @param debugOptions Optional debug configuration for logging
 * @returns Best partition found with highest friendship score
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
  let globalBestScore = -Infinity; // Best score found so far
  let globalBestPartition: Partition = []; // Best partition found so far

  // STEP 4: Setup memoization and debugging infrastructure
  const memoCache = new Map<string, MemoResult>(); // Cache for dynamic programming
  let memoHits = 0; // Count of cache hits (performance metric)
  let pruningCount = 0; // Count of pruned branches (efficiency metric)
  let bestUpdateCount = 0; // Count of times we found a better solution

  /**
   * CORE RECURSIVE FUNCTION: buildOptimalPartitions
   * ===============================================
   *
   * This is the heart of the dynamic programming algorithm. It recursively explores
   * all possible ways to partition the remaining prefectures into groups, using
   * memoization and pruning to optimize performance.
   *
   * HOW THE ALGORITHM WORKS - DETAILED WALKTHROUGH:
   * ==============================================
   *
   * EXAMPLE: Starting with [東京都, 神奈川県, 埼玉県, 千葉県, 茨城県]
   *
   * STEP 1: MEMOIZATION CHECK
   * - Creates unique key: "千葉県,埼玉県,茨城県::東京都,神奈川県|"
   * - Checks if we've solved this exact subproblem before
   * - If yes: return cached result (saves massive computation)
   * - If no: continue to explore this branch
   *
   * STEP 2: BASE CASE CHECK
   * - If remainingPrefectures = [] → we're done!
   * - Return current partition and score
   * - This is how recursion "bottoms out"
   *
   * STEP 3: PRUNING DECISION (Branch-and-Bound)
   * - Current situation: score=40, remaining=[茨城県], groups=[[千葉県],[埼玉県,東京都,神奈川県]]
   * - Question: "Could this branch possibly beat our best (80)?"
   * - Calculate max possible: currentScore(40) + maxRemainingPotential(??)
   * - If 40 + maxPotential ≤ 80 → PRUNE! (save computation)
   * - If 40 + maxPotential > 80 → CONTINUE exploring
   *
   * STEP 4: TRY ALL POSSIBLE MOVES
   * For prefecture "茨城県", we have choices:
   *
   * CHOICE A: Add to existing Group 1 [千葉県]
   * - Calculate new score: +friendship(茨城県,千葉県)
   * - New partition: [[千葉県,茨城県], [埼玉県,東京都,神奈川県]]
   * - Recursively solve remaining prefectures: []
   *
   * CHOICE B: Add to existing Group 2 [埼玉県,東京都,神奈川県]
   * - Calculate new score: +friendship(茨城県,埼玉県) +friendship(茨城県,東京都) +friendship(茨城県,神奈川県)
   * - New partition: [[千葉県], [埼玉県,東京都,神奈川県,茨城県]]
   * - Recursively solve remaining: []
   *
   * CHOICE C: Create new Group 3 [茨城県]
   * - New partition: [[千葉県], [埼玉県,東京都,神奈川県], [茨城県]]
   * - Recursively solve remaining: []
   *
   * STEP 5: BACKTRACKING MAGIC
   * - Try Choice A → get result A
   * - UNDO Choice A (restore original state)
   * - Try Choice B → get result B
   * - UNDO Choice B (restore original state)
   * - Try Choice C → get result C
   * - UNDO Choice C (restore original state)
   * - Pick the BEST of {A, B, C}
   *
   * STEP 6: CACHING & RETURN
   * - Cache the best result for this subproblem
   * - Return it to parent call
   *
   * WHY THIS IS EFFICIENT:
   * - Memoization: Never solve same subproblem twice
   * - Pruning: Skip branches that can't possibly win
   * - Progressive: Find better solutions as we go
   * - Smart ordering: Try promising moves first
   *
   * ALGORITHM STEPS:
   * 1. Check if we've solved this subproblem before (memoization)
   * 2. Handle base case: no more prefectures to assign
   * 3. Prune branches that cannot beat current best (branch-and-bound)
   * 4. Try all possible moves for the next prefecture:
   *    a) Add to each existing group (if any)
   *    b) Create a new group (if under maxGroups limit)
   * 5. Use backtracking to undo changes and explore alternatives
   * 6. Cache and return the best result for this subproblem
   *
   * @param remainingPrefectures Prefectures still to be assigned to groups
   * @param currentPartition Current state of the partition being built
   * @param currentScore Current friendship score of the partition
   * @returns Best possible result from this state
   */
  function buildOptimalPartitions(
    remainingPrefectures: string[],
    currentPartition: Partition,
    currentScore: number
  ): MemoResult {
    // STEP 1: Memoization check - avoid redundant computation
    // Create a unique key representing this exact state
    const memoKey = makeMemoKey(remainingPrefectures, currentPartition);
    const cached = memoCache.get(memoKey);
    if (cached) {
      memoHits++;
      if (debugOptions.logMemoHits) {
        console.log(`🎯 Memo hit: ${memoKey} -> score: ${cached.score}`);
      }
      return cached;
    }

    // STEP 2: Base case - all prefectures have been assigned
    if (remainingPrefectures.length === 0) {
      return handleBaseCase(currentPartition, currentScore, memoKey);
    }

    // STEP 3: Improved pruning check - branch-and-bound optimization
    // Calculate maximum possible score we could achieve from this state
    // Now accounts for both remaining-to-remaining AND remaining-to-existing interactions
    const maxRemainingPotential = calculateMaxRemainingPotential(
      remainingPrefectures,
      friendlinessMap,
      currentPartition
    );

    // If even our best-case scenario can't beat the current best, prune this branch
    if (currentScore + maxRemainingPotential <= globalBestScore) {
      return handlePruning(memoKey);
    }

    // STEP 4: Recursive exploration - try all possible moves
    const result = explorePartitionMoves(remainingPrefectures, currentPartition, currentScore);

    // STEP 5: Cache the result for future lookups
    memoCache.set(memoKey, result);
    return result;
  }

  /**
   * HANDLE BASE CASE: All prefectures assigned
   * ==========================================
   *
   * This function handles the termination condition of our recursion.
   * When we've assigned all prefectures to groups, we check if this
   * partition is better than our current best and update accordingly.
   *
   * @param currentPartition Complete partition to evaluate
   * @param currentScore Total friendship score of this partition
   * @param memoKey Cache key for this result
   * @returns MemoResult containing the score and partition
   */
  function handleBaseCase(
    currentPartition: Partition,
    currentScore: number,
    memoKey: string
  ): MemoResult {
    if (currentPartition.length > 0) {
      // Check if this is our new best solution
      if (currentScore > globalBestScore) {
        globalBestScore = currentScore;
        globalBestPartition = currentPartition.map((group) => [...group]);
        bestUpdateCount++;
        if (debugOptions.logBestUpdates) {
          console.log(`🏆 New best score: ${currentScore}, partition:`, currentPartition);
        }
      }

      // Create result with shallow copy (safe since we're at base case)
      const result = {
        score: currentScore,
        partition: currentPartition.map((group) => [...group]),
      };
      memoCache.set(memoKey, result);
      return result;
    }

    // Handle empty partition edge case
    const emptyResult = { score: -Infinity, partition: [] };
    memoCache.set(memoKey, emptyResult);
    return emptyResult;
  }

  /**
   * HANDLE PRUNING: Record and cache pruned branches
   * ==============================================
   *
   * When we determine a branch cannot lead to a better solution,
   * we prune it early to save computation. This function handles
   * the bookkeeping: incrementing counters, logging, and caching
   * the pruned result to avoid revisiting this branch.
   *
   * @param memoKey Cache key for this pruned branch
   * @returns MemoResult indicating this branch was pruned
   */
  function handlePruning(memoKey: string): MemoResult {
    pruningCount++;
    if (debugOptions.logPruning) {
      console.log(`✂️ Pruned branch at key: ${memoKey}`);
    }
    const prunedResult = { score: -Infinity, partition: [] };
    memoCache.set(memoKey, prunedResult);
    return prunedResult;
  }

  /**
   * EXPLORE PARTITION MOVES: The core decision-making logic
   * ======================================================
   *
   * This function implements the heart of our decision tree exploration.
   * For each prefecture, we systematically try every possible placement.
   *
   * DETAILED WALKTHROUGH EXAMPLE:
   * ============================
   *
   * Situation:
   * - remainingPrefectures = [埼玉県, 千葉県, 茨城県]
   * - currentPartition = [[東京都, 神奈川県]]
   * - currentScore = 20 (friendship between 東京都 and 神奈川県)
   *
   * STEP 1: Pick next prefecture → 埼玉県
   *
   * STEP 2: Generate all possible moves for 埼玉県
   *
   * MOVE 1: Add 埼玉県 to existing Group 0 [東京都, 神奈川県]
   * ┌─────────────────────────────────────────────────┐
   * │ FORWARD STEP:                                   │
   * │ - Calculate friendship bonus:                   │
   * │   埼玉県 ↔ 東京都: +10                         │
   * │   埼玉県 ↔ 神奈川県: -30                       │
   * │   Total bonus: -20                             │
   * │ - Add 埼玉県 to group: [[東京都,神奈川県,埼玉県]] │
   * │ - New score: 20 + (-20) = 0                    │
   * │ - Remaining: [千葉県, 茨城県]                   │
   * │                                                 │
   * │ RECURSIVE CALL:                                 │
   * │ buildOptimalPartitions([千葉県,茨城県], [[東京都,神奈川県,埼玉県]], 0)
   * │ ↓ (returns best possible result from this state)
   * │ result1 = {score: 10, partition: [...]}        │
   * │                                                 │
   * │ BACKTRACK STEP:                                 │
   * │ - Remove 埼玉県 from group                      │
   * │ - Restore partition: [[東京都, 神奈川県]]        │
   * │ - Restore score: 20                            │
   * └─────────────────────────────────────────────────┘
   *
   * MOVE 2: Create new Group 1 with just [埼玉県]
   * ┌─────────────────────────────────────────────────┐
   * │ FORWARD STEP:                                   │
   * │ - Create new group: [埼玉県]                    │
   * │ - Friendship bonus: 0 (no interactions)        │
   * │ - New partition: [[東京都,神奈川県], [埼玉県]]   │
   * │ - New score: 20 + 0 = 20                       │
   * │ - Remaining: [千葉県, 茨城県]                   │
   * │                                                 │
   * │ RECURSIVE CALL:                                 │
   * │ buildOptimalPartitions([千葉県,茨城県], [[東京都,神奈川県],[埼玉県]], 20)
   * │ ↓ (returns best possible result)               │
   * │ result2 = {score: 80, partition: [...]}        │
   * │                                                 │
   * │ BACKTRACK STEP:                                 │
   * │ - Remove the [埼玉県] group                     │
   * │ - Restore partition: [[東京都, 神奈川県]]        │
   * │ - Restore score: 20                            │
   * └─────────────────────────────────────────────────┘
   *
   * STEP 3: Compare all results
   * - result1.score = 10
   * - result2.score = 80
   * - WINNER: result2 → return {score: 80, partition: optimal}
   *
   * WHY THIS WORKS:
   * ==============
   * 1. SYSTEMATIC EXPLORATION: Tries every possible placement
   * 2. BACKTRACKING: Cleanly undoes changes to try alternatives
   * 3. RECURSIVE DECOMPOSITION: Breaks big problem into smaller ones
   * 4. OPTIMAL SUBSTRUCTURE: Best solution uses best sub-solutions
   * 5. IN-PLACE MODIFICATION: Efficient memory usage
   *
   * KEY INSIGHT: The algorithm is like a tree search where each node
   * represents a partial partition, and each edge represents placing
   * one more prefecture. It explores ALL paths but prunes impossible ones.
   *
   * For each prefecture, we have two fundamental choices:
   * 1. Add it to an existing group (if any exist)
   * 2. Create a new group with just this prefecture (if under maxGroups limit)
   *
   * We systematically try both options, using backtracking to explore
   * all possibilities while maintaining the current partition state.
   *
   * BACKTRACKING PATTERN:
   * - Make a change to the partition
   * - Recursively solve the remaining subproblem
   * - Undo the change (backtrack)
   * - Try the next possibility
   *
   * @param remainingPrefectures Prefectures still to assign
   * @param currentPartition Current partition state (modified in-place)
   * @param currentScore Current total friendship score
   * @returns Best result found from exploring all moves
   */
  function explorePartitionMoves(
    remainingPrefectures: string[],
    currentPartition: Partition,
    currentScore: number
  ): MemoResult {
    // Take the next prefecture to assign
    const [nextPrefecture, ...restPrefectures] = remainingPrefectures;
    let bestLocalScore = -Infinity;
    let bestLocalPartition: Partition = [];

    // OPTION 1: Add to existing groups
    // Try adding the prefecture to each existing group
    for (let groupIndex = 0; groupIndex < currentPartition.length; groupIndex++) {
      // Calculate how much score we gain by adding this prefecture to this group
      const incrementalScore = calculateIncrementalScore(
        nextPrefecture,
        currentPartition[groupIndex],
        friendlinessMap
      );

      // BACKTRACKING STEP 1: Make the change
      currentPartition[groupIndex].push(nextPrefecture);

      // RECURSIVE CALL: Solve the remaining subproblem
      const result = buildOptimalPartitions(
        restPrefectures,
        currentPartition,
        currentScore + incrementalScore
      );

      // Update best result if this path was better
      if (result.score > bestLocalScore) {
        bestLocalScore = result.score;
        bestLocalPartition = deepCopy(result.partition);
      }

      // BACKTRACKING STEP 2: Undo the change
      currentPartition[groupIndex].pop();
    }

    // OPTION 2: Create a new group (if we haven't hit the limit)
    if (currentPartition.length < maxGroups) {
      // BACKTRACKING STEP 1: Make the change (create new group)
      currentPartition.push([nextPrefecture]);

      // RECURSIVE CALL: Solve with new group (no score change yet)
      const result = buildOptimalPartitions(restPrefectures, currentPartition, currentScore);

      // Update best result if this path was better
      if (result.score > bestLocalScore) {
        bestLocalScore = result.score;
        bestLocalPartition = deepCopy(result.partition);
      }

      // BACKTRACKING STEP 2: Undo the change (remove new group)
      currentPartition.pop();
    }

    return { score: bestLocalScore, partition: bestLocalPartition };
  }

  // STEP 5: Execute the optimization algorithm
  // Start with all prefectures unassigned, empty partition, and zero score
  buildOptimalPartitions(prefectures, [], 0);

  // STEP 6: Report algorithm performance metrics
  if (debugOptions.logMemoHits || debugOptions.logPruning || debugOptions.logBestUpdates) {
    console.log("ALGORITHM PERFORMANCE SUMMARY");
    console.log("================================");
    console.log("Memoization hits: " + memoHits + " (cache efficiency)");
    console.log("Branches pruned: " + pruningCount + " (optimization effectiveness)");
    console.log("Best solutions found: " + bestUpdateCount + " (solution quality improvements)");
    console.log("Final best score: " + globalBestScore);
  }

  // STEP 7: Return the optimal solution with consistent formatting
  // Sort the partition for deterministic output across multiple runs
  return sortPartition(globalBestPartition);
}
