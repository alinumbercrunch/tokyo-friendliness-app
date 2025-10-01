import type { GroupColor, GroupColorRanking, Partition, FriendlinessMap } from "@/lib/types";

// Fixed group colors
const GROUP_COLORS: Record<GroupColor, string> = {
  gold: "#2196f3", // Group 1 - Blue
  silver: "#43a047", // Group 2 - Green
  bronze: "#ff9800", // Group 3 - Orange
} as const;

/**
 * Calculate score for each group in the partition
 */
function calculateGroupScores(partition: Partition, friendlinessMap: FriendlinessMap): number[] {
  return partition.map((group) => {
    // Calculate internal friendliness within this group
    let groupScore = 0;
    for (let i = 0; i < group.length; i++) {
      for (let j = i + 1; j < group.length; j++) {
        const scoreAB = friendlinessMap.get(group[i])?.get(group[j]) || 0;
        const scoreBA = friendlinessMap.get(group[j])?.get(group[i]) || 0;
        groupScore += scoreAB + scoreBA;
      }
    }
    return groupScore;
  });
}

/**
 * Simply assign colors to the already-optimized groups
 * No need to recalculate - the partition is already optimal
 */
export function colorTopGroups(partition: Partition): GroupColorRanking[] {
  const colors: GroupColor[] = ["gold", "silver", "bronze"];

  return partition.slice(0, 3).map((group, index) => {
    const colorRank = colors[index];
    return {
      groupIndex: index,
      prefectures: group,
      groupScore: 0, // Will be calculated separately if needed
      colorRank,
      hexColor: GROUP_COLORS[colorRank],
    };
  });
}

/**
 * Advanced version: Color groups based on their actual scores
 * (highest scoring group gets gold)
 */
export function colorTopGroupsByScore(
  partition: Partition,
  friendlinessMap: FriendlinessMap
): GroupColorRanking[] {
  const groupScores = calculateGroupScores(partition, friendlinessMap);

  // Create group rankings with scores
  const groupRankings = partition.map((group, index) => ({
    groupIndex: index,
    prefectures: group,
    groupScore: groupScores[index],
  }));

  // Sort by score (highest first) and assign colors
  groupRankings.sort((a, b) => b.groupScore - a.groupScore);

  const colors: GroupColor[] = ["gold", "silver", "bronze"];

  return groupRankings.map((group, rankIndex) => {
    const colorRank = colors[rankIndex] || "bronze";
    return {
      groupIndex: group.groupIndex,
      prefectures: group.prefectures,
      groupScore: group.groupScore,
      colorRank,
      hexColor: GROUP_COLORS[colorRank],
    };
  });
}

/**
 * Get hex color for a group index (0-based)
 */
export function getColorForGroup(groupIndex: number): string {
  const colors: GroupColor[] = ["gold", "silver", "bronze"];
  const colorRank = colors[groupIndex] || "bronze";
  return GROUP_COLORS[colorRank];
}
