import Card from "../elements/components/cards/Cards";
import styles from '../styles/components/Card.module.css'

function ProfilePage() {
    return (
        <>
            <div className={styles.container}>
                <Card Name="Piscine GO" Number="#303" Start="2024-02-26" End="2024-03-23"/>
                <Card Name="Cursus" Number="#303" Start="2024-02-26" End="2024-03-23"/>
                <Card Name="Cursus" Number="#303" Start="2024-02-26" End="2024-03-23"/>
            </div>
        </>
    );
}

export default ProfilePage;