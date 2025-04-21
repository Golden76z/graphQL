import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useStudentData } from "../data/studentData";
import Card from "../elements/components/cards/Cards";
import GraphTimeline from "../elements/components/GraphTimeline";
import RatioCard from "../elements/components/cards/RatioCard";
import InformationCard from "../elements/components/cards/InformationCard";
import CardGrid from "../elements/components/ProfileGrid";
import { ActivityGraph } from "../elements/components/cards/ActivityGraphCard";
import styles from '../styles/components/Card.module.css';
import GraphXP from '../elements/components/cards/GraphXP';
import RecentXPCard from '../elements/components/cards/RecentXpCard';
import PendingAuditsCard from '../elements/components/cards/AuditCards';
import WelcomeMessage from '../elements/layout/WelcomeMessage';

function ProfilePage() {
    const { darkMode } = useTheme();
    const { loading, error, data, rawData } = useStudentData();

    // Handle loading, error and no data states
    if (loading) return <div className="loading">Loading...</div>;
    if (error) return <div className="error">Error: {error.message}</div>;
    if (!data) return <div className="no-data">No data available</div>;

    // Format date function
    const formatDate = (dateString) => {
      if (!dateString) return "Unknown";
      return new Date(dateString).toLocaleDateString();
    };

    // Create cards for XP display
    const xpCards = [];
    
    // Always add Total XP card
    // const totalXp = data.cursus.xp + Object.values(data.piscines).reduce((sum, piscine) => sum + piscine.xp, 0);
    // xpCards.push(
    //     <Card key="total" Name="Total XP" Number={totalXp.toLocaleString()} />
    // );
    
    // Add Cursus XP including validations
    const cursusXp = data.cursus.xp + data.cursus.piscineValidations.reduce((sum, val) => sum + val.amount, 0);
    xpCards.push(
        <Card key="cursus" Name="Cursus" Number={cursusXp.toLocaleString()} />
    );
    
    // Add cards for each piscine
    Object.entries(data.piscines).forEach(([key, piscine]) => {
        // Format dates if available
        let dateInfo = "";
        if (piscine.startAt && piscine.endAt) {
            dateInfo = ` (${formatDate(piscine.startAt)} - ${formatDate(piscine.endAt)})`;
        }
        
        xpCards.push(
            <Card 
                key={key} 
                Name={`${piscine.name}`} 
                Number={piscine.xp.toLocaleString()} 
            />
        );
    });

    // Format piscines for GraphTimeline
    const timelinePiscines = Object.entries(data.piscines).map(([key, piscine]) => ({
        id: key,
        name: piscine.name,
        startDate: formatDate(piscine.startAt),
        endDate: formatDate(piscine.endAt),
        xp: piscine.xp
    }));

    return (
        <>
        <WelcomeMessage username={rawData?.user?.[0]?.public?.firstName + " " + rawData?.user?.[0]?.public?.lastName}/>
        <div className={styles.container}>
            {/* Display all XP cards */}
            {xpCards}

            <GraphTimeline 
                Cursus="Piscine" 
                piscines={timelinePiscines}
                showAlternateTimelineText={true} 
            />

            <CardGrid columns="4">
                <InformationCard info={{
                    firstName: rawData?.user?.[0]?.public?.firstName || "Unknown",
                    lastName: rawData?.user?.[0]?.public?.lastName || "Unknown",
                    login: rawData?.user?.[0]?.login || "dprouet",
                    gender: rawData?.user?.[0]?.attrs?.gender || "",
                    dateOfBirth: rawData?.user?.[0]?.attrs?.dateOfBirth || "",
                    addressCity: rawData?.user?.[0]?.attrs?.addressCity || "",
                    addressCountry: rawData?.user?.[0]?.attrs?.addressCountry || "",
                    campus: rawData?.user?.[0]?.campus || "rouen",
                    memberSince: rawData?.user?.[0]?.createdAt 
                        ? formatDate(rawData.user[0].createdAt)
                        : "Unknown",
                    avatarUrl: rawData?.user?.[0]?.avatarUrl || "",
                    email: rawData?.user?.[0]?.attrs?.email || "",
                    phoneNumber: rawData?.user?.[0]?.attrs?.Phone || "",
                    location: rawData?.user?.[0]?.attrs?.addressCity || "",
                }}/>
                <RatioCard 
                    Given={(data.cursus.totalUp/1000000).toFixed(2)} 
                    Received={(data.cursus.totalDown/1000000).toFixed(2)}
                    Ratio={data.cursus.auditRatio}
                />
                <GraphXP transactions={data.cursus.transactions} />
                <RecentXPCard transactions={data.cursus.transactions} limit={20} />
                <PendingAuditsCard audits={data?.cursus?.audits || []} />
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