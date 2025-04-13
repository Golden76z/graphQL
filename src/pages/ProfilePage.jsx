import Card from "../elements/components/cards/Cards";
import styles from '../styles/components/Card.module.css'
import GraphTimeline from "../elements/components/GraphTimeline";
// import UserStats from "../elements/graphs/UserStats";
import RatioCard from "../elements/components/cards/RatioCard";

// React components for the profile page after loging in
function ProfilePage() {
    return (
        <>
            <div className={styles.container}>
                {/* Cards elements */}
                <Card Name="Piscine GO" Number="#303" Start="2024-02-26" End="2024-03-23"/>
                <Card Name="Cursus" Number="#303" Start="2024-02-26" End="2024-03-23"/>
                <Card Name="Cursus" Number="#303" Start="2024-02-26" End="2024-03-23"/>

                {/* Array with Timeline and Graph links */}
                <GraphTimeline 
                    Cursus="Piscine" 
                    showAlternateTimelineText={true} 
                />

                {/* <UserStats/> */}
                <RatioCard Given={0} Received={0}/>
            </div>
        </>
    );
}

export default ProfilePage;