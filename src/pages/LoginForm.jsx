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
      // Basic Auth encoding
      const authString = `${identifier}:${password}`;
      const encodedAuth = btoa(authString);
      
      // API request
      const response = await fetch('https://zone01normandie.org/api/auth/signin', {
        method: 'POST',
        headers: {
          'Authorization': 'Basic ' + btoa(`${identifier}:${password}`)
        }
      });
      const token = await response.text(); // Get raw text, not JSON
      
      if (!response.ok) {
        throw new Error(response.status === 401 
          ? 'Invalid credentials' 
          : `Login failed (Status ${response.status})`);
      }

      if (!token) throw new Error('No token received');
      
      // Successful login
      login(token, {
        id: '', // Will be set via parseJwt in AuthContext
        jwt: null // Will be populated in AuthContext
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