import { createContext, useContext, useState, useEffect } from 'react';

const parseJwt = (token) => {
  try {
    if (!token || typeof token !== 'string' || !token.includes('.')) {
      console.error('Invalid token format');
      return null;
    }
    
    const base64Url = token.split('.')[1];
    if (!base64Url) {
      console.error('Could not extract payload from token');
      return null;
    }
    
    // Replace non-base64url chars and add padding if needed
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const paddedBase64 = base64.padEnd(base64.length + (4 - base64.length % 4) % 4, '=');
    
    // Decode the base64 string
    try {
      const jsonPayload = decodeURIComponent(
        atob(paddedBase64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (decodeError) {
      console.error('Failed to decode token payload:', decodeError);
      return null;
    }
  } catch (e) {
    console.error('JWT parsing error:', e);
    return null;
  }
};

// Extract Hasura claims safely
const getHasuraClaims = (decodedToken) => {
  if (!decodedToken) return null;
  return {
    userId: decodedToken['https://hasura.io/jwt/claims']?.['x-hasura-user-id'],
    role: decodedToken['https://hasura.io/jwt/claims']?.['x-hasura-default-role'],
    allowedRoles: decodedToken['https://hasura.io/jwt/claims']?.['x-hasura-allowed-roles'] || []
  };
};

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = () => {
      const storedToken = localStorage.getItem('authToken');
      if (storedToken) {
        try {
          const decoded = parseJwt(storedToken);
          if (!decoded || decoded.exp * 1000 < Date.now()) {
            localStorage.removeItem('authToken');
            return;
          }
          
          setToken(storedToken);
          setUser({
            id: getHasuraClaims(decoded)?.userId || decoded.sub,
            jwt: decoded,
            claims: getHasuraClaims(decoded)
          });
        } catch (error) {
          localStorage.removeItem('authToken');
          console.error('Auth initialization error:', error);
        }
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const login = (token, userData) => {
    if (!token || typeof token !== 'string' || !token.includes('.')) {
      throw new Error('Invalid token format');
    }
  
    const decoded = parseJwt(token);
    if (!decoded) throw new Error('Invalid token');
  
    // Store exactly as received
    localStorage.setItem('authToken', token.trim()); 
    setToken(token);
    setUser({
      id: getHasuraClaims(decoded)?.userId || decoded.sub,
      jwt: decoded,
      claims: getHasuraClaims(decoded)
    });
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ 
      token, 
      user, 
      isLoading, 
      login, 
      logout,
      parseJwt // Export for components that need raw parsing
    }}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);