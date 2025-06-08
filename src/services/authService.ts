import apiClient from './apiClient';

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
    
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || 
                      error.message || 
                      'Registration failed. Please try again.';
    
    console.error('❌ [authService] Registration failed:', errorMessage, {
      status: error.response?.status,
      data: error.response?.data,
      url: error.config?.url
    });
    
    const registrationError = new Error(errorMessage);
    registrationError.name = 'RegistrationError';
    
    if (error.response?.status) {
      (registrationError as any).status = error.response.status;
    }
    
    throw registrationError;
  }
};

/**
 * Logs in an existing user
 */
export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  console.log('🔐 [authService] Attempting login with email:', credentials.email);
  
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
    
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || 
                      error.message || 
                      'Login failed. Please try again.';
    
    console.error('❌ [authService] Login failed:', errorMessage, {
      status: error.response?.status,
      data: error.response?.data,
      url: error.config?.url
    });
    
    // Create a new error with the server message or default message
    const loginError = new Error(errorMessage);
    loginError.name = 'LoginError';
    
    // Attach the status code if available
    if (error.response?.status) {
      (loginError as any).status = error.response.status;
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
  } catch (error: any) {
    console.error('❌ [authService] Token verification failed:', {
      status: error.response?.status,
      message: error.message,
      url: error.config?.url
    });
    
    // Clear invalid token
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('userData');
    }
    
    return false;
  }
};
