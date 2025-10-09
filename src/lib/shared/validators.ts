/**
 * Shared validation functions for the application.
 */
import type { FriendlinessMap } from "@/lib/shared/types";

/**
 * Validates that all prefectures exist in the friendliness map
 */
export function validateFriendlinessMap(
  prefectures: string[],
  friendlinessMap: FriendlinessMap
): void {
  for (const prefecture of prefectures) {
    if (!friendlinessMap.has(prefecture)) {
      throw new Error(`Prefecture "${prefecture}" not found in friendliness map`);
    }
  }
}

/**
 * Validates input parameters for partition generation
 */
export function validatePartitionInputs(prefectures: string[], maxGroups: number): void {
  if (prefectures.length === 0) return;
  if (maxGroups < 1) throw new Error("maxGroups must be at least 1");

  // Check for duplicate prefecture names
  const uniquePrefectures = new Set(prefectures);
  if (uniquePrefectures.size !== prefectures.length) {
    throw new Error("Duplicate prefecture names detected");
  }
}
