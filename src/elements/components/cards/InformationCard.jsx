import PropTypes from "prop-types";
import styles from "../../../styles/components/InformationCard.module.css"; // Import the CSS Module

// React component for the private information card
function InformationCard({ info = {} }) {
    const firstLetter = info.firstName ? info.firstName.charAt(0) : ''; // Get first letter of firstName

    return (
        <div className={styles.card}> {/* Apply the CSS class */}
            <div className={styles.avatar}>{firstLetter}</div> {/* Avatar with first letter */}
            
            <p>{info.firstName} {info.lastName}</p>
            <p>#{info.login}</p>

            <div className={styles['info-label']}>
                <p>Gender:</p>
                <span>{info.gender}</span>
            </div>

            <div className={styles['info-label']}>
                <p>Phone number:</p>
                <span>{info.phoneNumber}</span>
            </div>

            <div className={styles['info-label']}>
                <p>Date of birth:</p>
                <span>{info.dateOfBirth}</span>
            </div>

            <div className={styles['info-label']}>
                <p>City:</p>
                <span>{info.addressCity} - {info.addressPostalCode}</span>
            </div>

            <div className={styles['info-label']}>
                <p>Country:</p>
                <span>{info.country}</span>
            </div>
        </div>
    );
}

// PropTypes for the InformationCard
InformationCard.propTypes = {
    info: PropTypes.object,
};

export default InformationCard;
