import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';

function Header() {
  const { user, logout } = useAuth();
  const { darkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header>
      <div className=''>
        <nav>
          <span>Welcome, {user?.name || 'Guest'}</span>
          <button onClick={handleLogout}>Logout</button>

          <label className="theme-switch">
            <input 
              type="checkbox" 
              checked={darkMode}
              onChange={toggleTheme}
            />
            <span className="slider round"></span>
          </label>
        </nav>
      </div>
    </header>
  );
}

export default Header;