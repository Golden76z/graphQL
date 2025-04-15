import { useAuth } from "./AuthContext";
import { Navigate } from 'react-router-dom';

// 🔐 Protected Route
const ProtectedRoute = ({ children }) => {
  const { token, user, isLoading } = useAuth();
  
  if (isLoading) {
    return <div>Loading...</div>;
  }

  const isExpired = user?.exp * 1000 < Date.now();

  if (!token || isExpired) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;