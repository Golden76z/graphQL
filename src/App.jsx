import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginForm';
import ProfilePage from './pages/ProfilePage';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Header from './elements/layout/Header';
import WelcomeMessage from './elements/layout/WelcomeMessage'; // Import the new component
// import AnimatedCardNavigation from './elements/components/cards/SwitchCards';
import { ThemeProvider } from './contexts/ThemeContext';
import { ApolloLink } from '@apollo/client';

import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

// In App.jsx
const httpLink = createHttpLink({
  uri: 'https://zone01normandie.org/api/graphql-engine/v1/graphql',
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('authToken');
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '', // No JSON parsing
    }
  };
});

// Add logging to debug the request
const loggingLink = new ApolloLink((operation, forward) => {
  console.log('GraphQL Request Headers:', operation.getContext().headers);
  return forward(operation);
});

const client = new ApolloClient({
  link: loggingLink.concat(authLink.concat(httpLink)),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'network-only',
      errorPolicy: 'all',
    },
    query: {
      fetchPolicy: 'network-only',
      errorPolicy: 'all',
    },
  },
});

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
    <ApolloProvider client={client}>
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
                      {/* <AnimatedCardNavigation /> */}
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
    </ApolloProvider>
  );
}

export default App;