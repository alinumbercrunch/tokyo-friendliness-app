// Core types for partition optimization
export type Partition = string[][];
export type PartitionSet = Partition[];
export type FriendlinessMap = Map<string, Map<string, number>>;

// CSV parsing types
export type FriendlinessMatrix = Record<string, Record<string, number>>;

// Debug configuration
export interface DebugOptions {
  logPruning?: boolean;
  logMemoHits?: boolean;
  logBestUpdates?: boolean;
}

// Memoization cache type
export type MemoResult = { score: number; partition: Partition };

// Color ranking types
export type GroupColor = "gold" | "silver" | "bronze";

export interface GroupColorRanking {
  groupIndex: number;
  prefectures: string[];
  groupScore: number;
  colorRank: GroupColor;
  hexColor: string;
}

// Constants
export const DEFAULT_MAX_GROUPS = 3;
