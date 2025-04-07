import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import styles from '../../styles/components/HeaderFooter.module.css';

function Header() {
  const { user, logout } = useAuth();
  const { darkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className={styles.header}>
      <div className={styles.navContainer}>
        <nav className={styles.nav}>
          <span className={styles.userGreeting}>Welcome, {user?.name || 'Guest'}</span>
          <button 
            onClick={handleLogout} 
            className={styles.logoutButton}
          >
            Logout
          </button>

          <label className={styles.themeSwitch}>
            <input 
              type="checkbox" 
              checked={darkMode}
              onChange={toggleTheme}
            />
            <span className={styles.slider}></span>
          </label>
        </nav>
      </div>
    </header>
  );
}

export default Header;