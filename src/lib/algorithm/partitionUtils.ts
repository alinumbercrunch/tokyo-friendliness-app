import type { Partition, PartitionSet } from "@/lib/shared/types";

/**
 * Deep copy a partition
 */
export function deepCopy(partition: Partition): Partition {
  return partition.map((group) => [...group]);
}

/**
 * Sorts a partition for consistent output
 */
export function sortPartition(partition: Partition): Partition {
  return partition
    .map((group) => [...group].sort()) // Sort members within each group
    .sort((a, b) => a[0].localeCompare(b[0])); // Sort groups by first member
}

/**
 * Generates all valid partitions of prefectures into groups
 */
export function generateAllPartitions(prefectures: string[], maxGroups: number): PartitionSet {
  if (prefectures.length === 0) return [];

  const partitions: PartitionSet = [];

  function buildPartitions(
    remainingPrefectures: string[],
    currentPartition: Partition,
    maxGroupCount: number
  ): void {
    // Base case: all prefectures assigned
    if (remainingPrefectures.length === 0) {
      if (currentPartition.length > 0) {
        partitions.push(deepCopy(currentPartition));
      }
      return;
    }

    const [nextPrefecture, ...restPrefectures] = remainingPrefectures;

    // Add to existing groups
    for (let groupIndex = 0; groupIndex < currentPartition.length; groupIndex++) {
      currentPartition[groupIndex].push(nextPrefecture);
      buildPartitions(restPrefectures, currentPartition, maxGroupCount);
      currentPartition[groupIndex].pop(); // backtrack
    }

    // Create new group (if under limit)
    if (currentPartition.length < maxGroupCount) {
      currentPartition.push([nextPrefecture]);
      buildPartitions(restPrefectures, currentPartition, maxGroupCount);
      currentPartition.pop(); // backtrack
    }
  }

  buildPartitions(prefectures, [], maxGroups);
  return partitions;
}
