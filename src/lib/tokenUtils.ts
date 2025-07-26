import { jwtDecode } from "jwt-decode";

export interface TokenPayload {
  id: string;
  exp?: number;
  iat?: number;
  [key: string]: any;
}

// Check if token is expired
export const isTokenExpired = (token: string): boolean => {
  try {
    const decoded = jwtDecode<TokenPayload>(token);
    const currentTime = Date.now() / 1000;
    
    // Check if token has expiration time and if it's expired
    if (decoded.exp && decoded.exp < currentTime) {
      return true;
    }
    
    return false;
  } catch (error) {
    // If token can't be decoded, consider it invalid
    return true;
  }
};

// Check if token is valid (not expired and properly formatted)
export const isTokenValid = (token: string): boolean => {
  if (!token) return false;
  
  try {
    const decoded = jwtDecode<TokenPayload>(token);
    const currentTime = Date.now() / 1000;
    
    // Check if token has required fields
    if (!decoded.id) {
      return false;
    }
    
    // Check if token is expired
    if (decoded.exp && decoded.exp < currentTime) {
      return false;
    }
    
    return true;
  } catch (error) {
    // If token can't be decoded, it's invalid
    return false;
  }
};

// Get token expiration time
export const getTokenExpirationTime = (token: string): Date | null => {
  try {
    const decoded = jwtDecode<TokenPayload>(token);
    if (decoded.exp) {
      return new Date(decoded.exp * 1000);
    }
    return null;
  } catch (error) {
    return null;
  }
};

// Get time until token expires (in milliseconds)
export const getTimeUntilExpiration = (token: string): number => {
  try {
    const decoded = jwtDecode<TokenPayload>(token);
    const currentTime = Date.now() / 1000;
    
    if (decoded.exp) {
      const timeUntilExpiration = (decoded.exp - currentTime) * 1000;
      return Math.max(0, timeUntilExpiration);
    }
    
    return 0;
  } catch (error) {
    return 0;
  }
}; 