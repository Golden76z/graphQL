import PropTypes from "prop-types";
import styles from "../../../styles/components/RatioCard.module.css";
import { FiArrowUp, FiArrowDown } from "react-icons/fi";

function RatioCard({ Given = 0, Received = 0 }) {
  // Calculate ratio and determine status
  const auditRatio = Given - Received + 1;
  const isPositiveRatio = auditRatio >= 1;
  
  // Calculate percentages for visual indicators
  const givenPercentage = Given / Math.max(Given, Received) * 100;
  const receivedPercentage = Received / Math.max(Given, Received) * 100;

  return (
    <div className={styles.ratioCard}>
      <h2 className={styles.title}>Audits ratio</h2>
      
      <div className={styles.statsContainer}>
        {/* Given section */}
        <div className={styles.statSection}>
          <p className={styles.statLabel}>
            <strong>Done</strong>
          </p>
          <div className={styles.statRow}>
            <div className={styles.barContainer}>
              <div 
                className={`${styles.bar} ${isPositiveRatio ? styles.positive : styles.negative}`}
                style={{ width: `${givenPercentage}%` }}
              />
            </div>
            <p className={styles.statValue}>
              {Given} MB <FiArrowUp className={styles.arrowUp} />
            </p>
          </div>
        </div>
        
        {/* Received section */}
        <div className={styles.statSection}>
          <p className={styles.statLabel}>
            <strong>Received</strong>
          </p>
          <div className={styles.statRow}>
            <div className={styles.barContainer}>
              <div 
                className={`${styles.bar} ${isPositiveRatio ? styles.negative : styles.positive}`}
                style={{ width: `${receivedPercentage}%` }}
              />
            </div>
            <p className={styles.statValue}>
              {Received} MB <FiArrowDown className={styles.arrowDown} />
            </p>
          </div>
        </div>
      </div>
      
      <div className={styles.resultContainer}>
        <h1 className={`${styles.ratio} ${isPositiveRatio ? styles.positive : styles.negative}`}>
          {auditRatio.toFixed(1)}
        </h1>
        <h2 className={`${styles.ratioText} ${isPositiveRatio ? styles.positive : styles.negative}`}>
          {isPositiveRatio ? "Almost perfect" : "Needs improvement"}
        </h2>
      </div>
    </div>
  );
}

RatioCard.propTypes = {
  Given: PropTypes.number,
  Received: PropTypes.number,
};

export default RatioCard;