import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, parseJwt } from '../../contexts/AuthContext';
import TextInput from '../components/TextInput/TextInput';

const LoginPage = () => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [responseDetails, setResponseDetails] = useState(null);
  const { login } = useAuth();
  const navigate = useNavigate();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setResponseDetails(null);
    
    try {
      // Create Basic Auth header
      const authString = `${identifier}:${password}`;
      const encodedAuth = btoa(authString);
      
      console.log('Attempting to log in with:', identifier);
      
      const response = await fetch('https://zone01normandie.org/api/auth/signin', {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${encodedAuth}`,
          'Content-Type': 'application/json'
        }
      });
      
      const responseText = await response.text();
      console.log('Response status:', response.status);
      console.log('Response headers:', [...response.headers.entries()]);
      console.log('Raw response body:', responseText);
      
      if (!response.ok) {
        throw new Error(response.status === 401 ? 'Invalid credentials' : `Login failed with status ${response.status}`);
      }
      
      // Store raw response for debugging
      setResponseDetails({
        status: response.status,
        body: responseText
      });
      
      // The API returns the JWT token directly as text, not as JSON
      const token = responseText.trim();
      
      if (!token) {
        throw new Error('Empty token received from server');
      }
      
      // Parse the JWT to extract user info
      const userData = parseJwt(token);
      console.log('Decoded JWT payload:', userData);
      
      // Extract user ID from the JWT claims
      let userId = null;
      if (userData && userData['https://hasura.io/jwt/claims']) {
        userId = userData['https://hasura.io/jwt/claims']['x-hasura-user-id'];
      }

      // Login the user with token and extracted user data
      login(token, { 
        id: userId,
        // Add other useful user data from JWT if available
        jwt: userData
      });
      
      console.log('User authenticated successfully. Navigating to profile page.');
      // Redirect to profile page
      navigate('/profile');
      
    } catch (err) {
      setError(err.message);
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="login-page">
      <div className="login-page-container">
        <div className="login-container">
          <h2>Login to Your Profile</h2>
          
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <TextInput
              id="identifier"
              label="Username or Email"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required={true}
              placeholder="Enter your username or email"
            />
            
            <TextInput
              id="password"
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required={true}
              placeholder="Enter your password"
            />
            
            <button 
              type="submit" 
              className="login-button" 
              disabled={isLoading}
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;