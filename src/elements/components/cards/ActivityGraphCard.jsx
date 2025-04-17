import React from 'react';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import styles from '../../../styles/components/ActivityGraph.module.css'; // Create this CSS module

const getActivityColor = (count, theme) => {
    // Make empty squares visibly different from background
    if (count === 0) return theme === 'dark' ? '#2d333b' : '#f0f0f0';
    
    if (theme === 'dark') {
    if (count < 3) return '#0e4429';
    if (count < 5) return '#006d32';
    if (count < 8) return '#26a641';
    return '#39d353';
    } else {
    if (count < 3) return '#9be9a8';
    if (count < 5) return '#40c463';
    if (count < 8) return '#30a14e';
    return '#216e39';
    }
};

const groupByWeek = (activityData) => {
    const weeks = [];
    let currentWeek = [];
    
    activityData.forEach((day, index) => {
    const date = new Date(day.date);
    if (date.getDay() === 0 || index === 0) {
        if (currentWeek.length > 0) weeks.push(currentWeek);
        currentWeek = [];
    }
    currentWeek.push(day);
    });
    
    if (currentWeek.length > 0) weeks.push(currentWeek);
    return weeks;
};

export const ActivityGraph = ({ activityMap, theme = 'light' }) => {
    if (!activityMap || activityMap.length === 0) {
    return <div className={styles.noData}>No activity data available</div>;
    }

    const weeks = groupByWeek(activityMap);

    return (
    <div className={styles.activityGraph}>
        <h3 className={styles.title}>XP Activity (Last 12 Months)</h3>
        <div className={styles.graphContainer}>
        <div className={styles.weekLabels}>
            {['Mon', 'Wed', 'Fri'].map(day => (
            <div key={day} className={styles.weekLabel}>{day}</div>
            ))}
        </div>
        <div className={styles.weeksContainer}>
            {weeks.map((week, weekIndex) => (
            <div key={weekIndex} className={styles.week}>
                {week.map((day, dayIndex) => (
                <div 
                    key={`${weekIndex}-${dayIndex}`}
                    className={styles.day}
                    style={{ 
                    backgroundColor: getActivityColor(day.count, theme),
                    }}
                    data-tooltip-id="activity-tooltip"
                    data-tooltip-content={day.count > 0 
                    ? `${day.count} activities on ${day.date}`
                    : `No activity on ${day.date}`}
                />
                ))}
            </div>
            ))}
        </div>
        </div>
        <ReactTooltip 
        id="activity-tooltip" 
        className="tooltip"
        place="top"
        effect="solid"
        />
    </div>
    );
};