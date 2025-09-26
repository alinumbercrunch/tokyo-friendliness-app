import Image from "next/image";
import styles from "./page.module.css";

import { loadFriendlinessMatrix } from "../lib/parseFriendlinessCSV";
import { generateBestPartition } from "../lib/optimizeGroups";
import type { FriendlinessMap } from "../lib/types";

export default async function Home() {
  // TEMP: Test CSV parsing and optimization
  console.log("🚀 Testing CSV parsing and optimization...");

  const matrix = await loadFriendlinessMatrix();

  // Convert matrix to Map for optimizer
  const friendlinessMap: FriendlinessMap = new Map();
  for (const [fromPrefecture, scores] of Object.entries(matrix)) {
    const innerMap = new Map<string, number>();
    for (const [toPrefecture, score] of Object.entries(scores)) {
      innerMap.set(toPrefecture, score);
    }
    friendlinessMap.set(fromPrefecture, innerMap);
  }

  // Test with first 5 prefectures for quick results
  const allPrefectures = Object.keys(matrix);
  const testPrefectures = allPrefectures.slice(0, 5);

  console.log("🧪 Testing optimization with:", testPrefectures);

  // Add more detailed debugging
  const bestPartition = generateBestPartition(testPrefectures, friendlinessMap, 3, {
    logBestUpdates: true,
    logPruning: true,
    logMemoHits: true,
  });

  console.log("🏆 Best partition found:", bestPartition);

  // VALIDATION: Let's manually verify this is actually the best
  console.log("\n🔍 VALIDATION - Manual verification:");

  // Generate ALL possible partitions for comparison
  const { generatePartitions, calculatePartitionScore } = await import("../lib/optimizeGroups");
  const allPartitions = generatePartitions(testPrefectures, 3);

  console.log(`📝 Total possible partitions: ${allPartitions.length}`);

  // Calculate score for each partition and find the best
  let manualBestScore = -Infinity;
  let manualBestPartition: string[][] = [];

  for (const partition of allPartitions) {
    const score = calculatePartitionScore(partition, friendlinessMap);
    if (score > manualBestScore) {
      manualBestScore = score;
      manualBestPartition = partition;
    }
  }

  console.log("🔍 Manual best partition:", manualBestPartition);
  console.log("🔍 Manual best score:", manualBestScore);

  // Compare results
  const algorithmScore = calculatePartitionScore(bestPartition, friendlinessMap);
  console.log("🤖 Algorithm score:", algorithmScore);

  if (algorithmScore === manualBestScore) {
    console.log("✅ SUCCESS: Algorithm found the optimal solution!");
  } else {
    console.log("❌ ERROR: Algorithm missed the optimal solution!");
    console.log("Expected:", manualBestScore, "Got:", algorithmScore);

    // DEBUG: Show the actual optimal partition details
    console.log("\n🐛 DEBUGGING - What the algorithm should have found:");
    manualBestPartition.forEach((group, index) => {
      console.log(`Optimal Group ${index + 1}: [${group.join(", ")}]`);
      let groupScore = 0;
      for (let i = 0; i < group.length; i++) {
        for (let j = i + 1; j < group.length; j++) {
          const score1to2 = friendlinessMap.get(group[i])?.get(group[j]) ?? 0;
          const score2to1 = friendlinessMap.get(group[j])?.get(group[i]) ?? 0;
          const pairScore = score1to2 + score2to1;
          groupScore += pairScore;
          console.log(`    ${group[i]} ↔ ${group[j]}: ${pairScore} (${score1to2} + ${score2to1})`);
        }
      }
      console.log(`    Optimal Group ${index + 1} total: ${groupScore}`);
    });

    // Show top 5 best partitions for comparison
    console.log("\n🏆 Top 5 best partitions found by brute force:");
    const scoredPartitions = allPartitions
      .map((partition) => ({
        partition,
        score: calculatePartitionScore(partition, friendlinessMap),
      }))
      .sort((a, b) => b.score - a.score);

    for (let i = 0; i < Math.min(5, scoredPartitions.length); i++) {
      console.log(`${i + 1}. Score ${scoredPartitions[i].score}:`, scoredPartitions[i].partition);
    }
  }

  // Show detailed breakdown of best partition
  console.log("\n📊 Best partition breakdown:");
  bestPartition.forEach((group, index) => {
    console.log(`Group ${index + 1}: [${group.join(", ")}]`);
    let groupScore = 0;
    for (let i = 0; i < group.length; i++) {
      for (let j = i + 1; j < group.length; j++) {
        const score1to2 = friendlinessMap.get(group[i])?.get(group[j]) ?? 0;
        const score2to1 = friendlinessMap.get(group[j])?.get(group[i]) ?? 0;
        const pairScore = score1to2 + score2to1;
        groupScore += pairScore;
        console.log(`  ${group[i]} ↔ ${group[j]}: ${pairScore} (${score1to2} + ${score2to1})`);
      }
    }
    console.log(`  Group ${index + 1} total: ${groupScore}`);
  });
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <Image
          className={styles.logo}
          src="/next.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />
        <ol>
          <li>
            Get started by editing <code>src/app/page.tsx</code>.
          </li>
          <li>Save and see your changes instantly.</li>
        </ol>

        <div className={styles.ctas}>
          <a
            className={styles.primary}
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              className={styles.logo}
              src="/vercel.svg"
              alt="Vercel logomark"
              width={20}
              height={20}
            />
            Deploy now
          </a>
          <a
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.secondary}
          >
            Read our docs
          </a>
        </div>
      </main>
      <footer className={styles.footer}>
        <a
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image aria-hidden src="/file.svg" alt="File icon" width={16} height={16} />
          Learn
        </a>
        <a
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image aria-hidden src="/window.svg" alt="Window icon" width={16} height={16} />
          Examples
        </a>
        <a
          href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image aria-hidden src="/globe.svg" alt="Globe icon" width={16} height={16} />
          Go to nextjs.org →
        </a>
      </footer>
    </div>
  );
}
