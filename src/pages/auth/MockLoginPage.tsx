import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMockAuth } from '../../hooks/useMockAuth';
import styles from './MockLoginPage.module.css';

const MockLoginPage: React.FC = () => {
  const [selectedUser, setSelectedUser] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const { mockLogin, getAvailableMockUsers } = useMockAuth();
  const navigate = useNavigate();

  const mockUsers = getAvailableMockUsers();

  const handleMockLogin = async () => {
    if (!selectedUser) return;
    
    setIsLoading(true);
    try {
      const user = mockUsers.find(u => u.email === selectedUser);
      if (user) {
        await mockLogin(user.email, user.password);
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Mock login failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickLogin = async (email: string) => {
    setIsLoading(true);
    try {
      await mockLogin(email, 'password');
      navigate('/dashboard');
    } catch (error) {
      console.error('Quick login failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.mockLoginPage}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>Mock Authentication</h1>
          <p className={styles.subtitle}>
            Use these mock users to test the blueprint system without the Core API
          </p>
        </div>

        <div className={styles.mockUsersSection}>
          <h2 className={styles.sectionTitle}>Available Mock Users</h2>
          <div className={styles.userGrid}>
            {mockUsers.map((user) => (
              <div key={user.email} className={styles.userCard}>
                <div className={styles.userInfo}>
                  <h3 className={styles.userName}>{user.name}</h3>
                  <p className={styles.userEmail}>{user.email}</p>
                  <span className={`${styles.userRole} ${styles[user.role]}`}>
                    {user.role}
                  </span>
                </div>
                <div className={styles.userActions}>
                  <button
                    onClick={() => handleQuickLogin(user.email)}
                    disabled={isLoading}
                    className={styles.quickLoginBtn}
                  >
                    {isLoading ? 'Logging in...' : 'Quick Login'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.loginSection}>
          <h2 className={styles.sectionTitle}>Custom Login</h2>
          <div className={styles.loginForm}>
            <select
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              className={styles.userSelect}
              disabled={isLoading}
            >
              <option value="">Select a mock user</option>
              {mockUsers.map((user) => (
                <option key={user.email} value={user.email}>
                  {user.name} ({user.email})
                </option>
              ))}
            </select>
            
            <button
              onClick={handleMockLogin}
              disabled={!selectedUser || isLoading}
              className={styles.loginBtn}
            >
              {isLoading ? 'Logging in...' : 'Login with Selected User'}
            </button>
          </div>
        </div>

        <div className={styles.infoSection}>
          <h2 className={styles.sectionTitle}>How to Use</h2>
          <div className={styles.infoGrid}>
            <div className={styles.infoCard}>
              <h4>Quick Login</h4>
              <p>Click "Quick Login" on any user card to instantly sign in</p>
            </div>
            <div className={styles.infoCard}>
              <h4>Custom Login</h4>
              <p>Select a user from the dropdown and click "Login with Selected User"</p>
            </div>
            <div className={styles.infoCard}>
              <h4>Password</h4>
              <p>All mock users use "password" as their password</p>
            </div>
            <div className={styles.infoCard}>
              <h4>Data</h4>
              <p>Each user has access to the same mock blueprint data for testing</p>
            </div>
          </div>
        </div>

        <div className={styles.note}>
          <p>
            <strong>Note:</strong> This is a development-only feature. In production, 
            users will authenticate through the Core API.
          </p>
        </div>
      </div>
    </div>
  );
};

export default MockLoginPage;





