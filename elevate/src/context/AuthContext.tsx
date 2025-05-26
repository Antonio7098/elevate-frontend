import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import type { ReactNode } from 'react';

interface User {
  email: string;
  name: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  isInitialized: boolean;
  user: User | null;
  login: (token: string, onSuccess?: () => void) => void;
  logout: (onSuccess?: () => void) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

// Auth state management
const useAuthState = () => {
  const [state, setState] = useState({
    isAuthenticated: false,
    isInitialized: false,
    user: null as User | null,
  });

  const updateState = useCallback((updates: Partial<typeof state>) => {
    setState(prev => ({
      ...prev,
      ...updates,
    }));
  }, []);

  return { ...state, updateState };
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated, isInitialized, user, updateState } = useAuthState();

  // Initialize auth state on mount
  useEffect(() => {
    console.log('🔑 [AuthProvider] Initializing');
    checkAuth();
  }, []);

  const parseToken = useCallback((token: string): User | null => {
    try {
      if (!token) return null;
      
      const parts = token.split('.');
      if (parts.length !== 3) return null;
      
      const payload = atob(parts[1]);
      const data = JSON.parse(payload);
      
      return {
        email: data.email || 'user@example.com',
        name: data.name || 'User'
      };
    } catch (error) {
      console.error('❌ [Auth] Error parsing token:', error);
      return null;
    }
  }, []);

  const checkAuth = useCallback((): boolean => {
    console.log('🔄 [Auth] Checking authentication status');
    const token = localStorage.getItem('authToken');
    
    console.log('🔍 [Auth] Token from localStorage:', token ? 'Token exists' : 'No token');
    
    if (!token) {
      console.log('🔍 [Auth] No auth token found, setting unauthenticated state');
      updateState({
        isAuthenticated: false,
        user: null,
        isInitialized: true
      });
      console.log('🔄 [Auth] State after update (unauthenticated):', {
        isAuthenticated: false,
        isInitialized: true,
        hasUser: false
      });
      return false;
    }
    
    try {
      console.log('🔑 [Auth] Attempting to parse token...');
      const userData = parseToken(token);
      console.log('🔑 [Auth] Parsed user data:', userData);
      
      if (userData) {
        console.log('✅ [Auth] Valid token found, updating auth state');
        updateState({
          isAuthenticated: true,
          user: userData,
          isInitialized: true
        });
        console.log('✅ [Auth] State after successful auth:', {
          isAuthenticated: true,
          isInitialized: true,
          hasUser: !!userData
        });
        return true;
      } else {
        console.log('❌ [Auth] Invalid token found (no user data)');
        localStorage.removeItem('authToken');
        updateState({
          isAuthenticated: false,
          user: null,
          isInitialized: true
        });
        return false;
      }
    } catch (error) {
      console.error('❌ [Auth] Error validating token:', error);
      localStorage.removeItem('authToken');
      updateState({
        isAuthenticated: false,
        user: null,
        isInitialized: true
      });
      console.log('❌ [Auth] State after token validation error:', {
        isAuthenticated: false,
        isInitialized: true,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      return false;
    }
  }, [parseToken, updateState]);

  const login = useCallback((token: string) => {
    console.log('🔑 [Auth] 🔑 login function called');
    console.log('📝 [Auth] Token received:', token ? 'Token exists' : 'No token provided');
    
    if (!token || token.split('.').length !== 3) {
      const errorMsg = `Invalid token format: ${token ? 'malformed token' : 'token is empty'}`;
      console.error('❌ [Auth] ❌ Login error:', errorMsg);
      console.log('🧹 [Auth] Cleaning up invalid token...');
      
      updateState({
        isAuthenticated: false,
        user: null,
        isInitialized: true
      });
      localStorage.removeItem('authToken');
      
      console.log('❌ [Auth] ❌ Login failed - invalid token format');
      throw new Error(errorMsg);
    }
    
    try {
      console.log('🔍 [Auth] 🔍 Parsing token...');
      const userData = parseToken(token);
      console.log('👤 [Auth] Parsed user data:', userData);
      
      if (!userData) {
        throw new Error('Failed to parse user data from token');
      }
      
      console.log('💾 [Auth] 💾 Saving token to localStorage...');
      localStorage.setItem('authToken', token);
      
      // Verify token was saved
      const savedToken = localStorage.getItem('authToken');
      console.log('🔍 [Auth] Token save verification:', 
        savedToken === token ? '✅ Success' : '❌ Failed');
      
      console.log('🔄 [Auth] 🔄 Updating auth state...');
      updateState({
        isAuthenticated: true,
        user: userData,
        isInitialized: true
      });
      
      console.log('✅ [Auth] ✅ Login completed successfully');
      console.log('📊 [Auth] Current auth state after login:', {
        isAuthenticated: true,
        isInitialized: true,
        hasUser: !!userData,
        userEmail: userData.email
      });
      
    } catch (error) {
      console.error('❌ [Auth] ❌ Login failed:', error);
      console.error('📋 [Auth] Error details:', {
        name: error instanceof Error ? error.name : 'Unknown',
        message: error instanceof Error ? error.message : 'No message',
        stack: error instanceof Error ? error.stack : 'No stack trace'
      });
      
      console.log('🧹 [Auth] 🧹 Cleaning up after login error...');
      localStorage.removeItem('authToken');
      updateState({
        isAuthenticated: false,
        user: null,
        isInitialized: true
      });
      
      console.log('🔄 [Auth] 🔄 Auth state after cleanup:', {
        isAuthenticated: false,
        isInitialized: true,
        hasUser: false
      });
      
      throw error;
    }
  }, [parseToken, updateState]);

  const logout = useCallback((onSuccess?: () => void) => {
    console.log('🚪 [Auth] Logging out');
    localStorage.removeItem('authToken');
    updateState({
      isAuthenticated: false,
      user: null,
      isInitialized: true
    });
    onSuccess?.();
  }, [updateState]);

  const value = useMemo(() => ({
    isAuthenticated,
    isInitialized,
    user,
    login,
    logout,
  }), [isAuthenticated, isInitialized, user, login, logout]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
