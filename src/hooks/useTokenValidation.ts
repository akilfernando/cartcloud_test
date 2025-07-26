import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/authContext';
import { isTokenValid } from '../lib/tokenUtils';

export const useTokenValidation = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const validateTokenOnNavigation = () => {
      const token = localStorage.getItem('token');
      
      if (token && user) {
        // Check if token is valid
        if (!isTokenValid(token)) {
          console.log('Invalid token detected during navigation to:', location.pathname);
          logout();
          return false;
        }
      }
      return true;
    };

    // Validate token on every navigation
    validateTokenOnNavigation();
  }, [location.pathname, user, logout]);

  return null;
}; 