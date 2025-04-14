import React from 'react';

// Routing imports
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './contexts/ProtectedRoute';

// Provider imports
import { AuthProvider } from './contexts/AuthContext';
import { ApolloProvider } from '@apollo/client';
import { ThemeProvider } from './contexts/ThemeContext';
import client from './contexts/ApolloClient';

// Pages/Components imports
import LoginPage from './pages/LoginForm';
import ProfilePage from './pages/ProfilePage';
import Header from './elements/layout/Header';
import WelcomeMessage from './elements/layout/WelcomeMessage';

// App react components
function App() {
  return (
    <AuthProvider>
      <ApolloProvider client={client}>
        <ThemeProvider>
          <Router>
            <Routes>
              {/* Authentication page */}
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

              {/* Profile page */}
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
      </ApolloProvider>
    </AuthProvider>
  );
}

export default App;