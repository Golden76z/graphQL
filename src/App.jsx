import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './elements/auth/LoginForm';
import Profile from './pages/ProfilePage';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Header from './elements/layout/Header';
import AnimatedCardNavigation from './elements/components/cards/SwitchCards';
import { ThemeProvider } from './contexts/ThemeContext'; // Add this import

import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

const httpLink = createHttpLink({
  uri: 'https://zone01normandie.org/api/graphql-engine/v1/graphql',
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('authToken');
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    }
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

// 🔐 Protected Route
const ProtectedRoute = ({ children }) => {
  const { token, user } = useAuth();
  const isExpired = user?.jwt?.exp * 1000 < Date.now();

  if (!token || isExpired) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

function App() {
  return (
    <ApolloProvider client={client}>
      <AuthProvider>
        <ThemeProvider> {/* Wrap with ThemeProvider */}
          <Router>
            <Routes>
              <Route 
                path="/login" 
                element={
                  <>
                    <Header />
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
                      <AnimatedCardNavigation />
                      <Profile />
                    </>
                  </ProtectedRoute>
                }
              />
              <Route path="/" element={<Navigate to="/profile" replace />} />
            </Routes>
          </Router>
        </ThemeProvider>
      </AuthProvider>
    </ApolloProvider>
  );
}

export default App;