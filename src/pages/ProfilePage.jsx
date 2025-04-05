import React, { useEffect, useState } from 'react';
import { useQuery, gql } from '@apollo/client';
import { useAuth } from '../contexts/AuthContext'; // Import the auth context

// Define GraphQL queries
const GET_USER_DATA = gql`
  query GetUserData {
    user {
      id
      login
    }
  }
`;

const GET_USER_XP = gql`
  query GetUserXP {
    transaction(where: {type: {_eq: "xp"}}) {
      amount
      createdAt
      path
    }
  }
`;

const GET_USER_PROGRESS = gql`
  query GetUserProgress {
    progress {
      grade
      path
      createdAt
    }
  }
`;

const Profile = () => {
  const { logout } = useAuth();
  const [totalXp, setTotalXp] = useState(0);
  const [passRate, setPassRate] = useState(0);
  
  // Fetch user data
  const { loading: userLoading, error: userError, data: userData } = useQuery(GET_USER_DATA);
  
  // Fetch XP data
  const { loading: xpLoading, error: xpError, data: xpData } = useQuery(GET_USER_XP);
  
  // Fetch progress data
  const { loading: progressLoading, error: progressError, data: progressData } = useQuery(GET_USER_PROGRESS);

  // Calculate total XP
  useEffect(() => {
    if (xpData && xpData.transaction) {
      const total = xpData.transaction.reduce((sum, tx) => sum + tx.amount, 0);
      setTotalXp(total);
    }
  }, [xpData]);

  // Calculate pass rate
  useEffect(() => {
    if (progressData && progressData.progress && progressData.progress.length > 0) {
      const passCount = progressData.progress.filter(item => item.grade === 1).length;
      const totalCount = progressData.progress.length;
      setPassRate(totalCount > 0 ? ((passCount / totalCount) * 100).toFixed(1) : 0);
    }
  }, [progressData]);

  // Handle logout
  const handleLogout = () => {
    logout();
  };

  if (userLoading || xpLoading || progressLoading) return <div className="loading">Loading...</div>;
  if (userError || xpError || progressError) return <div className="error">Error loading data.</div>;

  return (
    <div className="profile-container">
      <header className="profile-header">
        <h1>Welcome, {userData && userData.user && userData.user[0]?.login}</h1>
        <button className="logout-button" onClick={handleLogout}>Logout</button>
      </header>

      <div className="stats-container">
        <div className="stat-card">
          <h2>Total XP</h2>
          <div className="stat-value">{totalXp.toLocaleString()}</div>
          <p>Experience points earned</p>
        </div>

        <div className="stat-card">
          <h2>Pass Rate</h2>
          <div className="stat-value">{passRate}%</div>
          <p>Project success rate</p>
        </div>

        <div className="stat-card">
          <h2>Projects</h2>
          <div className="stat-value">
            {progressData && progressData.progress ? progressData.progress.length : 0}
          </div>
          <p>Total projects attempted</p>
        </div>
      </div>

      <div className="profile-footer">
        <p>More detailed statistics coming soon!</p>
      </div>
    </div>
  );
};

export default Profile;