import React, { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { gql } from '@apollo/client';

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
        // First check object name
        if (object?.name) {
          for (const [key, piscine] of Object.entries(piscines)) {
            if (object.name.toLowerCase().includes(piscine.name.toLowerCase())) {
              return key;
            }
          }
        }
        
        // Then check path
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
            // Count validation XP in cursus
            organized.cursus.xp += transaction.amount;
            organized.cursus.piscineValidations.push(transaction);
          } else {
            // Regular transaction processing
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

      // Process progresses
      if (userData.progresses) {
        userData.progresses.forEach(progress => {
          const piscineMatch = findPiscineForPathOrObject(
            organized.piscines,
            progress.path,
            progress.object
          );
          if (piscineMatch) {
            organized.piscines[piscineMatch].progresses.push(progress);
          } else {
            organized.cursus.progresses.push(progress);
          }
        });
      }

      // Process audits
      if (userData.audits) {
        userData.audits.forEach(audit => {
          const piscineMatch = findPiscineForPathOrObject(
            organized.piscines,
            audit.group?.path,
            audit.group?.object
          );
          if (piscineMatch) {
            organized.piscines[piscineMatch].audits.push(audit);
          } else {
            organized.cursus.audits.push(audit);
          }
        });
      }

      // Process results
      if (userData.results) {
        userData.results.forEach(result => {
          const piscineMatch = findPiscineForPathOrObject(
            organized.piscines,
            result.path,
            result.object
          );
          if (piscineMatch) {
            organized.piscines[piscineMatch].results.push(result);
          } else {
            organized.cursus.results.push(result);
          }
        });
      }

      // Process groups
      if (userData.groups) {
        userData.groups.forEach(group => {
          const piscineMatch = findPiscineForPathOrObject(
            organized.piscines,
            group.group?.path,
            group.group?.object
          );
          if (piscineMatch) {
            organized.piscines[piscineMatch].groups.push(group);
          } else {
            organized.cursus.groups.push(group);
          }
        });
      }

      // Process events
      if (userData.events) {
        userData.events.forEach(event => {
          const piscineMatch = findPiscineForPathOrObject(
            organized.piscines,
            event.event?.path,
            event.event?.object
          );
          if (piscineMatch) {
            organized.piscines[piscineMatch].events.push(event);
          } else {
            organized.cursus.events.push(event);
          }
        });
      }

      // Process matches
      if (userData.matches) {
        userData.matches.forEach(match => {
          const piscineMatch = findPiscineForPathOrObject(
            organized.piscines,
            match.path,
            match.object
          );
          if (piscineMatch) {
            organized.piscines[piscineMatch].matches.push(match);
          } else {
            organized.cursus.matches.push(match);
          }
        });
      }

      setOrganizedData(organized);
    }
  }, [data]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  if (!organizedData) return <div>No data available</div>;

  // Calculate piscine validation XP total
  const validationXpTotal = organizedData.cursus.piscineValidations.reduce(
    (sum, tx) => sum + tx.amount, 0
  );

  // Calculate total XP excluding validations for display
  const cursusXpWithoutValidations = organizedData.cursus.xp - validationXpTotal;

  return (
    <div className="student-stats-container">
      {/* Basic User Info */}
      {data.user[0] && (
        <div className="user-profile">
          <img src={data.user[0].avatarUrl} alt="Profile" className="avatar" />
          <h2>{data.user[0].public?.firstName} {data.user[0].public?.lastName}</h2>
          <p>Login: {data.user[0].login}</p>
          <p>Campus: {data.user[0].campus}</p>
          <p>Member since: {new Date(data.user[0].createdAt).toLocaleDateString()}</p>
        </div>
      )}

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
    </div>
  );
};

export default StudentStatsComponent;