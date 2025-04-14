import Card from "../elements/components/cards/Cards";
import styles from '../styles/components/Card.module.css'
import GraphTimeline from "../elements/components/GraphTimeline";
// import UserStats from "../elements/graphs/UserStats";
import RatioCard from "../elements/components/cards/RatioCard";
import InformationCard from "../elements/components/cards/InformationCard";

// React components for the profile page after loging in
function ProfilePage() {
    const info = {
        firstName: "Damien",
        lastName: "Prouet",
        gender: "Homme",
        phoneNumber: "0767427468",
        dateOfBirth: "23/06/1998",
        addressCity: "Caudebec-lès-Elbeuf",
        addressPostalCode: "76320",
        country: "France",
    }

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

                {/* Ratio card */}
                <RatioCard Given={1.4} Received={1}/>

                <InformationCard info={info}/>
            </div>
        </>
    );
}

export default ProfilePage;