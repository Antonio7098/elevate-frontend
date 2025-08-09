import apiClient from './apiClient';

// Development mode flag - set to true to use mock authentication
const USE_MOCK_AUTH = import.meta.env.DEV && import.meta.env.VITE_USE_MOCK_AUTH === 'true';

// Log mock auth status on module load
console.log('🔧 [authService] Environment check:', {
  DEV: import.meta.env.DEV,
  VITE_USE_MOCK_AUTH: import.meta.env.VITE_USE_MOCK_AUTH,
  USE_MOCK_AUTH: USE_MOCK_AUTH
});

if (USE_MOCK_AUTH) {
  console.log('🎭 [authService] Mock authentication enabled for development');
  console.log('🎭 [authService] Available test accounts:');
  console.log('🎭 [authService] - test@example.com / password123');
  console.log('🎭 [authService] - admin@example.com / admin123');
  console.log('🎭 [authService] Set VITE_USE_MOCK_AUTH=false to use real backend');
} else {
  console.log('🔗 [authService] Using real backend authentication');
}

export interface RegisterCredentials {
  email: string;      // User's email address
  password: string;   // User's password (will be hashed server-side)
  name?: string;     // Optional name field (not used in current backend but kept for future use)
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface User {
  id: number;     // Backend returns number for ID
  email: string;  // User's email
  name?: string;  // Optional name (not in current backend response but kept for future use)
}

export interface AuthResponse {
  token: string;
  user: User;
}

// Mock authentication for development
interface MockUser {
  id: number;
  email: string;
  password: string;
  name: string;
}

const mockAuth = {
  users: [
    { id: 1, email: 'test@example.com', password: 'password123', name: 'Test User' },
    { id: 2, email: 'admin@example.com', password: 'admin123', name: 'Admin User' }
  ] as MockUser[],
  
  generateToken: (user: MockUser): string => {
    const payload = {
      userId: user.id,
      email: user.email,
      name: user.name,
      iat: Date.now(),
      exp: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
    };
    return btoa(JSON.stringify(payload));
  },
  
  validateCredentials: (email: string, password: string): MockUser | null => {
    const user = mockAuth.users.find((u: MockUser) => u.email === email && u.password === password);
    return user || null;
  }
};

/**
 * Attempts to log in a user with the provided credentials
 * @param credentials User's login credentials
 * @returns Promise that resolves with authentication data
 * @throws {Error} If login fails
 */
/**
 * Registers a new user account
 */
export const register = async (credentials: RegisterCredentials): Promise<AuthResponse> => {
  console.log('📝 [authService] Registering new user:', credentials.email);
  
  if (USE_MOCK_AUTH) {
    console.log('🎭 [authService] Using mock registration');
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Check if user already exists
    const existingUser = mockAuth.users.find(u => u.email === credentials.email);
    if (existingUser) {
      throw new Error('User already exists with this email');
    }
    
    // Create new user (in real app, this would be saved to backend)
    const newUser = {
      id: mockAuth.users.length + 1,
      email: credentials.email,
      password: credentials.password,
      name: credentials.name || credentials.email.split('@')[0]
    };
    
    const token = mockAuth.generateToken(newUser);
    
    return {
      token,
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name
      }
    };
  }
  
  try {
    // Prepare the payload with only the fields the backend expects
    const payload = {
      email: credentials.email,
      password: credentials.password
    };
    
    const response = await apiClient.post<AuthResponse>('/auth/register', payload);
    
    if (!response.data?.token) {
      throw new Error('No token received from server');
    }
    
    console.log('✅ [authService] Registration successful');
    // Ensure the response matches our AuthResponse interface
    return {
      token: response.data.token,
      user: {
        id: response.data.user.id,
        email: response.data.user.email,
        name: credentials.email.split('@')[0] // Fallback to first part of email as name
      }
    };
    
  } catch (error: unknown) {
    const errorMessage = (error as { response?: { data?: { message?: string } } }).response?.data?.message || 
                      (error as Error).message || 
                      'Registration failed. Please try again.';
    
    console.error('❌ [authService] Registration failed:', errorMessage, {
      status: (error as { response?: { status?: number } }).response?.status,
      data: (error as { response?: { data?: unknown } }).response?.data,
      url: (error as { config?: { url?: string } }).config?.url
    });
    
    const registrationError = new Error(errorMessage);
    registrationError.name = 'RegistrationError';
    
    if ((error as { response?: { status?: number } }).response?.status) {
      (registrationError as { status?: number }).status = (error as { response: { status: number } }).response.status;
    }
    
    throw registrationError;
  }
};

/**
 * Logs in an existing user
 */
export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  console.log('🔐 [authService] Attempting login with email:', credentials.email);
  
  if (USE_MOCK_AUTH) {
    console.log('🎭 [authService] Using mock login');
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const user = mockAuth.validateCredentials(credentials.email, credentials.password);
    if (!user) {
      throw new Error('Invalid credentials');
    }
    
    const token = mockAuth.generateToken(user);
    
    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    };
  }
  
  try {
    const response = await apiClient.post<AuthResponse>('/auth/login', {
      email: credentials.email,
      password: credentials.password
    });
    
    if (!response.data?.token) {
      throw new Error('No token received from server');
    }
    
    console.log('✅ [authService] Login successful');
    return response.data;
    
  } catch (error: unknown) {
    const errorMessage = (error as { response?: { data?: { message?: string } } }).response?.data?.message || 
                      (error as Error).message || 
                      'Login failed. Please try again.';
    
    console.error('❌ [authService] Login failed:', errorMessage, {
      status: (error as { response?: { status?: number } }).response?.status,
      data: (error as { response?: { data?: unknown } }).response?.data,
      url: (error as { config?: { url?: string } }).config?.url
    });
    
    // Create a new error with the server message or default message
    const loginError = new Error(errorMessage);
    loginError.name = 'LoginError';
    
    // Attach the status code if available
    if ((error as { response?: { status?: number } }).response?.status) {
      (loginError as { status?: number }).status = (error as { response: { status: number } }).response.status;
    }
    
    throw loginError;
  }
};

/**
 * Logs out the current user
 * @returns Promise that resolves when logout is complete
 */
export const logout = async (): Promise<void> => {
  console.log('🚪 [authService] Logging out');
  
  try {
    // Call the logout endpoint if needed
    // await apiClient.post('/auth/logout');
  } catch (error) {
    console.error('❌ [authService] Logout error:', error);
    // Continue with local logout even if server logout fails
  } finally {
    // Always clear local storage
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
  }
};

/**
 * Verifies if the current token is valid
 * @returns Promise that resolves to true if token is valid, false otherwise
 */
export const verifyToken = async (): Promise<boolean> => {
  const token = localStorage.getItem('authToken');
  if (!token) {
    console.log('🔍 [authService] No token found for verification');
    return false;
  }
  
  try {
    console.log('🔍 [authService] Verifying token...');
    await apiClient.get('/api/auth/verify-token');
    console.log('✅ [authService] Token is valid');
    return true;
  } catch (error: unknown) {
    console.error('❌ [authService] Token verification failed:', {
      status: (error as { response?: { status?: number } }).response?.status,
      message: (error as Error).message,
      url: (error as { config?: { url?: string } }).config?.url
    });
    
    // Clear invalid token
    if ((error as { response?: { status?: number } }).response?.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('userData');
    }
    
    return false;
  }
};
