import React from 'react';
import Card from "../elements/components/cards/Cards";
import GraphTimeline from "../elements/components/GraphTimeline";
import RatioCard from "../elements/components/cards/RatioCard";
import InformationCard from "../elements/components/cards/InformationCard";
import CardGrid from "../elements/components/ProfileGrid";
import { useStudentData } from "../data/studentData";
import { ActivityGraph } from "../elements/components/cards/ActivityGraphCard";
import { useTheme } from '../contexts/ThemeContext';
import styles from '../styles/components/Card.module.css';

// React components for the profile page after loging in
function ProfilePage() {
    const { darkMode } = useTheme();
    const { loading, error, data } = useStudentData();
    
    if (loading) return <div className="loading">Loading...</div>;
    if (error) return <div className="error">Error: {error.message}</div>;
    if (!data) return <div className="no-data">No data available</div>;
    
    console.log("data: ", data);
    
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

                {/* Profile grid */}
                <CardGrid columns="4">
                    {/* Private information card */}
                    <InformationCard info={info}/>

                    {/* Ratio card */}
                    <RatioCard Given={1.4} Received={1}/>

                    {/* Activity Graph */}
                    <ActivityGraph 
                        activityMap={data.activityMap} 
                        theme={darkMode ? 'dark' : 'light'}
                    />
                </CardGrid>

                
            </div>
        </>
    );
}

export default ProfilePage;