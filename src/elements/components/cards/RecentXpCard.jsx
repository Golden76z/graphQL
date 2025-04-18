import React from 'react';
import styles from '../../../styles/components/RecentXPCard.module.css';

const RecentXPCard = ({ transactions, limit = 5 }) => {
  if (!transactions || transactions.length === 0) {
    return <div className={styles.noData}>No recent XP data available</div>;
  }

  // Get the most recent transactions first
  const recentTransactions = [...transactions]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, limit);
  
  return (
    <div className={styles.cardContainer}>
      <h3 className={styles.cardTitle}>Recent XP Gains</h3>
      <div className={styles.transactionList}>
        {recentTransactions.map((tx, index) => {
          const date = new Date(tx.createdAt).toLocaleDateString();
          const time = new Date(tx.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          
          return (
            <div key={tx.id || index} className={styles.transaction}>
              <div className={styles.txHeader}>
                <span className={styles.txProject}>{tx.object?.name || 'Unknown Project'}</span>
                <span className={styles.txDate}>{date} {time}</span>
              </div>
              <div className={styles.txDetails}>
                <span className={styles.txPath}>{tx.path || ''}</span>
                <span className={styles.txAmount}>+{tx.amount.toLocaleString()} XP</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RecentXPCard;