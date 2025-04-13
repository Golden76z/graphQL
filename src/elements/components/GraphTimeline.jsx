import PropTypes from "prop-types";
import styles from "../../styles/components/GraphTimeline.module.css";

function GraphTimeline({
  Graph = "Graph",
  Timeline = "Timeline",
  Cursus = "Cursus",
  Number = 0,
  TimelineText = false
}) {
  return (
    <div className={styles.container}>
      {/* Graph section */}
      <div className={`${styles.item} ${styles.graph}`}>
        <div>
          <span className={styles.label}>{Graph}</span>
          <span className={styles.description}>Go back to your work where you left it last time!</span>
        </div>
        <a 
          href={`https://zone01normandie.org/intra/rouen/div-01/${Cursus}?event=${Number}`}
          className={styles.link}
        >
          Go to {Cursus}
        </a>
      </div>
      
      {/* Timeline section */}
      <div className={`${styles.item} ${styles.timeline}`}>
        <div>
          <span className={styles.label}>{Timeline}</span>
          <span className={styles.description}>
            {TimelineText
              ? "Check if you're progressing as expected!"
              : "Check the 01 Full Stack timeline!"}
          </span>
        </div>
        <a 
          href={`https://zone01normandie.org/intra/rouen/profile/timeline?event=${Cursus}`}
          className={styles.link}
        >
          View Timeline
        </a>
      </div>
    </div>
  );
}

GraphTimeline.propTypes = {
  Graph:        PropTypes.string,
  Timeline:     PropTypes.string,
  Cursus:       PropTypes.string,
  Number:       PropTypes.integer,
  TimelineText: PropTypes.bool
};

export default GraphTimeline;