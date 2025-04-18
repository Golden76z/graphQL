import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import styles from '../../styles/components/Welcome.module.css';

function WelcomeMessage({username = "Guest"}) {
  const { user } = useAuth();
  const isLoggedIn = !!user;

  return (
    <div className={styles.welcomeContainer}>
      {isLoggedIn ? (
        <h2 className={styles.userGreeting}>Welcome, {username}</h2>
      ) : (
        <h2 className={styles.welcomeMessage}>
          Bienvenue à <span className={styles.primaryText}>Zone01</span> !
        </h2>
      )}
    </div>
  );
}

export default WelcomeMessage;