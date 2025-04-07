import profilePic from '../../../assets/game_over.png';
import styles from '../../../styles/components/Cards.module.css';

function Card() {
    return (
        <div className={styles.card}>
            <img className={styles.card_image} src={profilePic} alt="card picture" height={150} width={150}/>
            <h2 className={styles.card_title}>Test</h2>
            <p className={styles.card_text}>This is a test paragraph for testing purposes</p>
        </div>
    );
}

export default Card;