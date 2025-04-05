import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, parseJwt } from '../../contexts/AuthContext';

const LoginForm = () => {
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
      // So we can use the token directly without parsing JSON
      const token = responseText.trim();
      
      if (!token) {
        throw new Error('Empty token received from server');
      }
      
      console.log('Token received successfully');
      
      // Parse the JWT to extract user info
      const userData = parseJwt(token);
      console.log('Decoded JWT payload:', userData);
      
      // Extract user ID from the JWT claims
      let userId = null;
      if (userData && userData['https://hasura.io/jwt/claims']) {
        userId = userData['https://hasura.io/jwt/claims']['x-hasura-user-id'];
      }
      
      console.log('TOKEN BEFORE LOGIN:', token);

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
  
  // Temporary mock login for development/testing
  const handleMockLogin = () => {
    console.log('Using mock login');
    const mockToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTIzNDUsImxvZ2luIjoidGVzdFVzZXIiLCJleHAiOjE3MTIwMDAwMDB9.signature";
    login(mockToken, { id: 12345, login: "testUser" });
    navigate('/profile');
  };
  
  return (
    <div className="login-container">
      <h2>Login to Your Profile</h2>
      
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="identifier">Username or Email</label>
          <input
            type="text"
            id="identifier"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            required
            placeholder="Enter your username or email"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Enter your password"
          />
        </div>
        
        <button 
          type="submit" 
          className="login-button" 
          disabled={isLoading}
        >
          {isLoading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      
      {/* Development tools - remove in production
      <div className="dev-tools">
        <hr />
        <h3>Development Options</h3>
        <button onClick={handleMockLogin} className="mock-button">
          Use Mock Token (Development Only)
        </button>
        
        {responseDetails && (
          <div className="response-details">
            <h4>Server Response:</h4>
            <pre>{JSON.stringify(responseDetails, null, 2)}</pre>
          </div>
        )}
      </div> */}
    </div>
  );
};

export default LoginForm;