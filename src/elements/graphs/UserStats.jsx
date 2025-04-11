import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { fetchUserData } from '../../elements/graphs/Test';
import styles from '../../styles/components/UserStats.module.css';

export default function UserStats() {
  const { token } = useAuth();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchUserData(token);
        if (!data?.user?.[0]) throw new Error('No user data found');
        setUserData(data.user[0]);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [token]);

  if (loading) return <div className={styles.loading}>Loading stats...</div>;
  if (error) return <div className={styles.error}>Error: {error}</div>;
  if (!userData) return <div className={styles.error}>No user data available</div>;

  // Calculate level based on XP (example formula)
  const calculateLevel = (xp) => Math.floor(Math.sqrt(xp / 1000));
  const level = calculateLevel(userData.transactions_aggregate.aggregate.sum.amount);

  return (
    <div className={styles.statsContainer}>
      {/* Rank Card */}
      <div className={styles.rankCard}>
        <div className={styles.avatarSection}>
          <img 
            src={userData.avatarUrl || 'https://via.placeholder.com/150'} 
            alt="Profile" 
            className={styles.avatar}
          />
          <div>
            <h2>{userData.public.firstName} {userData.public.lastName}</h2>
            <p>@{userData.login}</p>
            <p>Campus: {userData.campus}</p>
          </div>
        </div>
        <div className={styles.levelBadge}>
          <span>Level {level}</span>
          <div className={styles.levelProgress}>
            <div style={{ width: `${(userData.transactions_aggregate.aggregate.sum.amount % 1000)/10}%` }}></div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className={styles.statsGrid}>
        {/* Audit Ratio */}
        <div className={styles.statCard}>
          <h3>Audit Ratio</h3>
          <p className={styles.statValue}>{userData.auditRatio.toFixed(2)}</p>
          <p className={styles.statLabel}>
            {userData.auditRatio > 1.5 ? 'Excellent' : 
             userData.auditRatio > 1 ? 'Good' : 'Needs improvement'}
          </p>
        </div>

        {/* Projects Completed */}
        <div className={styles.statCard}>
          <h3>Projects</h3>
          <p className={styles.statValue}>{userData.progresses_aggregate.aggregate.count}</p>
          <p className={styles.statLabel}>Completed</p>
        </div>

        {/* Total XP */}
        <div className={styles.statCard}>
          <h3>Total XP</h3>
          <p className={styles.statValue}>
            {(userData.transactions_aggregate.aggregate.sum.amount / 1000).toFixed(1)}k
          </p>
          <p className={styles.statLabel}>Points</p>
        </div>

        {/* Status */}
        <div className={styles.statCard}>
          <h3>Status</h3>
          <p className={styles.statValue}>Active</p>
          <p className={styles.statLabel}>Student</p>
        </div>
      </div>

      {/* Additional Sections */}
      <div className={styles.additionalSections}>
        {/* Recent Audits */}
        <div className={styles.section}>
          <h3>Recent Audits</h3>
          <div className={styles.auditList}>
            <p>Last audit: Project X</p>
            <a href="/audits">See all audits →</a>
          </div>
        </div>

        {/* Teamwork */}
        <div className={styles.section}>
          <h3>Teamwork</h3>
          <div className={styles.teamworkStats}>
            <p>Best friend: User123</p>
            <p>New friend: User456</p>
            <p>Extra rewards: 3</p>
          </div>
        </div>
      </div>

      {/* XP Progress Graph (placeholder) */}
      <div className={styles.graphSection}>
        <h3>XP Progression</h3>
        <div className={styles.xpGraph}>
          {/* This would be replaced with an actual chart component */}
          <div className={styles.graphPlaceholder}>
            <p>Graph comparing to others would appear here</p>
          </div>
        </div>
      </div>

      {/* Skills Graph (placeholder) */}
      <div className={styles.graphSection}>
        <h3>Top Skills</h3>
        <div className={styles.skillsGraph}>
          {/* This would be replaced with an actual chart component */}
          <div className={styles.graphPlaceholder}>
            <p>Skills visualization would appear here</p>
          </div>
        </div>
      </div>
    </div>
  );
}