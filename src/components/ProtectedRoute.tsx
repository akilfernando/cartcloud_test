import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/authContext';
import { isTokenValid } from '../lib/tokenUtils';
import { useEffect, useState } from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, isLoading, logout } = useAuth();
  const [isValidating, setIsValidating] = useState(false);
  
  // Validate token on navigation
  useEffect(() => {
    const validateTokenOnNavigation = () => {
      const token = localStorage.getItem('token');
      
      if (token && user) {
        setIsValidating(true);
        
        // Check if token is valid
        if (!isTokenValid(token)) {
          console.log('Invalid token detected during navigation');
          logout();
          return;
        }
        
        setIsValidating(false);
      }
    };

    // Validate token when component mounts (on navigation)
    validateTokenOnNavigation();
  }, [user, logout]);
  
  // Show loading spinner while checking authentication or validating token
  if (isLoading || isValidating) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }
  
  // Only redirect if loading is complete and there's no user
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

export default ProtectedRoute; 