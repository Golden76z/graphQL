import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import Profile from './pages/ProfilePage';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Header from './elements/layout/Header'

// Protected route component
const ProtectedRoute = ({ children }) => {
  const { token } = useAuth();
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

import { ApolloClient, InMemoryCache, ApolloProvider, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

const httpLink = createHttpLink({
  uri: 'https://zone01normandie.org/api/graphql-engine/v1/graphql',
});

const authLink = setContext((_, { headers }) => {
  // Get the token from local storage
  const token = localStorage.getItem('authToken');
  
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    }
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache()
});

// Main App component
function App() {
  return (
    <ApolloProvider client={client}>
      <AuthProvider>
        <Router>
          <Header/>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } 
            />
            <Route path="/" element={<Navigate to="/profile" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ApolloProvider>
  );
}

export default App;