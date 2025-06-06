import { useState } from 'react';
import styles from './RegisterPage.module.css';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { register } from '../services/authService';
import type { RegisterCredentials } from '../services/authService';
import { useAuth } from '../context/AuthContext';
import { RegistrationSuccess } from '../components/RegistrationSuccess';

const RegisterPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  
  const [formData, setFormData] = useState<RegisterCredentials>({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState('');

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    // Validate email
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    // Validate password
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Call the register function from authService
      const { token } = await register(formData);
      
      // Save the registered email for the success message
      setRegisteredEmail(formData.email);
      
      // Automatically log the user in after successful registration
      login(token);
      
      // Show success message
      setRegistrationSuccess(true);
      
      // Redirect to the dashboard after a short delay
      setTimeout(() => {
        const from = location.state?.from?.pathname || '/dashboard';
        navigate(from, { replace: true });
      }, 3000);
      
    } catch (error: any) {
      console.error('Registration error:', error);
      
      // Handle specific error cases
      if (error.name === 'RegistrationError') {
        setSubmitError(error.message);
      } else if (error.response?.status === 409) {
        setSubmitError('An account with this email already exists.');
      } else {
        setSubmitError('Registration failed. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        {registrationSuccess && registeredEmail && (
          <RegistrationSuccess 
            email={registeredEmail} 
            onClose={() => setRegistrationSuccess(false)} 
          />
        )}
        <div>
          <h2 className={styles.title}>Create a new account</h2>
          <div className={styles.linkRow}>
            <p className={styles.subtitle}>
              Already have an account?{' '}
              <Link
                to="/login"
                className={styles.link}
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>

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
              <label htmlFor="email" className={styles.inputLabel}>
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
                placeholder="you@example.com"
              />
              {errors.email && (
                <p className={styles.errorMsg}>{errors.email}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className={styles.inputLabel}>
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                value={formData.password}
                onChange={handleChange}
                className={`${styles.input} ${errors.password ? styles.inputError : ''}`}
                placeholder="••••••••"
              />
              {errors.password && (
                <p className={styles.errorMsg}>{errors.password}</p>
              )}
              <p className={styles.infoMsg}>
                Password must be at least 6 characters long
              </p>
            </div>
          </div>

          <div className="mt-6">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating account...
                </>
              ) : 'Create account'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
