// CardGrid.jsx
import styles from '../../styles/responsiveness/ProfileGrid.module.css';

const CardGrid = ({ children, columns = 'auto-fill', minColumnWidth = '300px'}) => {
  return (
    <div 
      className={styles.cardGrid}
      style={{
        '--grid-columns': columns,
        '--grid-min-width': minColumnWidth
      }}
    >
      {children}
    </div>
  );
};

export default CardGrid;