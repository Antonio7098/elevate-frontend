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

  const parseToken = useCallback((token: string): User | null => {
    console.log('🔑 [Auth] Parsing token:', token);
    
    if (!token) {
      console.error('❌ [Auth] No token provided');
      return null;
    }

    // For debugging - log the token format
    console.log('🔑 [Auth] Token format check:', {
      length: token.length,
      hasDots: token.includes('.'),
      parts: token.split('.').length
    });
    
    try {
      // First try standard JWT format (header.payload.signature)
      if (token.split('.').length === 3) {
        const parts = token.split('.');
        // Handle both URL-safe base64 and standard base64
        const payload = atob(parts[1].replace(/-/g, '+').replace(/_/g, '/'));
        console.log('🔑 [Auth] Decoded JWT payload:', payload);
        
        const data = JSON.parse(payload);
        console.log('🔑 [Auth] Parsed JWT data:', data);
        
        // Check for common JWT claims that might contain the email
        const email = data.email || data.sub || data.username;
        
        if (email) {
          // Try to get a display name from various possible fields
          const name = data.name || data.fullName || data.displayName || email.split('@')[0];
          
          return {
            email,
            name
          };
        }
      }
      
      // If JWT parsing failed or didn't have email, try parsing as direct JSON
      // This is a fallback for non-standard tokens or direct user objects
      try {
        console.log('🔑 [Auth] Attempting to parse token as JSON...');
        const directData = JSON.parse(token);
        console.log('🔑 [Auth] Parsed direct JSON data:', directData);
        
        // Check if this looks like a user object
        if (directData.email) {
          return {
            email: directData.email,
            name: directData.name || directData.email.split('@')[0]
          };
        }
      } catch (jsonError) {
        console.log('🔑 [Auth] Not a JSON token, continuing with other methods');
      }
      
      // Last resort: Check if we have user data in localStorage
      try {
        const userDataStr = localStorage.getItem('userData');
        if (userDataStr) {
          console.log('🔑 [Auth] Found userData in localStorage, trying to use that');
          const userData = JSON.parse(userDataStr);
          if (userData.email) {
            return {
              email: userData.email,
              name: userData.name || userData.email.split('@')[0]
            };
          }
        }
      } catch (localStorageError) {
        console.error('❌ [Auth] Error parsing userData from localStorage:', localStorageError);
      }
      
      // If we've tried everything and still can't get user data
      console.error('❌ [Auth] Could not extract user data from token or localStorage');
      return null;
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
          hasUser: true
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

  const login = useCallback(async (token: string, onSuccess?: () => void) => {
    console.log('🔑 [Auth] Login function called');
    
    if (!token) {
      console.error('❌ [Auth] Login attempt with no token');
      updateState({ 
        isAuthenticated: false, 
        user: null, 
        isInitialized: true 
      });
      localStorage.removeItem('authToken');
      throw new Error('Login failed: No token provided');
    }

    try {
      console.log('🔍 [Auth] Parsing token in login...');
      const userData = parseToken(token);
      console.log('👤 [Auth] Parsed user data in login:', userData);

      if (!userData) {
        localStorage.removeItem('authToken');
        updateState({ 
          isAuthenticated: false, 
          user: null, 
          isInitialized: true 
        });
        throw new Error('Login failed: Invalid token or unable to parse user data');
      }

      console.log('💾 [Auth] Saving token to localStorage...');
      localStorage.setItem('authToken', token);

      console.log('🔄 [Auth] Updating auth state to authenticated...');
      updateState({
        isAuthenticated: true,
        user: userData,
        isInitialized: true
      });

      console.log('✅ [Auth] Login completed successfully');
      onSuccess?.();

    } catch (error) {
      console.error('❌ [Auth] Login failed:', error);
      localStorage.removeItem('authToken');
      updateState({
        isAuthenticated: false,
        user: null,
        isInitialized: true
      });
      throw error;
    }
  }, [parseToken, updateState]);

  const logout = useCallback((onSuccess?: () => void) => {
    console.log('👋 [Auth] Logging out');
    localStorage.removeItem('authToken');
    updateState({
      isAuthenticated: false,
      user: null,
      isInitialized: true
    });
    onSuccess?.();
  }, [updateState]);

  // Initialize auth state on mount
  useEffect(() => {
    console.log('🔑 [AuthProvider] Initializing auth state on mount...');
    checkAuth();
  }, [checkAuth]);

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
