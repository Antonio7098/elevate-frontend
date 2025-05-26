import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { login as apiLogin } from '../services/authService';
import type { LoginCredentials } from '../services/authService';

const LoginPage = () => {
  console.log('🔑 [LoginPage] Component rendered');
  const { login, isAuthenticated, isInitialized } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const from = location.state?.from?.pathname || '/dashboard';
  
  console.log('📍 [LoginPage] Location state:', location.state);
  console.log('🔄 [LoginPage] Target redirect path (from):', from);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [loginAttempted, setLoginAttempted] = useState(false);

  // Check for success message from registration
  const successMessage = location.state?.message;

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Handle navigation after successful login
  useEffect(() => {
    console.log('🔄 [LoginPage] 🔄 useEffect checking auth state:', { 
      isAuthenticated, 
      isInitialized, 
      loginAttempted,
      from,
      currentPath: window.location.pathname
    });
    
    if (isInitialized && isAuthenticated) {
      if (loginAttempted) {
        console.log('✅ [LoginPage] ✅ Auth successful and initialized, navigating to:', from);
        console.log('🔄 [LoginPage] 🔄 Navigation details:', {
          currentPath: window.location.pathname,
          targetPath: from,
          isReplacing: true,
          reason: 'After successful login attempt'
        });
        navigate(from, { replace: true });
      } else {
        // If already authenticated but not from a login attempt
        const targetPath = from === '/login' || from === '/register' ? '/dashboard' : from;
        console.log('🔄 [LoginPage] 🔄 Already authenticated, redirecting to:', targetPath);
        console.log('📌 [LoginPage] 📌 Navigation details:', {
          fromPath: window.location.pathname,
          toPath: targetPath,
          isReplacing: true,
          reason: 'Already authenticated on page load'
        });
        navigate(targetPath, { replace: true });
      }
    }
  }, [isAuthenticated, isInitialized, loginAttempted, navigate, from]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('🔄 [LoginPage] 🚀 Form submission started');
    setSubmitError('');
    setLoginAttempted(false);
    
    console.log('🔍 [LoginPage] 🔍 Validating form...');
    if (!validateForm()) {
      console.log('❌ [LoginPage] ❌ Form validation failed');
      console.log('📋 [LoginPage] Current form errors:', errors);
      return;
    }
    
    console.log('✅ [LoginPage] ✅ Form validation passed');
    setIsSubmitting(true);
    
    try {
      console.log('🔑 [LoginPage] 🔑 Attempting to authenticate with backend...');
      
      // Call the real login endpoint
      const credentials: LoginCredentials = {
        email: formData.email,
        password: formData.password
      };
      
      console.log('🔐 [LoginPage] Sending login request...');
      const authResponse = await apiLogin(credentials);
      const { token, user } = authResponse;
      
      console.log('✅ [LoginPage] ✅ Backend authentication successful');
      
      // Clear any existing data first
      console.log('🧹 [LoginPage] 🧹 Clearing any existing auth data...');
      localStorage.removeItem('authToken');
      localStorage.removeItem('userData');
      
      // Save the new token and user data
      console.log('💾 [LoginPage] 💾 Saving auth data...');
      localStorage.setItem('authToken', token);
      localStorage.setItem('userData', JSON.stringify(user));
      
      console.log('🔑 [LoginPage] 🔑 Calling login from AuthContext...');
      console.log('⏳ [LoginPage] ⏳ Before login call, auth state:', {
        isAuthenticated,
        isInitialized,
        loginAttempted
      });
      
      // Update auth context
      login(token);
      console.log('✅ [LoginPage] ✅ Login function called, setting loginAttempted to true');
      setLoginAttempted(true);
      
      console.log('🔄 [LoginPage] 🔄 After login call, state:', {
        isAuthenticated,
        isInitialized,
        loginAttempted: true
      });
      
    } catch (error: any) {
      console.error('❌ [LoginPage] ❌ Login error:', error);
      
      // Extract error message from response if available
      const errorMessage = error.response?.data?.message || 
                         error.message || 
                         'Login failed. Please check your credentials and try again.';
      
      setSubmitError(errorMessage);
      
      // Clear any invalid auth data
      console.log('🧹 [LoginPage] 🧹 Removing invalid auth data...');
      localStorage.removeItem('authToken');
      localStorage.removeItem('userData');
      
    } finally {
      console.log('🏁 [LoginPage] 🏁 Form submission completed');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <Link 
              to="/register" 
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              create a new account
            </Link>
          </p>
        </div>

        {successMessage && (
          <div className="bg-green-50 border-l-4 border-green-400 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-green-700">{successMessage}</p>
              </div>
            </div>
          </div>
        )}

        {submitError && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{submitError}</p>
              </div>
            </div>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={formData.email}
                onChange={handleChange}
                className={`appearance-none rounded-none relative block w-full px-3 py-2 border ${
                  errors.email ? 'border-red-300' : 'border-gray-300'
                } rounded-t-md placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
                placeholder="Email address"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                value={formData.password}
                onChange={handleChange}
                className={`appearance-none rounded-none relative block w-full px-3 py-2 border ${
                  errors.password ? 'border-red-300' : 'border-gray-300'
                } rounded-b-md placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
                placeholder="Password"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
                Forgot your password?
              </a>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
                isSubmitting ? 'bg-indigo-400' : 'bg-indigo-600 hover:bg-indigo-700'
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </>
              ) : (
                'Sign in'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
