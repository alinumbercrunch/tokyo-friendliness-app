import type { GroupColorRanking } from "@/lib/types";
import styles from "./ColorLegend.module.css";

interface ColorLegendProps {
  colorRankings: GroupColorRanking[];
  title?: string;
}

export default function ColorLegend({ colorRankings, title = "Group Rankings" }: ColorLegendProps) {
  return (
    <div className={styles.colorLegend}>
      <h3 className={styles.title}>{title}</h3>
      <div className={styles.legendItems}>
        {colorRankings.map((ranking) => (
          <div key={ranking.groupIndex} className={styles.legendItem}>
            <div
              className={styles.colorSwatch}
              style={{ "--color": ranking.hexColor } as React.CSSProperties}
            />
            <div className={styles.groupInfo}>
              <span className={styles.medal}>
                {ranking.colorRank === "gold" && "🥇"}
                {ranking.colorRank === "silver" && "🥈"}
                {ranking.colorRank === "bronze" && "🥉"}
              </span>
              <span className={styles.groupName}>Group {ranking.groupIndex + 1}</span>
              <span className={styles.prefectures}>({ranking.prefectures.join(", ")})</span>
              {ranking.groupScore > 0 && (
                <span className={styles.score}>Score: {ranking.groupScore}</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
