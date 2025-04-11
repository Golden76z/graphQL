import { createContext, useContext, useState, useEffect } from 'react';

const parseJwt = (token) => {
  try {
    // Handle cases where token might be JSON stringified
    let cleanToken = token;
    if (token.startsWith('"') && token.endsWith('"')) {
      cleanToken = token.slice(1, -1);
    }

    // Verify basic JWT structure
    const parts = cleanToken.split('.');
    if (parts.length !== 3) {
      console.warn('Token structure:', parts);
      throw new Error('Invalid JWT structure');
    }

    // Decode payload
    const payload = JSON.parse(atob(parts[1]));
    return payload;
  } catch (e) {
    console.error('Token parsing failed:', {
      error: e,
      token: token.substring(0, 20) + '...' + token.substring(token.length - 20)
    });
    return null;
  }
};

const login = (token) => {
  const decoded = parseJwt(token);
  if (!decoded) {
    throw new Error('Invalid token');
  }

  // Store the clean token
  localStorage.setItem('authToken', token);
  setToken(token);
  setUser(decoded);
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