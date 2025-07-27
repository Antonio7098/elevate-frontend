import { useState, useEffect } from 'react';
import styles from './LoginPage.module.css';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
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
      console.log('[LoginPage] Attempting to store authToken:', token);
      localStorage.setItem('authToken', token);
      console.log('[LoginPage] authToken stored. Value from localStorage right after setting:', localStorage.getItem('authToken'));
      localStorage.setItem('userData', JSON.stringify(user));
      
      console.log('🔑 [LoginPage] 🔑 Calling login from AuthContext...');
      console.log('⏳ [LoginPage] ⏳ Before login call, auth state:', {
        isAuthenticated,
        isInitialized,
        loginAttempted
      });
      
      try {
        // Update auth context with onSuccess callback for navigation
        login(token, () => {
          console.log('✅ [LoginPage] ✅ Login success callback triggered, navigating to:', from);
          navigate(from, { replace: true });
        });
        console.log('✅ [LoginPage] ✅ Login function called, setting loginAttempted to true');
        setLoginAttempted(true);
        
        // Force navigation if callback doesn't trigger
        setTimeout(() => {
          if (window.location.pathname === '/login') {
            console.log('⏰ [LoginPage] ⏰ Timeout reached, forcing navigation to:', from);
            navigate(from, { replace: true });
          }
        }, 1000);
      } catch (loginError) {
        console.error('❌ [LoginPage] Error during login context update:', loginError);
        setSubmitError('Error updating authentication state. Please try again.');
      }
      
      console.log('🔄 [LoginPage] 🔄 After login call, state:', {
        isAuthenticated,
        isInitialized,
        loginAttempted: true
      });
      
    } catch (error: unknown) {
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
    <div className={styles.container}>
      <div className="card">
        <div>
          <h2 className={styles.title}>Sign in to your account</h2>
          <p className={styles.subtitle}>
            Don't have an account?{' '}
            <Link 
              to="/register" 
              state={{ from: location.state?.from }}
              className={styles.link}
            >
              Sign up now
            </Link>
          </p>
        </div>

        {successMessage && (
          <div style={{background: '#dcfce7', borderLeft: '4px solid #4ade80', padding: '1rem', borderRadius: '0.7rem', marginBottom: '1rem'}}>
            <div style={{display: 'flex', alignItems: 'center'}}>
              <svg className={styles.spinner} style={{color: '#4ade80', marginRight: '0.7rem'}} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" width="20" height="20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <p style={{color: '#15803d', fontSize: '0.98rem'}}>{successMessage}</p>
            </div>
          </div>
        )}

        {submitError && (
          <div style={{background: '#fee2e2', borderLeft: '4px solid #f87171', padding: '1rem', borderRadius: '0.7rem', marginBottom: '1rem'}}>
            <div style={{display: 'flex', alignItems: 'center'}}>
              <svg className={styles.spinner} style={{color: '#f87171', marginRight: '0.7rem'}} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" width="20" height="20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <p style={{color: '#b91c1c', fontSize: '0.98rem'}}>{submitError}</p>
            </div>
          </div>
        )}

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
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
                className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
                placeholder="Email address"
              />
              {errors.email && (
                <p className={styles.errorMsg}>{errors.email}</p>
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
                className={`${styles.input} ${errors.password ? styles.inputError : ''}`}
                placeholder="Password"
              />
              {errors.password && (
                <p className={styles.errorMsg}>{errors.password}</p>
              )}
            </div>
          </div>

          <div className={styles.linkRow} style={{justifyContent: 'space-between', alignItems: 'center', display: 'flex'}}>
            <div className={styles.checkboxRow}>
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className={styles.checkbox}
              />
              <label htmlFor="remember-me" className={styles.checkboxLabel}>
                Remember me
              </label>
            </div>

            <div className={styles.linkRow}>
              <a href="#" className={styles.link}>
                Forgot your password?
              </a>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className={styles.button}
            >
              {isSubmitting ? (
                <>
                  <svg className={styles.spinner} style={{marginRight: '0.7rem'}} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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
