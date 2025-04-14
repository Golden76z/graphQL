// src/context/queryData.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import { fetchUserData } from '../services/apiService';

// Create a context
const QueryDataContext = createContext();

// Create a provider component
export const QueryDataProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to load user data
  const loadUserData = async (token) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchUserData(token);
      setUserData(data);
      return data;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Prepare data for components
  const getUserBasicInfo = () => {
    if (!userData || !userData.user) return null;
    return {
      id: userData.user.id,
      login: userData.user.login,
      firstName: userData.user.public?.firstName,
      lastName: userData.user.public?.lastName,
      avatarUrl: userData.user.avatarUrl,
      campus: userData.user.campus,
      profile: userData.user.public?.profile,
      createdAt: userData.user.createdAt
    };
  };

  const getXpStats = () => {
    if (!userData || !userData.user) return null;
    return {
      totalXp: userData.user.transactions_aggregate?.aggregate?.sum?.amount || 0,
      transactions: userData.user.transactions || []
    };
  };

  const getAuditStats = () => {
    if (!userData || !userData.user) return null;
    return {
      auditRatio: userData.user.auditRatio,
      totalUp: userData.user.totalUp,
      totalDown: userData.user.totalDown,
      audits: userData.user.audits || [],
      totalAudits: userData.user.audits_aggregate?.aggregate?.count || 0,
      totalAuditGrade: userData.user.audits_aggregate?.aggregate?.sum?.grade || 0
    };
  };

  const getProgressStats = () => {
    if (!userData || !userData.user) return null;
    return {
      completedProjects: userData.user.progresses_aggregate?.aggregate?.count || 0,
      progresses: userData.user.progresses || []
    };
  };

  const getResults = () => {
    if (!userData || !userData.user) return null;
    return userData.user.results || [];
  };

  // Calculate additional stats based on the data
  const getCalculatedStats = () => {
    if (!userData || !userData.user) return null;
    
    // Example calculations - you can add more
    const xpByProject = {};
    const projectsByType = {};
    
    // Group XP by project
    if (userData.user.transactions) {
      userData.user.transactions.forEach(tx => {
        const projectName = tx.object?.name || 'Unknown';
        if (!xpByProject[projectName]) {
          xpByProject[projectName] = 0;
        }
        xpByProject[projectName] += tx.amount;
        
        // Group by project type
        const projectType = tx.object?.type || 'Unknown';
        if (!projectsByType[projectType]) {
          projectsByType[projectType] = new Set();
        }
        projectsByType[projectType].add(projectName);
      });
    }
    
    // Convert Sets to arrays for easier consumption
    Object.keys(projectsByType).forEach(type => {
      projectsByType[type] = Array.from(projectsByType[type]);
    });
    
    return {
      xpByProject,
      projectsByType,
      // Add more calculated stats as needed
    };
  };

  // All value to be provided by the context
  const value = {
    userData,
    isLoading,
    error,
    loadUserData,
    getUserBasicInfo,
    getXpStats,
    getAuditStats,
    getProgressStats,
    getResults,
    getCalculatedStats,
    // Raw data access
    getRawData: () => userData
  };

  return (
    <QueryDataContext.Provider value={value}>
      {children}
    </QueryDataContext.Provider>
  );
};

// Custom hook to use the QueryData context
export const useQueryData = () => {
  const context = useContext(QueryDataContext);
  if (context === undefined) {
    throw new Error('useQueryData must be used within a QueryDataProvider');
  }
  return context;
};