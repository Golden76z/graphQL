import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, parseJwt } from '../contexts/AuthContext';
import TextInput from '../elements/components/TextInput';
import styles from '../styles/components/Login.module.css';  
import Z01Description from '../elements/components/Zone01Description';

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
      {/* Left side - Description */}
      <div className={styles['description-container']}>
        <Z01Description/>
      </div>
      
      {/* Right side - Video and Login */}
      <div className={styles['right-side']}>
        <div className={styles['video-container']}>
        <iframe 
            width="100%" 
            height="100%"
            src="https://www.youtube.com/embed/nBFEsXr5A4A?mute=1&loop=1&controls=0" 
            frameBorder="0" 
            allowFullScreen
            title="Zone01 Video"
          ></iframe>

        </div>
        
        <div className={styles['login-container']}>
          {error && (
            <div className={styles['error-message']}>
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <TextInput
              id="identifier"
              label="Email ou Nom d'utilisateur"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required={true}
              placeholder="Enter your username or email"
            />
            
            <TextInput
              id="password"
              label="Mot de passe"
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
              {isLoading ? (
                <>
                  <span className={styles['loading-spinner']}></span>
                  Logging in...
                </>
              ) : 'Login'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;