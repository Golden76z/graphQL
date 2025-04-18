import React from 'react';
import styles from '../../../styles/components/RecentXPCard.module.css';

const PendingAuditsCard = ({ audits }) => {
  if (!audits || audits.length === 0) {
    return <div className={styles.noData}>No audit data available</div>;
  }

  const completed = audits.filter(audit => audit.grade !== null);
  const pending = audits.filter(audit => audit.grade === null);

  const renderAudit = (audit, index) => {
    const date = new Date(audit.createdAt).toLocaleDateString();
    const time = new Date(audit.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const project = audit.group?.object?.name || 'Unknown Project';
    const targetLogin = audit.group?.members?.find(m => m.user?.id !== audit.auditor?.id)?.user?.login || 'Unknown';

    return (
      <div key={audit.id || index} className={styles.transaction}>
        <div className={styles.txHeader}>
          <span className={styles.txProject}>{project} → {targetLogin}</span>
          <span className={styles.txDate}>{date} {time}</span>
        </div>
        <div className={styles.txDetails}>
          <span className={styles.txPath}>{audit.grade !== null ? 'Completed' : 'Pending'}</span>
          {audit.grade !== null && (
            <span className={styles.txAmount}>Grade: {audit.grade.toFixed(2)}</span>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className={styles.cardContainer}>
      <h3 className={styles.cardTitle}>My Audits</h3>

      {pending.length > 0 && (
        <>
          {/* <h4 className={styles.cardTitle} style={{ marginTop: '1rem' }}>Pending</h4> */}
          <div className={styles.transactionList}>
            {pending.map(renderAudit)}
          </div>
        </>
      )}

      {completed.length > 0 && (
        <>
          {/* <h4 className={styles.cardTitle} style={{ marginTop: '1rem' }}>Completed</h4> */}
          <div className={styles.transactionList}>
            {completed.map(renderAudit)}
          </div>
        </>
      )}
    </div>
  );
};

export default PendingAuditsCard;
