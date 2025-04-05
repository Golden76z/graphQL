import React, { useEffect, useState } from 'react';
import { useQuery } from '@apollo/client';
import { useAuth } from '../contexts/AuthContext';
import { 
  GET_USER_INFO, 
  GET_USER_LEVEL, 
  GET_USER_XP_TRANSACTIONS, 
  GET_XP_DOWN, 
  GET_XP_UP 
} from '../queries/UserQueries';

const Profile = () => {
  const { logout } = useAuth();
  const [userData, setUserData] = useState({
    firstName: '',
    lastName: '',
    lvl: 0,
    maxXP: 0,
    XPdown: 0,
    XPup: 0,
    listTransaction: []
  });
  
  // Fetch user info (firstName, lastName)
  const { 
    loading: userInfoLoading, 
    error: userInfoError, 
    data: userInfoData 
  } = useQuery(GET_USER_INFO);
  
  // Fetch user level
  const { 
    loading: userLevelLoading, 
    error: userLevelError, 
    data: userLevelData 
  } = useQuery(GET_USER_LEVEL);
  
  // Fetch XP transactions
  const { 
    loading: xpTransactionsLoading, 
    error: xpTransactionsError, 
    data: xpTransactionsData 
  } = useQuery(GET_USER_XP_TRANSACTIONS);
  
  // Fetch XP down transactions sum
  const { 
    loading: xpDownLoading, 
    error: xpDownError, 
    data: xpDownData 
  } = useQuery(GET_XP_DOWN);
  
  // Fetch XP up transactions sum
  const { 
    loading: xpUpLoading, 
    error: xpUpError, 
    data: xpUpData 
  } = useQuery(GET_XP_UP);

  // Log query results and errors for debugging
  useEffect(() => {
    // Log user info query results
    console.log('USER INFO QUERY:');
    console.log('- Loading:', userInfoLoading);
    console.log('- Error:', userInfoError);
    console.log('- Data:', userInfoData);
    
    // Log user level query results
    console.log('USER LEVEL QUERY:');
    console.log('- Loading:', userLevelLoading);
    console.log('- Error:', userLevelError);
    console.log('- Data:', userLevelData);
    
    // Log XP transactions query results
    console.log('XP TRANSACTIONS QUERY:');
    console.log('- Loading:', xpTransactionsLoading);
    console.log('- Error:', xpTransactionsError);
    console.log('- Data:', xpTransactionsData);
    
    // Log XP down query results
    console.log('XP DOWN QUERY:');
    console.log('- Loading:', xpDownLoading);
    console.log('- Error:', xpDownError);
    console.log('- Data:', xpDownData);
    
    // Log XP up query results
    console.log('XP UP QUERY:');
    console.log('- Loading:', xpUpLoading);
    console.log('- Error:', xpUpError);
    console.log('- Data:', xpUpData);

    // Log specific error messages if errors exist
    if (userInfoError) console.error('USER INFO ERROR DETAILS:', userInfoError.message, userInfoError.graphQLErrors, userInfoError.networkError);
    if (userLevelError) console.error('USER LEVEL ERROR DETAILS:', userLevelError.message, userLevelError.graphQLErrors, userLevelError.networkError);
    if (xpTransactionsError) console.error('XP TRANSACTIONS ERROR DETAILS:', xpTransactionsError.message, xpTransactionsError.graphQLErrors, xpTransactionsError.networkError);
    if (xpDownError) console.error('XP DOWN ERROR DETAILS:', xpDownError.message, xpDownError.graphQLErrors, xpDownError.networkError);
    if (xpUpError) console.error('XP UP ERROR DETAILS:', xpUpError.message, xpUpError.graphQLErrors, xpUpError.networkError);
  }, [
    userInfoLoading, userInfoError, userInfoData,
    userLevelLoading, userLevelError, userLevelData,
    xpTransactionsLoading, xpTransactionsError, xpTransactionsData,
    xpDownLoading, xpDownError, xpDownData,
    xpUpLoading, xpUpError, xpUpData
  ]);

  // Process all data when available
  useEffect(() => {
    // Only proceed when all data is loaded
    if (
      userInfoData && 
      userLevelData && 
      xpTransactionsData && 
      xpDownData && 
      xpUpData &&
      !userInfoLoading && 
      !userLevelLoading && 
      !xpTransactionsLoading && 
      !xpDownLoading && 
      !xpUpLoading
    ) {
      try {
        console.log('All data is loaded, processing...');
        
        // Calculate total XP from transactions
        let totalXP = 0;
        const transactions = xpTransactionsData.transaction || [];
        for (let i = 0; i < transactions.length; i++) {
          totalXP += transactions[i].amount;
        }

        // Check if required data exists before accessing it
        const firstName = userInfoData.user && userInfoData.user[0] ? userInfoData.user[0].firstName : '';
        const lastName = userInfoData.user && userInfoData.user[0] ? userInfoData.user[0].lastName : '';
        const level = userLevelData.user && 
                      userLevelData.user[0] && 
                      userLevelData.user[0].events && 
                      userLevelData.user[0].events[0] ? 
                      userLevelData.user[0].events[0].level : 0;
        
        const xpDown = xpDownData.transaction_aggregate && 
                      xpDownData.transaction_aggregate.aggregate && 
                      xpDownData.transaction_aggregate.aggregate.sum ? 
                      xpDownData.transaction_aggregate.aggregate.sum.amount || 0 : 0;
        
        const xpUp = xpUpData.transaction_aggregate && 
                    xpUpData.transaction_aggregate.aggregate && 
                    xpUpData.transaction_aggregate.aggregate.sum ? 
                    xpUpData.transaction_aggregate.aggregate.sum.amount || 0 : 0;

        console.log('Processed data values:');
        console.log('- firstName:', firstName);
        console.log('- lastName:', lastName);
        console.log('- level:', level);
        console.log('- totalXP:', totalXP);
        console.log('- xpDown:', xpDown);
        console.log('- xpUp:', xpUp);
        console.log('- transactions count:', transactions.length);

        // Update user data state
        setUserData({
          firstName,
          lastName,
          lvl: level,
          maxXP: totalXP,
          XPdown: xpDown,
          XPup: xpUp,
          listTransaction: transactions
        });
      } catch (error) {
        console.error('Error processing user data:', error);
      }
    }
  }, [
    userInfoData, 
    userLevelData, 
    xpTransactionsData, 
    xpDownData, 
    xpUpData,
    userInfoLoading,
    userLevelLoading,
    xpTransactionsLoading,
    xpDownLoading,
    xpUpLoading
  ]);

  // Helper function to calculate progress percentage
  const calculateProgress = () => {
    const currentXP = userData.maxXP - userData.XPdown + userData.XPup;
    const levelXP = 100; // Assuming each level requires 100 XP - adjust as needed
    return Math.min(100, Math.round((currentXP / levelXP) * 100));
  };

  // Create a more informative error component that shows details
  const renderErrorComponent = () => {
    // Build error message with specific details
    const errorDetails = [
      userInfoError && 'User info query failed',
      userLevelError && 'User level query failed',
      xpTransactionsError && 'XP transactions query failed',
      xpDownError && 'XP down query failed',
      xpUpError && 'XP up query failed'
    ].filter(Boolean); // Remove falsy values
    
    return (
      <div className="error-container">
        <h2>Error loading profile data</h2>
        <p>There was a problem retrieving your profile information.</p>
        
        {errorDetails.length > 0 && (
          <div className="error-details">
            <p>Specific issues:</p>
            <ul>
              {errorDetails.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        )}
        
        <p>Please check the console for more detailed information and try again later.</p>
      </div>
    );
  };

  // Handle error states
  const hasError = userInfoError || userLevelError || xpTransactionsError || xpDownError || xpUpError;
  if (hasError) {
    return renderErrorComponent();
  }

  // Handle loading state
  const isLoading = userInfoLoading || userLevelLoading || xpTransactionsLoading || xpDownLoading || xpUpLoading;
  if (isLoading) {
    return <div className="loading">Loading profile data...</div>;
  }

  // Handle logout
  const handleLogout = () => {
    logout();
  };

  // Try to render basic info even if some data is missing
  const canRenderBasicInfo = userInfoData && userInfoData.user && userInfoData.user[0];
  
  return (
    <div className="profile-container">
      <header className="profile-header">
        {canRenderBasicInfo ? (
          <h1>Welcome, {userData.firstName} {userData.lastName}</h1>
        ) : (
          <h1>Welcome to your profile</h1>
        )}
        <button className="logout-button" onClick={handleLogout}>Logout</button>
      </header>

      <div className="stats-container">
        <div className="stat-card">
          <h2>Level</h2>
          <div className="stat-value">{userData.lvl}</div>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${calculateProgress()}%` }}
            ></div>
          </div>
          <p>Current level progress</p>
        </div>

        <div className="stat-card">
          <h2>Total XP</h2>
          <div className="stat-value">{userData.maxXP.toLocaleString()}</div>
          <p>Experience points earned</p>
        </div>

        <div className="stat-card">
          <h2>XP Balance</h2>
          <div className="stat-value">
            {(userData.maxXP - userData.XPdown + userData.XPup).toLocaleString()}
          </div>
          <p>Current XP after adjustments</p>
        </div>
      </div>

      <div className="xp-details">
        <div className="xp-detail-item">
          <span className="xp-label">XP Up:</span> 
          <span className="xp-value positive">+{userData.XPup.toLocaleString()}</span>
        </div>
        <div className="xp-detail-item">
          <span className="xp-label">XP Down:</span> 
          <span className="xp-value negative">-{userData.XPdown.toLocaleString()}</span>
        </div>
      </div>

      <div className="profile-footer">
        <p>Track your progress at Rouen Division 01</p>
      </div>
    </div>
  );
};

export default Profile;