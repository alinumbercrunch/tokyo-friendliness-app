import { loadFriendlinessMatrix } from "@/lib/parseFriendlinessCSV";
import {
  generateBestPartition,
  calculatePartitionScore,
  generatePartitions,
} from "@/lib/optimizeGroups";
import { colorTopGroupsByScore } from "@/lib/colorMap";
import type { FriendlinessMap, GroupColorRanking } from "@/lib/types";

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
export async function performOptimization(): Promise<OptimizationResult> {
  console.log("🚀 Starting optimization process...");

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
  console.log("🧪 Optimizing for prefectures:", allPrefectures);

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
    console.log("✅ SUCCESS: Algorithm found optimal solution!");
  } else {
    console.log("❌ WARNING: Algorithm may have missed optimal solution");
    console.log("Expected:", manualBestScore, "Got:", algorithmScore);
  }

  // Generate color rankings
  const colorRankings = colorTopGroupsByScore(bestPartition, friendlinessMap);

  // Log detailed breakdown
  console.log("\n📊 Best partition breakdown:");
  bestPartition.forEach((group, index) => {
    console.log(`Group ${index + 1}: [${group.join(", ")}]`);
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
