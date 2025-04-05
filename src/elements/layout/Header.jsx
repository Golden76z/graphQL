// Conponent to display the header of the app
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header>
        <nav>
          <span>Welcome, {user?.name || 'Guest'}</span>
          {/* {user && <button onClick={handleLogout}>Logout</button>} */}
          <button onClick={handleLogout}>Logout</button>
        </nav>
    </header>
  );
}

export default Header;
