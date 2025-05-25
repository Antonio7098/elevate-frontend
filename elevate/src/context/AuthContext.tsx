import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (token: string, redirectPath?: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return !!localStorage.getItem('authToken');
  });
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check for token in localStorage on initial load
    const token = localStorage.getItem('authToken');
    
    // In a real app, you would validate the token with your backend
    // For now, we'll just check if it exists and has a valid format
    const isValidToken = (token: string | null): boolean => {
      if (!token) return false;
      // Simple check for JWT format (3 parts separated by dots)
      return token.split('.').length === 3;
    };
    
    if (isValidToken(token)) {
      setIsAuthenticated(true);
    } else {
      // Clear invalid or expired token
      localStorage.removeItem('authToken');
      setIsAuthenticated(false);
    }
  }, []);

  const login = (token: string, redirectPath?: string) => {
    // In a real app, you would validate the token with your backend
    // For now, we'll just check if it has a valid format
    if (token.split('.').length !== 3) {
      throw new Error('Invalid token format');
    }
    
    localStorage.setItem('authToken', token);
    setIsAuthenticated(true);
    
    // Redirect to the provided path, the intended URL from location state, or the dashboard
    const redirectTo = redirectPath || location.state?.from?.pathname || '/dashboard';
    navigate(redirectTo, { replace: true });
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setIsAuthenticated(false);
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
