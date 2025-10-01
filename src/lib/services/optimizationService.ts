import { loadFriendlinessMatrix } from "@/lib/data/parseFriendlinessCSV";
import {
  generateBestPartition,
  calculatePartitionScore,
  generatePartitions,
} from "@/lib/algorithm/optimizeGroups";
import { colorTopGroupsByScore } from "@/lib/ui/colorMap";
import type { FriendlinessMap, GroupColorRanking } from "@/lib/shared/types";

export interface OptimizationResult {
  bestPartition: string[][];
  totalScore: number;
  colorRankings: GroupColorRanking[];
  isOptimal: boolean;
  validationDetails: {
    algorithmScore: number;
    manualBestScore: number;
    totalPartitions: number;
  };
}

/**
 * Server-side function to perform heavy optimization calculations
 */
import { logger } from "@/lib/shared/logger";

export async function performOptimization(): Promise<OptimizationResult> {
  logger.info("Starting optimization process");

  // Load and process data
  const matrix = await loadFriendlinessMatrix();
  const friendlinessMap: FriendlinessMap = new Map();

  for (const [fromPrefecture, scores] of Object.entries(matrix)) {
    const innerMap = new Map<string, number>();
    for (const [toPrefecture, score] of Object.entries(scores)) {
      innerMap.set(toPrefecture, score);
    }
    friendlinessMap.set(fromPrefecture, innerMap);
  }

  const allPrefectures = Object.keys(matrix);
  logger.info("Optimizing for prefectures", { prefectures: allPrefectures });

  // Run optimization algorithm
  const bestPartition = generateBestPartition(allPrefectures, friendlinessMap, 3, {
    logBestUpdates: true,
    logPruning: false, // Reduce console noise
    logMemoHits: false,
  });

  // Calculate scores and validate
  const algorithmScore = calculatePartitionScore(bestPartition, friendlinessMap);

  // Validation: Find actual best via brute force
  const allPartitions = generatePartitions(allPrefectures, 3);
  let manualBestScore = -Infinity;

  for (const partition of allPartitions) {
    const score = calculatePartitionScore(partition, friendlinessMap);
    if (score > manualBestScore) {
      manualBestScore = score;
    }
  }

  const isOptimal = algorithmScore === manualBestScore;

  if (isOptimal) {
    logger.info("SUCCESS: Algorithm found optimal solution!");
  } else {
    logger.error("WARNING: Algorithm may have missed optimal solution", {
      expected: manualBestScore,
      actual: algorithmScore,
    });
  }

  // Generate color rankings
  const colorRankings = colorTopGroupsByScore(bestPartition, friendlinessMap);

  // Log detailed breakdown
  logger.info("Best partition breakdown", {
    partitions: bestPartition.map((group, index) => ({
      groupNumber: index + 1,
      prefectures: group,
    })),
  });

  return {
    bestPartition,
    totalScore: algorithmScore,
    colorRankings,
    isOptimal,
    validationDetails: {
      algorithmScore,
      manualBestScore,
      totalPartitions: allPartitions.length,
    },
  };
}
