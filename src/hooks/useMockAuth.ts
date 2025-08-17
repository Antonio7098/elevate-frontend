import { useAuth } from '../context/useAuth';
import { mockUsers, mockUserProgress, mockAnalytics } from '../data/mockData';

// Mock authentication hook that integrates with existing auth system
export const useMockAuth = () => {
  const { user, isAuthenticated, isLoading, login, logout } = useAuth();

  // Get mock user data for the authenticated user
  const getMockUserData = () => {
    if (!user) return null;
    
    // Find mock user by email
    const mockUser = mockUsers.find(u => u.email === user.email);
    if (!mockUser) return null;

    return {
      ...mockUser,
      progress: mockUserProgress,
      analytics: mockAnalytics
    };
  };

  // Get mock blueprint data for the user
  const getMockBlueprintData = (blueprintId: string) => {
    if (!user) return null;
    
    // Import mock data dynamically to avoid circular dependencies
    const { getMockDataByBlueprint } = require('../data/mockData');
    return getMockDataByBlueprint(blueprintId);
  };

  // Mock login with predefined users
  const mockLogin = async (email: string, password: string) => {
    // Check if it's a mock user
    const mockUser = mockUsers.find(u => u.email === email);
    if (mockUser && password === 'password') {
      // Create a mock token for the mock user
      const mockToken = btoa(JSON.stringify({
        email: mockUser.email,
        name: mockUser.name,
        userId: mockUser.id,
        sub: mockUser.email,
        iat: Date.now(),
        exp: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
      }));
      
      // Use the existing login function with the mock token
      return await login(mockToken);
    }
    
    // Fall back to regular login
    return await login(email, password);
  };

  // Get available mock users for testing
  const getAvailableMockUsers = () => {
    return mockUsers.map(user => ({
      email: user.email,
      name: user.name,
      role: user.role,
      password: 'password' // Always 'password' for mock users
    }));
  };

  return {
    // Existing auth properties
    user,
    isAuthenticated,
    isLoading,
    logout,
    
    // Mock-specific functions
    mockLogin,
    getMockUserData,
    getMockBlueprintData,
    getAvailableMockUsers,
    
    // Helper to check if current user is a mock user
    isMockUser: user ? mockUsers.some(u => u.email === user.email) : false
  };
};





