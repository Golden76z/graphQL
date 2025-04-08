import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import Button from '../components/Button';
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
          {/* Logo or brand could go here if needed */}
          <div className={styles.headerControls}>
            {user && (
              <>
                <Button Function={handleLogout} Name="LogOut"/>
              </>
            )}
            
            <label className={styles.themeSwitch}>
              <input
                type="checkbox"
                checked={darkMode}
                onChange={toggleTheme}
              />
              <span className={styles.slider}></span>
            </label>
          </div>
        </nav>
      </div>
    </header>
  );
}

export default Header;