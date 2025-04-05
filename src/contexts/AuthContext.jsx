import React, { useState, useContext, createContext } from 'react';

// Create an auth context to manage user state throughout the app
export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // Initialize state from localStorage if available
  const [token, setToken] = useState(localStorage.getItem('authToken') || null);
  const [user, setUser] = useState(null);
  
  // Console log to track AuthProvider initialization
  console.log('AuthProvider initialized. Token exists:', !!token);
  
  const login = (newToken, userData) => {
    console.log('Login function called with token:', newToken ? 'Token exists' : 'No token');
    localStorage.setItem('authToken', newToken);
    setToken(newToken);
    setUser(userData);
    console.log('User logged in successfully. User data:', userData);
  };
  
  const logout = () => {
    console.log('Logout function called');
    localStorage.removeItem('authToken');
    setToken(null);
    setUser(null);
    console.log('User logged out successfully');
  };
  
  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    console.error('useAuth must be used within an AuthProvider');
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Function to decode JWT and extract user info
export function parseJwt(token) {
  try {
    // Split the token into its three parts and decode the payload (middle part)
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error('Error parsing JWT token:', e);
    return null;
  }
}