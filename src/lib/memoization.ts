import type { Partition } from "@/lib/types";

/**
 * Creates a deterministic memoization key for caching
 */
export function makeMemoKey(remaining: string[], partition: Partition): string {
  const rem = remaining.slice().sort().join(",");
  const part = partition
    .map((g) => g.slice().sort().join(","))
    .sort()
    .join("|");
  return `${rem}::${part}`;
}
