import React, { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { gql } from '@apollo/client';
import { Tooltip as ReactTooltip } from 'react-tooltip';

const FULL_STUDENT_STATS_QUERY = gql`
  query FullStudentStatsWithCompleteObjects {
    user {
      id
      login
      attrs
      auditRatio
      totalUp
      totalDown
      avatarUrl
      campus
      createdAt
      updatedAt
      
      public {
        firstName
        lastName
        profile
      }
      
      groups {
        id
        createdAt
        updatedAt
        group {
          id
          objectId
          eventId
          status
          path
          campus
          createdAt
          updatedAt
          captainId
          object {
            id
            name
            type
            attrs
          }
          event {
            id
            path
            createdAt
            endAt
          }
          members {
            user {
              id
              login
              avatarUrl
            }
          }
        }
      }
      
      events {
        id
        createdAt
        event {
          id
          createdAt
          endAt
          path
          object {
            id
            name
            type
            attrs
          }
          registrations {
            id
            startAt
            endAt
          }
        }
      }
      
      transactions(
        where: {type: {_eq: "xp"}}
        order_by: {createdAt: asc}
      ) {
        id
        type
        amount
        createdAt
        path
        campus
        object {
          id
          name
          type
          attrs
          parent: childrenRelation {
            parent {
              id
              name
              type
            }
          }
        }
        event {
          id
          path
        }
      }
      
      transactions_aggregate(where: {type: {_eq: "xp"}}) {
        aggregate {
          sum { amount }
          avg { amount }
          max { amount }
          count
        }
      }
      
      progresses(
        where: {isDone: {_eq: true}}
        order_by: {updatedAt: desc}
      ) {
        id
        grade
        createdAt
        updatedAt
        path
        version
        campus
        object {
          id
          name
          type
          attrs(path: "$")
          parent: childrenRelation {
            parent {
              id
              name
              type
            }
          }
        }
        group {
          id
          status
        }
        event {
          id
          path
        }
      }
      
      progresses_aggregate(where: {isDone: {_eq: true}}) {
        aggregate {
          count
          avg { grade }
          max { grade }
        }
      }
      
      audits {
        id
        grade
        createdAt
        updatedAt
        version
        group {
          id
          object {
            id
            name
            type
            attrs(path: "$.auditRequirements")
          }
        }
        auditor {
          id
          login
          avatarUrl
        }
      }
      
      audits_as_auditor: audits(where: {auditorId: {_eq: 3611}}) {
        id
        grade
        createdAt
        updatedAt
        group {
          id
          object {
            id
            name
            type
          }
          members {
            user {
              id
              login
            }
          }
        }
      }
      
      audits_aggregate {
        aggregate {
          count
          sum { grade }
          avg { grade }
        }
      }
      
      results(
        order_by: [{updatedAt: desc}, {createdAt: desc}]
      ) {
        id
        grade
        type
        isLast
        createdAt
        updatedAt
        path
        version
        campus
        object {
          id
          name
          type
          attrs
          parent: childrenRelation {
            parent {
              id
              name
              type
            }
          }
        }
        group {
          id
          status
        }
        event {
          id
          path
        }
      }
      
      registrations {
        id
        createdAt
        registration {
          id
          startAt
          endAt
          object {
            id
            name
            type
            attrs
          }
          event {
            id
            path
          }
        }
      }
      
      matches {
        id
        createdAt
        updatedAt
        confirmed
        bet
        result
        path
        campus
        object {
          id
          name
          type
        }
        match_user: user {
          id
          login
        }
        event {
          id
          path
        }
      }
      
      user_roles {
        id
        role {
          id
          slug
          name
          description
        }
      }
      
      records {
        id
        message
        createdAt
        author {
          id
          login
        }
      }
      
      transactions_up: transactions(
        where: {type: {_eq: "up"}}
        order_by: {createdAt: desc}
      ) {
        id
        amount
        createdAt
        object {
          id
          name
        }
        relatedUser: user {
          id
          login
        }
      }
    }
  }
`;

const StudentStatsComponent = () => {
  const { loading, error, data } = useQuery(FULL_STUDENT_STATS_QUERY);
  const [organizedData, setOrganizedData] = useState(null);
  const [activityMap, setActivityMap] = useState([]);

  useEffect(() => {
    if (data && data.user && data.user.length > 0) {
      const userData = data.user[0];
      
      // Initialize organized data structure
      const organized = {
        cursus: {
          xp: 0,
          transactions: [],
          piscineValidations: [],
          progresses: [],
          audits: [],
          results: [],
          groups: [],
          events: [],
          matches: [],
          totalUp: userData.totalUp,
          totalDown: userData.totalDown,
          auditRatio: userData.auditRatio
        },
        piscines: {}
      };

      // Process registrations to identify piscines and their dates
      if (userData.registrations) {
        userData.registrations.forEach(reg => {
          if (reg.registration?.object?.name) {
            const piscineName = reg.registration.object.name;
            if (piscineName.toLowerCase().includes('piscine')) {
              const piscineKey = piscineName.toLowerCase().replace(/\s+/g, '-');
              if (!organized.piscines[piscineKey]) {
                organized.piscines[piscineKey] = {
                  name: piscineName,
                  startAt: reg.registration.startAt,
                  endAt: reg.registration.endAt,
                  xp: 0,
                  transactions: [],
                  progresses: [],
                  audits: [],
                  results: [],
                  groups: [],
                  events: [],
                  matches: []
                };
              }
            }
          }
        });
      }

      // Helper function to check if transaction is piscine validation
      const isPiscineValidation = (transaction) => {
        return (
          transaction.object?.name?.toLowerCase().includes('piscine-validation') ||
          transaction.path?.toLowerCase().includes('piscine-validation')
        );
      };

      // Helper function to find piscine by path or object
      const findPiscineForPathOrObject = (piscines, path, object) => {
        if (object?.name) {
          for (const [key, piscine] of Object.entries(piscines)) {
            if (object.name.toLowerCase().includes(piscine.name.toLowerCase())) {
              return key;
            }
          }
        }
        
        if (path) {
          for (const [key, piscine] of Object.entries(piscines)) {
            const piscinePathSegment = piscine.name.toLowerCase().replace('piscine', '').trim();
            if (path.toLowerCase().includes(`piscine-${piscinePathSegment}`)) {
              return key;
            }
          }
        }
        
        return null;
      };

      // Process transactions
      if (userData.transactions) {
        userData.transactions.forEach(transaction => {
          if (isPiscineValidation(transaction)) {
            organized.cursus.xp += transaction.amount;
            organized.cursus.piscineValidations.push(transaction);
          } else {
            const piscineMatch = findPiscineForPathOrObject(
              organized.piscines,
              transaction.path,
              transaction.object
            );
            
            if (piscineMatch) {
              organized.piscines[piscineMatch].xp += transaction.amount;
              organized.piscines[piscineMatch].transactions.push(transaction);
            } else {
              organized.cursus.xp += transaction.amount;
              organized.cursus.transactions.push(transaction);
            }
          }
        });
      }

      // Create activity map from transactions
      const activityData = {};
      const now = new Date();
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

      // Initialize empty activity map
      for (let d = new Date(sixMonthsAgo); d <= now; d.setDate(d.getDate() + 1)) {
        const dateStr = d.toISOString().split('T')[0];
        activityData[dateStr] = 0;
      }

      // Count transactions per day
      userData.transactions.forEach(tx => {
        if (tx.createdAt) {
          const dateStr = tx.createdAt.split('T')[0];
          if (activityData[dateStr] !== undefined) {
            activityData[dateStr]++;
          }
        }
      });

      // Convert to array for rendering
      const activityArray = Object.entries(activityData).map(([date, count]) => ({
        date,
        count
      }));

      setActivityMap(activityArray);
      setOrganizedData(organized);
    }
  }, [data]);

  // Function to determine color intensity based on activity count
  const getActivityColor = (count) => {
    if (count === 0) return '#ebedf0';
    if (count < 3) return '#9be9a8';
    if (count < 5) return '#40c463';
    if (count < 8) return '#30a14e';
    return '#216e39';
  };

  // Group dates by week for display
  const groupByWeek = (activityData) => {
    const weeks = [];
    let currentWeek = [];
    
    activityData.forEach((day, index) => {
      const date = new Date(day.date);
      if (date.getDay() === 0 || index === 0) { // Sunday or first day
        if (currentWeek.length > 0) weeks.push(currentWeek);
        currentWeek = [];
      }
      currentWeek.push(day);
    });
    
    if (currentWeek.length > 0) weeks.push(currentWeek);
    return weeks;
  };

  const weeks = groupByWeek(activityMap);

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">Error: {error.message}</div>;
  if (!organizedData) return <div className="no-data">No data available</div>;

  const validationXpTotal = organizedData.cursus.piscineValidations.reduce(
    (sum, tx) => sum + tx.amount, 0
  );

  const cursusXpWithoutValidations = organizedData.cursus.xp - validationXpTotal;

  return (
    <div className="student-stats-container">
      {/* User Profile */}
      <div className="user-profile">
        <img src={data.user[0].avatarUrl} alt="Profile" className="avatar" />
        <h2>{data.user[0].public?.firstName} {data.user[0].public?.lastName}</h2>
        <p>Login: {data.user[0].login}</p>
        <p>Campus: {data.user[0].campus}</p>
        <p>Member since: {new Date(data.user[0].createdAt).toLocaleDateString()}</p>
      </div>

      {/* Cursus Stats */}
      <div className="cursus-stats">
        <h3>Cursus</h3>
        <p>Total XP: {organizedData.cursus.xp} (includes {validationXpTotal} XP from piscine validations)</p>
        <p>Base XP: {cursusXpWithoutValidations} (excluding validations)</p>
        <p>Projects Completed: {organizedData.cursus.progresses.length}</p>
        <p>Audit Ratio: {organizedData.cursus.auditRatio}</p>
        
        {validationXpTotal > 0 && (
          <div className="validation-xp">
            <h4>Piscine Validation XP</h4>
            <ul>
              {organizedData.cursus.piscineValidations.map(tx => (
                <li key={tx.id}>
                  {tx.object?.name || 'Validation'}: {tx.amount} XP
                  {tx.createdAt && (
                    <span> ({new Date(tx.createdAt).toLocaleDateString()})</span>
                  )}
                </li>
              ))}
            </ul>
            <p>Total Validation XP: {validationXpTotal}</p>
          </div>
        )}
      </div>

      {/* Piscine Stats */}
      <div className="piscine-stats">
        <h3>Piscines</h3>
        {Object.entries(organizedData.piscines).map(([key, piscine]) => (
          <div key={key} className="piscine-section">
            <h4>{piscine.name}</h4>
            {piscine.startAt && piscine.endAt && (
              <p>Dates: {new Date(piscine.startAt).toLocaleDateString()} - {new Date(piscine.endAt).toLocaleDateString()}</p>
            )}
            <p>XP (excluding validation): {piscine.xp}</p>
            <p>Projects Completed: {piscine.progresses.length}</p>
            <p>Transactions: {piscine.transactions.length}</p>
            
            <div className="piscine-details">
              <h5>Recent Activities</h5>
              <ul>
                {piscine.transactions.slice(0, 5).map(tx => (
                  <li key={tx.id}>
                    {tx.object?.name || 'Activity'}: {tx.amount} XP
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      {/* Custom Activity Graph */}
      <div className="activity-graph">
        <h3>XP Activity (Last 6 Months)</h3>
        <div className="graph-container">
          <div className="week-labels">
            {['Mon', 'Wed', 'Fri'].map(day => (
              <div key={day} className="week-label">{day}</div>
            ))}
          </div>
          <div className="weeks-container">
            {weeks.map((week, weekIndex) => (
              <div key={weekIndex} className="week">
                {week.map((day, dayIndex) => (
                  <div 
                    key={`${weekIndex}-${dayIndex}`}
                    className="day"
                    style={{ backgroundColor: getActivityColor(day.count) }}
                    data-tooltip-id="activity-tooltip"
                    data-tooltip-content={`${day.count} activities on ${day.date}`}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      <ReactTooltip id="activity-tooltip" />

      <style jsx>{`
        .student-stats-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        
        .user-profile {
          text-align: center;
          margin-bottom: 30px;
        }
        
        .avatar {
          width: 100px;
          height: 100px;
          border-radius: 50%;
          border: 3px solid #00babc;
        }
        
        .cursus-stats,
        .piscine-stats,
        .activity-graph {
          background: white;
          border-radius: 8px;
          padding: 20px;
          margin-bottom: 20px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        
        .piscine-section {
          background: #f9f9f9;
          padding: 15px;
          border-radius: 6px;
          margin-bottom: 15px;
        }
        
        .validation-xp {
          background: #f0f8ff;
          padding: 15px;
          border-radius: 6px;
          margin-top: 15px;
        }
        
        .activity-graph {
          overflow-x: auto;
        }
        
        .graph-container {
          display: flex;
          margin-top: 15px;
        }
        
        .week-labels {
          display: flex;
          flex-direction: column;
          margin-right: 5px;
          padding-top: 22px;
        }
        
        .week-label {
          height: 15px;
          font-size: 10px;
          color: #767676;
          margin-bottom: 5px;
        }
        
        .weeks-container {
          display: flex;
        }
        
        .week {
          display: flex;
          flex-direction: column;
          margin-right: 3px;
        }
        
        .day {
          width: 15px;
          height: 15px;
          margin-bottom: 3px;
          border-radius: 2px;
          cursor: pointer;
        }
        
        .day:hover {
          border: 1px solid rgba(0,0,0,0.5);
        }
        
        .loading,
        .error,
        .no-data {
          text-align: center;
          padding: 20px;
          font-size: 18px;
        }
        
        .error {
          color: #ff3333;
        }
      `}</style>
    </div>
  );
};

export default StudentStatsComponent;