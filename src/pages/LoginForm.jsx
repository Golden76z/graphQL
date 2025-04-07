import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, parseJwt } from '../contexts/AuthContext';
import TextInput from '../elements/components/TextInput';
import styles from '../styles/components/Login.module.css';  

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
      const authString = `${identifier}:${password}`;
      const encodedAuth = btoa(authString);
      
      const response = await fetch('https://zone01normandie.org/api/auth/signin', {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${encodedAuth}`,
          'Content-Type': 'application/json'
        }
      });
      
      const responseText = await response.text();
      
      if (!response.ok) {
        throw new Error(response.status === 401 ? 'Invalid credentials' : `Login failed with status ${response.status}`);
      }
      
      setResponseDetails({
        status: response.status,
        body: responseText
      });
      
      const token = responseText.trim();
      
      if (!token) {
        throw new Error('Empty token received from server');
      }
      
      const userData = parseJwt(token);
      
      let userId = null;
      if (userData && userData['https://hasura.io/jwt/claims']) {
        userId = userData['https://hasura.io/jwt/claims']['x-hasura-user-id'];
      }

      login(token, { 
        id: userId,
        jwt: userData
      });
      
      navigate('/profile');
      
    } catch (err) {
      setError(err.message);
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className={styles['login-page']}>
      <div className={styles['login-page-container']}>
        <div className={styles['login-container']}>
          <h2>Login to Your Profile</h2>
          
          {error && (
            <div className={styles['error-message']}>
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
              className={styles['login-button']} 
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