// Remove all Apollo-related imports and replace with:
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginForm';
import ProfilePage from './pages/ProfilePage';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Header from './elements/layout/Header';
import WelcomeMessage from './elements/layout/WelcomeMessage';
import { ThemeProvider } from './contexts/ThemeContext';

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

function App() {
  return (
    // Remove ApolloProvider wrapper
    <AuthProvider>
      <ThemeProvider>
        <Router>
          <Routes>
            <Route
              path="/login"
              element={
                <>
                  <Header />
                  <WelcomeMessage />
                  <LoginPage />
                </>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <>
                    <Header />
                    <WelcomeMessage />
                    <ProfilePage />
                  </>
                </ProtectedRoute>
              }
            />
            <Route path="/" element={<Navigate to="/profile" replace />} />
          </Routes>
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;