import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface MockUser {
  id: string;
  email: string;
  name: string;
  role: 'student' | 'instructor' | 'admin';
  avatar?: string;
  preferences: {
    theme: 'light' | 'dark';
    language: 'en' | 'es' | 'fr';
    notifications: boolean;
  };
}

interface MockAuthContextValue {
  user: MockUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateUser: (updates: Partial<MockUser>) => void;
  updatePreferences: (preferences: Partial<MockUser['preferences']>) => void;
}

const MockAuthContext = createContext<MockAuthContextValue | undefined>(undefined);

// Mock user data
const mockUsers: MockUser[] = [
  {
    id: '1',
    email: 'student@example.com',
    name: 'Alex Johnson',
    role: 'student',
    avatar: 'AJ',
    preferences: {
      theme: 'light',
      language: 'en',
      notifications: true,
    },
  },
  {
    id: '2',
    email: 'instructor@example.com',
    name: 'Dr. Sarah Chen',
    role: 'instructor',
    avatar: 'SC',
    preferences: {
      theme: 'dark',
      language: 'en',
      notifications: true,
    },
  },
  {
    id: '3',
    email: 'admin@example.com',
    name: 'Michael Rodriguez',
    role: 'admin',
    avatar: 'MR',
    preferences: {
      theme: 'light',
      language: 'en',
      notifications: false,
    },
  },
];

// Mock authentication service
class MockAuthService {
  private currentUser: MockUser | null = null;
  private isLoggedIn = false;

  async login(email: string, password: string): Promise<{ success: boolean; user?: MockUser; error?: string }> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));

    // Simple mock validation
    if (password === 'password') {
      const user = mockUsers.find(u => u.email === email);
      if (user) {
        this.currentUser = user;
        this.isLoggedIn = true;
        
        // Store in localStorage for persistence
        localStorage.setItem('mockAuthUser', JSON.stringify(user));
        localStorage.setItem('mockAuthToken', 'mock-jwt-token-' + Date.now());
        
        return { success: true, user };
      }
    }

    return { 
      success: false, 
      error: 'Invalid email or password. Use any email with password "password"' 
    };
  }

  async logout(): Promise<void> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    this.currentUser = null;
    this.isLoggedIn = false;
    
    // Clear localStorage
    localStorage.removeItem('mockAuthUser');
    localStorage.removeItem('mockAuthToken');
  }

  async getCurrentUser(): Promise<MockUser | null> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 200));
    
    if (this.currentUser) {
      return this.currentUser;
    }

    // Check localStorage for persisted user
    const storedUser = localStorage.getItem('mockAuthUser');
    const storedToken = localStorage.getItem('mockAuthToken');
    
    if (storedUser && storedToken) {
      this.currentUser = JSON.parse(storedUser);
      this.isLoggedIn = true;
      return this.currentUser;
    }

    return null;
  }

  isUserLoggedIn(): boolean {
    return this.isLoggedIn;
  }

  getCurrentUserSync(): MockUser | null {
    return this.currentUser;
  }
}

const mockAuthService = new MockAuthService();

interface MockAuthProviderProps {
  children: ReactNode;
}

export const MockAuthProvider: React.FC<MockAuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<MockUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const currentUser = await mockAuthService.getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.warn('Mock auth check failed:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const result = await mockAuthService.login(email, password);
      if (result.success && result.user) {
        setUser(result.user);
        setIsAuthenticated(true);
        return { success: true };
      } else {
        return { success: false, error: result.error };
      }
    } catch (error) {
      return { success: false, error: 'Login failed. Please try again.' };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await mockAuthService.logout();
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.warn('Logout failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateUser = (updates: Partial<MockUser>) => {
    if (user) {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      
      // Update localStorage
      localStorage.setItem('mockAuthUser', JSON.stringify(updatedUser));
      
      // Update service
      mockAuthService['currentUser'] = updatedUser;
    }
  };

  const updatePreferences = (preferences: Partial<MockUser['preferences']>) => {
    if (user) {
      const updatedPreferences = { ...user.preferences, ...preferences };
      updateUser({ preferences: updatedPreferences });
    }
  };

  const value: MockAuthContextValue = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    updateUser,
    updatePreferences,
  };

  return (
    <MockAuthContext.Provider value={value}>
      {children}
    </MockAuthContext.Provider>
  );
};

export const useMockAuth = (): MockAuthContextValue => {
  const context = useContext(MockAuthContext);
  if (context === undefined) {
    throw new Error('useMockAuth must be used within a MockAuthProvider');
  }
  return context;
};

// Export mock users for use in other components
export { mockUsers };
export type { MockUser };





