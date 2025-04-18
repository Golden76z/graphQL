import React from 'react';
import styles from '../../../styles/components/GraphXP.module.css';

function formatXP(xp) {
  if (xp >= 1_000_000) return (xp / 1_000_000).toFixed(2) + 'M';
  if (xp >= 1_000) return (xp / 1_000).toFixed(2) + 'K';
  return xp.toString();
}

const GraphXP = ({ transactions }) => {
  if (!transactions || transactions.length === 0) {
    return <div className={styles.noData}>No XP data available</div>;
  }

  const xpData = transactions.map(tx => ({
    date: new Date(tx.createdAt),
    xp: tx.amount,
  }));

  const totalXP = xpData.reduce((sum, tx) => sum + tx.xp, 0);
  const maxXP = Math.max(...xpData.map(item => item.xp));

  const svgHeight = 300;
  const svgWidth = 700;
  const margin = 50;

  const yAxisSteps = 5;
  const yAxisLabels = Array.from({ length: yAxisSteps + 1 }, (_, i) => {
    const value = (maxXP / yAxisSteps) * i;
    return {
      label: formatXP(value),
      y: svgHeight - margin - (value / maxXP) * (svgHeight - 2 * margin),
    };
  });

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>XP Progression Over Time ({formatXP(totalXP)})</h3>
      <svg  viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            preserveAspectRatio="xMinYMin meet"
            className={styles.graph}>
        {/* Axes */}
        <line x1={margin} y1={svgHeight - margin} x2={svgWidth - margin} y2={svgHeight - margin} className={styles.axis} />
        <line x1={margin} y1="0" x2={margin} y2={svgHeight - margin} className={styles.axis} />

        {/* Y-axis Labels */}
        {yAxisLabels.map((tick, i) => (
          <text
            key={`y-label-${i}`}
            x={margin - 10}
            y={tick.y + 4}
            textAnchor="end"
            fontSize="10"
            className={styles.axisLabel}
          >
            {tick.label}
          </text>
        ))}

        {/* X-axis Labels every 10th */}
        {xpData.map((point, index) => {
          if (index % 10 !== 0 && index !== xpData.length - 1) return null;
          const x = margin + (index / (xpData.length - 1)) * (svgWidth - 2 * margin);
          const label = point.date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });

          return (
            <text
              key={`x-label-${index}`}
              x={x}
              y={svgHeight - margin + 15}
              textAnchor="middle"
              fontSize="10"
              className={styles.axisLabel}
            >
              {label}
            </text>
          );
        })}

        {/* Data Points */}
        {xpData.map((point, index) => {
          const x = margin + (index / (xpData.length - 1)) * (svgWidth - 2 * margin);
          const y = svgHeight - margin - (point.xp / maxXP) * (svgHeight - 2 * margin);
          return <circle key={index} cx={x} cy={y} r="4" className={styles.dataPoint} />;
        })}

        {/* Connecting line */}
        <polyline
          points={xpData
            .map((point, index) => {
              const x = margin + (index / (xpData.length - 1)) * (svgWidth - 2 * margin);
              const y = svgHeight - margin - (point.xp / maxXP) * (svgHeight - 2 * margin);
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
