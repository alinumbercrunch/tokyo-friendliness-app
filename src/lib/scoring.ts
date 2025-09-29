import type { Partition, FriendlinessMap } from "@/lib/types";

/**
 * Calculates the total friendship score for a group of prefectures
 */
export function calculateGroupScore(group: string[], friendlinessMap: FriendlinessMap): number {
  let score = 0;
  for (let i = 0; i < group.length; i++) {
    for (let j = i + 1; j < group.length; j++) {
      const prefecture1 = group[i];
      const prefecture2 = group[j];

      // Get bidirectional friendship scores
      const score1to2 = friendlinessMap.get(prefecture1)?.get(prefecture2) ?? 0;
      const score2to1 = friendlinessMap.get(prefecture2)?.get(prefecture1) ?? 0;

      score += score1to2 + score2to1;
    }
  }
  return score;
}

/**
 * Calculates the total score for a partition (sum of all group scores)
 */
export function calculatePartitionScore(
  partition: Partition,
  friendlinessMap: FriendlinessMap
): number {
  return partition.reduce((sum, group) => sum + calculateGroupScore(group, friendlinessMap), 0);
}

/**
 * Calculates the maximum potential score from remaining prefectures
 */
export function calculateMaxRemainingPotential(
  remaining: string[],
  friendlinessMap: FriendlinessMap,
  currentPartition: string[][] = []
): number {
  let maxPotential = 0;

  // PART 1: Best possible interactions between remaining prefectures
  // This assumes optimal grouping among remaining items
  for (let i = 0; i < remaining.length; i++) {
    for (let j = i + 1; j < remaining.length; j++) {
      const score1to2 = friendlinessMap.get(remaining[i])?.get(remaining[j]) ?? 0;
      const score2to1 = friendlinessMap.get(remaining[j])?.get(remaining[i]) ?? 0;
      const pairScore = score1to2 + score2to1;
      if (pairScore > 0) {
        maxPotential += pairScore;
      }
    }
  }

  // PART 2: Best possible interactions between remaining prefectures and existing groups
  // For each remaining prefecture, find the best existing group it could join
  for (const remainingPref of remaining) {
    let bestGroupBonus = 0;

    for (const group of currentPartition) {
      let groupBonus = 0;
      for (const groupMember of group) {
        const score1to2 = friendlinessMap.get(remainingPref)?.get(groupMember) ?? 0;
        const score2to1 = friendlinessMap.get(groupMember)?.get(remainingPref) ?? 0;
        groupBonus += score1to2 + score2to1;
      }
      bestGroupBonus = Math.max(bestGroupBonus, groupBonus);
    }

    // Only add positive contributions to the upper bound
    if (bestGroupBonus > 0) {
      maxPotential += bestGroupBonus;
    }
  }

  return maxPotential;
}

/**
 * Calculates incremental score when adding a prefecture to an existing group
 */
export function calculateIncrementalScore(
  prefecture: string,
  group: string[],
  friendlinessMap: FriendlinessMap
): number {
  let incrementalScore = 0;

  for (const existingMember of group) {
    const score1to2 = friendlinessMap.get(prefecture)?.get(existingMember) ?? 0;
    const score2to1 = friendlinessMap.get(existingMember)?.get(prefecture) ?? 0;
    incrementalScore += score1to2 + score2to1;
  }

  return incrementalScore;
}

/**
 * Normalizes a score based on the number of possible pairs
 */
export function normalizeScore(score: number, totalPrefectures: number): number {
  const maxPossiblePairs = (totalPrefectures * (totalPrefectures - 1)) / 2;
  return maxPossiblePairs > 0 ? score / maxPossiblePairs : 0;
}
