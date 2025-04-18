import React, { useMemo } from 'react';
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
    
    const processedData = useMemo(() => {
        if (!data) return null;
        
        // User basic information
        const userInfo = {
            firstName: rawData?.user?.[0]?.public?.firstName || "Unknown",
            lastName: rawData?.user?.[0]?.public?.lastName || "Unknown",
            login: rawData?.user?.[0]?.login || "dprouet",
            gender: rawData?.user?.[0]?.attrs?.gender || "",
            dateOfBirth: rawData?.user?.[0]?.attrs?.dateOfBirth || "",
            addressCity: rawData?.user?.[0]?.attrs?.addressCity || "",
            addressCountry: rawData?.user?.[0]?.attrs?.addressCountry || "",
            campus: rawData?.user?.[0]?.campus || "rouen",
            memberSince: rawData?.user?.[0]?.createdAt 
                ? new Date(rawData.user[0].createdAt).toLocaleDateString() 
                : "Unknown",
            avatarUrl: rawData?.user?.[0]?.avatarUrl || "",
            email: rawData?.user?.[0]?.attrs?.email || "",
            phoneNumber: rawData?.user?.[0]?.attrs?.Phone || "",
            location: rawData?.user?.[0]?.attrs?.addressCity || "",
        };

        // Calculate XP metrics
        const totalXP = data.cursus.xp;
        const piscineXP = Object.values(data.piscines).reduce((sum, piscine) => sum + piscine.xp, 0);
        const cursusXP = totalXP - piscineXP;
        
        // Get validation XP
        const validationXpTotal = data.cursus.piscineValidations.reduce(
            (sum, tx) => sum + tx.amount, 0
        );
        
        // Audit metrics
        const auditRatio = data.cursus.auditRatio;
        const auditData = {
            given: data.cursus.totalUp || 0,
            received: data.cursus.totalDown || 0,
            ratio: auditRatio
        };
        
        // Extract registrations
        const registrations = rawData?.user?.[0]?.registrations || [];
        
        // Map registrations to XP data - this will need to be adjusted based on your actual data structure
        const registrationXPMap = registrations.map(reg => {
            const regName = reg.event?.name || reg.path?.name || "Unknown";
            const isPiscine = regName.toLowerCase().includes("piscine");
            const piscineData = isPiscine ? 
                Object.values(data.piscines).find(p => p.name.includes(regName)) : null;
            
            return {
                id: reg.id,
                name: regName,
                xp: isPiscine ? (piscineData?.xp || 0) : 
                    (regName.toLowerCase().includes("cursus") ? cursusXP : 0)
            };
        });
        
        // Piscine details
        const piscines = Object.entries(data.piscines).map(([key, piscine]) => ({
            id: key,
            name: piscine.name,
            startDate: piscine.startAt ? new Date(piscine.startAt).toLocaleDateString() : "Unknown",
            endDate: piscine.endAt ? new Date(piscine.endAt).toLocaleDateString() : "Unknown",
            xp: piscine.xp
        }));

        return {
            userInfo,
            xp: {
                total: totalXP,
                cursus: cursusXP,
                piscine: piscineXP,
                validation: validationXpTotal
            },
            audit: auditData,
            activityMap: data.activityMap,
            piscines,
            registrations: registrationXPMap
        };
    }, [data, rawData]);

    // Handle loading, error and no data states AFTER hooks
    if (loading) return <div className="loading">Loading...</div>;
    if (error) return <div className="error">Error: {error.message}</div>;
    if (!data || !processedData) return <div className="no-data">No data available</div>;

    // Always show Total XP card
    const xpCards = [
        <Card key="total" Name="Total XP" Number={processedData.xp.total.toLocaleString()} />
    ];
    
    // Add cards for each registration with XP data
    processedData.registrations.forEach(reg => {
        if (reg.xp > 0) {
            xpCards.push(
                <Card key={reg.id} Name={`${reg.name} XP`} Number={reg.xp.toLocaleString()} />
            );
        }
    });

    return (
        <>
        <WelcomeMessage username={processedData.userInfo.firstName + " " + processedData.userInfo.lastName}/>
        <div className={styles.container}>
            {/* Dynamic XP cards */}
            {xpCards}

            <GraphTimeline 
                Cursus="Piscine" 
                piscines={processedData.piscines}
                showAlternateTimelineText={true} 
            />

            <CardGrid columns="4">
                <InformationCard info={processedData.userInfo}/>
                <RatioCard 
                    Given={(processedData.audit.given/1000000).toFixed(2)} 
                    Received={(processedData.audit.received/1000000).toFixed(2)}
                    Ratio={processedData.audit.ratio}
                />
                <GraphXP transactions={data.cursus.transactions} />
                <RecentXPCard transactions={data.cursus.transactions} limit={20} />
                <PendingAuditsCard audits={data?.cursus?.audits || []} />
                <ActivityGraph 
                    activityMap={processedData.activityMap} 
                    theme={darkMode ? 'dark' : 'light'}
                />
            </CardGrid>
        </div>
        </>
    );
}

export default ProfilePage;