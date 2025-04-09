import { useQuery } from '@apollo/client';
import { FULL_STUDENT_STATS_QUERY } from '../../queries/UserQueries.jsx';
import styles from '../../styles/components/UserStats.module.css';
import { useAuth } from '../../contexts/AuthContext';

export default function UserStats() {
  const { token } = useAuth();
  const { loading, error, data } = useQuery(FULL_STUDENT_STATS_QUERY, {
    skip: !token, // Skip query if no token
    fetchPolicy: 'network-and-cache'
  });

  if (!token) return <div className={styles.error}>Not authenticated</div>;
  if (loading) return <div className={styles.loading}>Loading stats...</div>;
  if (error) {
    console.error('GraphQL Error Details:', {
      error,
      extensions: error.graphQLErrors?.[0]?.extensions
    });
    return (
      <div className={styles.error}>
        Error loading stats: {error.message}
      </div>
    );
  }

  const user = data?.user;
  if (!user) return <div className={styles.error}>No user data found</div>;

  return (
    <div className={styles.statsContainer}>
      <div className={styles.avatarSection}>
        <img 
          src={user.avatarUrl} 
          alt="Profile" 
          className={styles.avatar}
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/150';
          }}
        />
        <h2 className={styles.userName}>
          {user.public?.firstName} {user.public?.lastName}
        </h2>
        <p className={styles.campus}>{user.campus}</p>
      </div>
      
      <div className={styles.statsGrid}>
        <div className={styles.statItem}>
          <h3>Total XP</h3>
          <p>{user.transactions_aggregate?.aggregate?.sum?.amount || 0}</p>
        </div>
        <div className={styles.statItem}>
          <h3>Projects</h3>
          <p>{user.progresses_aggregate?.aggregate?.count || 0}</p>
        </div>
        <div className={styles.statItem}>
          <h3>Audit Ratio</h3>
          <p>{user.auditRatio?.toFixed(2) || 0}</p>
        </div>
      </div>
    </div>
  );
}