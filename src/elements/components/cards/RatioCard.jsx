import PropTypes from "prop-types";
import styles from "../../../styles/components/RatioCard.module.css";
import { FiArrowUp, FiArrowDown } from "react-icons/fi";

function RatioCard({ Given = 0, Received = 0 }) {
  const auditRatio = Given - Received + 1;
  const isPositiveRatio = auditRatio >= 1;

  const maxValue = Math.max(Given, Received) || 1;
  const givenBarWidth = (Given / maxValue) * 100;
  const receivedBarWidth = (Received / maxValue) * 100;
  const isGivenDominant = Given >= Received;

  return (
    <div className={styles.ratioCard}>
      <h2 className={styles.title}>Audits ratio</h2>

      <div className={styles.statsContainer}>
        {/* Given Section */}
        <div className={styles.statSection}>
          <p className={styles.statLabel}>
            <strong>Done</strong>
          </p>
          <div className={styles.statRow}>
            <svg width="100%" height="6">
              {isGivenDominant ? (
                <rect width="100%" height="6" fill="#4caf50" />
              ) : (
                <rect width={`${givenBarWidth}%`} height="6" fill="var(--color-text)" />
              )}
            </svg>
            <p className={styles.statValue}>
              {Given} MB <FiArrowUp className={styles.arrowUp} />
            </p>
          </div>
        </div>

        {/* Received Section */}
        <div className={styles.statSection}>
          <p className={styles.statLabel}>
            <strong>Received</strong>
          </p>
          <div className={styles.statRow}>
            <svg width="100%" height="6">
              {!isGivenDominant ? (
                <rect width="100%" height="6" fill="#f44336" />
              ) : (
                <rect width={`${receivedBarWidth}%`} height="6" fill="var(--color-text)" />
              )}
            </svg>
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
