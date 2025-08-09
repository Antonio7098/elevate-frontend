import { AuthContext } from './AuthContext';
import { useCallback, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import type { User } from './AuthContext';

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

  const parseToken = useCallback(async (token: string): Promise<User | null> => {
    console.log('🔑 [Auth] Parsing token:', token);
    if (!token) return null;

    try {
      // Try to parse as base64 JSON first (for mock tokens)
      try {
        const decoded = atob(token);
        const data = JSON.parse(decoded);
        
        console.log('🔑 [Auth] Successfully parsed base64 JSON token:', data);
        
        const email = data.email || data.sub || data.username;
        const name = data.name || data.fullName || data.displayName || (email ? email.split('@')[0] : undefined);
        if (email || typeof data.userId === 'number') {
          const user = {
            email: email || `user-${data.userId}@local`,
            name: name || `User ${data.userId}`,
          };
          console.log('🔑 [Auth] Returning parsed user:', user);
          return user;
        }
      } catch (base64Error) {
        console.log('🔑 [Auth] Token is not base64 JSON, trying other formats...', base64Error);
      }

      // Standard JWT (header.payload.signature)
      if (token.split('.').length === 3) {
        try {
          const payload = atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/'));
          const data = JSON.parse(payload);
          
          console.log('🔑 [Auth] Successfully parsed JWT payload:', data);

          const email = data.email || data.sub || data.username;
          const name = data.name || data.fullName || data.displayName || (email ? email.split('@')[0] : undefined);
          
          console.log('🔑 [Auth] Extracted from JWT - email:', email, 'name:', name, 'userId:', data.userId);
          
          if (email || typeof data.userId === 'number') {
            // If we have email in the token, use it
            if (email) {
              const user = {
                email: email,
                name: name || email.split('@')[0],
              };
              console.log('🔑 [Auth] Returning JWT parsed user with email:', user);
              return user;
            }
            
            // If no email in token but we have userId, use userId-based user
            if (typeof data.userId === 'number') {
              const user = {
                email: `user-${data.userId}@local`,
                name: `User ${data.userId}`,
              };
              console.log('🔑 [Auth] Returning userId-based user:', user);
              return user;
            }
          }
        } catch (jwtError) {
          console.log('🔑 [Auth] Token is not valid JWT:', jwtError);
        }
      }

      // Direct JSON user
      try {
        const directData = JSON.parse(token);
        if (directData.email) {
          return { email: directData.email, name: directData.name || directData.email.split('@')[0] };
        }
      } catch (jsonError) {
        console.log('🔑 [Auth] Token is not direct JSON:', jsonError);
      }

      // Fallback to cached userData
      const userDataStr = localStorage.getItem('userData');
      if (userDataStr) {
        try {
          const userData = JSON.parse(userDataStr);
          if (userData.email) {
            return { email: userData.email, name: userData.name || userData.email.split('@')[0] };
          }
        } catch (userDataError) {
          console.log('🔑 [Auth] Failed to parse userData:', userDataError);
        }
      }

      console.log('🔑 [Auth] No valid token format found');
      return null;
    } catch (error) {
      console.error('❌ [Auth] Error parsing token:', error);
      return null;
    }
  }, []);

  const checkAuth = useCallback(async (): Promise<boolean> => {
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
      const userData = await parseToken(token);
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
      const userData = await parseToken(token);
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
      console.log('[AuthContext] Attempting to store authToken:', token);
      localStorage.setItem('authToken', token);
      console.log('[AuthContext] authToken stored. Value from localStorage right after setting:', localStorage.getItem('authToken'));

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
    // Add a small delay to ensure login process completes before checking auth
    const timer = setTimeout(async () => {
      await checkAuth();
    }, 100);
    
    return () => clearTimeout(timer);
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
