import styles from '../../../styles/components/Card.module.css';
import PropTypes from 'prop-types';

// React card element for cursus informations
function Card({Name = "Default", Number = "#0", Cursus = "", Start = "", End = ""}) {
    return (
        <div className={styles.card_container}>
            <div className={styles.card}>
                <h2 className={styles.card_title}>{Name} {Number}</h2>
                {Cursus.length > 0 && <p className={styles.card_cursus}>in Cursus {Cursus}</p>}
                <p className={styles.card_time}>{Start} {">"} {End}</p>
            </div>
        </div>
    );
}

// Defining the type of variables we take on card elements
Card.PropTypes = {
    Name:   PropTypes.string,
    Number: PropTypes.string,
    Cursus: PropTypes.string,
    Start:  PropTypes.string,
    End:    PropTypes.string,
}

export default Card;