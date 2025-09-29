import React from "react";
import styles from "./ColorLegend.module.css";

const groups = [
  { className: styles.colorBlue, label: "グループ1 (青)" },
  { className: styles.colorGreen, label: "グループ2 (緑)" },
  { className: styles.colorOrange, label: "グループ3 (オレンジ)" },
];

export default function ColorLegend() {
  return (
    <div className={styles.legendContainer}>
      <span className={styles.legendTitle}>グループの色分け:</span>
      <ul className={styles.legendList}>
        {groups.map((g, i) => (
          <li key={i} className={styles.legendItem}>
            <span className={`${styles.colorBox} ${g.className}`} />
            <span className={styles.label}>{g.label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
