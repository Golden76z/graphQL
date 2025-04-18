import React from 'react';
import styles from '../../../styles/components/GraphXP.module.css';

const GraphXP = ({ transactions }) => {
  if (!transactions || transactions.length === 0) {
    return <div className={styles.noData}>No XP data available</div>;
  }

  const xpData = transactions.map(tx => ({
    date: new Date(tx.createdAt),
    xp: tx.amount,
  }));

  const maxXP = Math.max(...xpData.map(item => item.xp));
  const svgHeight = 200;
  const svgWidth = 500;

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>XP Progression Over Time</h3>
      <svg width={svgWidth} height={svgHeight} className={styles.graph}>
        {/* Axes */}
        <line x1="0" y1={svgHeight - 20} x2={svgWidth} y2={svgHeight - 20} className={styles.axis} />
        <line x1="40" y1="0" x2="40" y2={svgHeight - 20} className={styles.axis} />

        {/* Data Points */}
        {xpData.map((point, index) => {
          const x = 40 + (index / (xpData.length - 1)) * (svgWidth - 40);
          const y = svgHeight - 20 - (point.xp / maxXP) * (svgHeight - 40);
          return <circle key={index} cx={x} cy={y} r="5" className={styles.dataPoint} />;
        })}

        {/* Line Connecting Points */}
        <polyline
          points={xpData
            .map((point, index) => {
              const x = 40 + (index / (xpData.length - 1)) * (svgWidth - 40);
              const y = svgHeight - 20 - (point.xp / maxXP) * (svgHeight - 40);
              return `${x},${y}`;
            })
            .join(' ')}
          className={styles.dataLine}
        />
      </svg>
    </div>
  );
};

export default GraphXP;
