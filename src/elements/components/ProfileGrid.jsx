// CardGrid.jsx
import styles from '../../styles/responsiveness/ProfileGrid.module.css';

// In your CardGrid.jsx
const CardGrid = ({children}) => {
    return (
    <div className={styles.cardGrid}>
        {children}
    </div>
    );
};

export default CardGrid;