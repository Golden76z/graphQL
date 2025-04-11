import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import TextInput from '../elements/components/TextInput';
import styles from '../styles/components/Login.module.css';  
import Z01Description from '../elements/components/Zone01Description';
import Button from '../elements/components/Button';

const LoginPage = () => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { login } = useAuth();
  const navigate = useNavigate();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('https://zone01normandie.org/api/auth/signin', {
        method: 'POST',
        headers: {
          'Authorization': 'Basic ' + btoa(`${identifier}:${password}`),
          'Content-Type': 'application/json'
        }
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(response.status === 401 ? 'Invalid credentials' : 
          errorText || `Login failed with status ${response.status}`);
      }
  
      // Get the raw response text
      const responseText = await response.text();
      console.log('Raw response:', responseText); // Debug
      
      // Handle different response formats
      let token;
      try {
        // Try parsing as JSON first
        const jsonResponse = JSON.parse(responseText);
        token = jsonResponse.token || jsonResponse.access_token || jsonResponse;
      } catch {
        // If not JSON, use raw text
        token = responseText;
      }
  
      // Clean the token
      token = token.toString().trim();
      
      // Verify we actually got a token
      if (!token) {
        throw new Error('Empty token received from server');
      }
  
      // Debug token details
      console.log('Token details:', {
        length: token.length,
        startsWith: token.substring(0, 10),
        endsWith: token.substring(token.length - 10),
        isJWT: token.split('.').length === 3
      });
  
      login(token);
      navigate('/profile');
    } catch (err) {
      setError(err.message);
      console.error('Login error:', {
        message: err.message,
        response: err.response,
        stack: err.stack
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className={styles['login-page']}>
      <div className={styles['description-container']}>
        <Z01Description/>
      </div>
      
      <div className={styles['right-side']}>
        <div className={styles['video-container']}>
          <iframe 
            width="100%" 
            height="100%"
            src="https://www.youtube.com/embed/nBFEsXr5A4A?mute=1&loop=1&controls=0" 
            frameBorder="0" 
            allowFullScreen
            title="Zone01 Video"
          />
        </div>
        
        <div className={styles['login-container']}>
          {error && <div className={styles['error-message']}>{error}</div>}
          
          <form onSubmit={handleSubmit}>
            <TextInput
              id="identifier"
              label="Email ou Nom d'utilisateur"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
              placeholder="Enter your username or email"
            />
            
            <TextInput
              id="password"
              label="Mot de passe"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your password"
            />
            
            <Button 
              type="submit" 
              disabled={isLoading}
              Name={isLoading ? "Connexion..." : "Se connecter"}
            />
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;