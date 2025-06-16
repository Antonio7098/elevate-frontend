import { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './SettingsPage.module.css';
import { useTheme } from '../context/ThemeContext';


const SettingsPage: React.FC = () => {

  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    push: true,
  });
  const [saving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const { theme, toggleTheme } = useTheme();



  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      setDeleting(true);
      setTimeout(() => {
        setDeleting(false);
        alert('Account deleted (demo only).');
      }, 1500);
    }
  };





  return (
    <div className={styles.container}>
      <h1 className={styles.header}>Settings</h1>

      {/* Profile Section */}
      <div className={styles.formGroup}>
        <div className={styles.sectionTitle}>Profile</div>
        <p>View and edit your public profile information.</p>
        <Link to="/profile" className={styles.button}>
          Go to Profile
        </Link>
      </div>

      {/* Theme Section */}
      <div className={styles.formGroup}>
        <div className={styles.sectionTitle}>Theme</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span className={styles.label} id="theme-desc">
            {theme === 'dark' ? '🌙 Dark Mode' : '☀️ Light Mode'}
          </span>
          <button
            type="button"
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            aria-describedby="theme-desc"
            className={styles.button}
            style={{ minWidth: 120 }}
            onClick={toggleTheme}
          >
            Switch to {theme === 'dark' ? 'Light' : 'Dark'}
          </button>
        </div>
      </div>

      {/* Notifications Section */}
      <div className={styles.formGroup}>
        <div className={styles.sectionTitle}>Notification Preferences</div>
        <label className={styles.label}>
          <input
            type="checkbox"
            checked={notifications.email}
            onChange={e => setNotifications(n => ({ ...n, email: e.target.checked }))}
          />
          &nbsp; Email Notifications
        </label>
        <label className={styles.label}>
          <input
            type="checkbox"
            checked={notifications.sms}
            onChange={e => setNotifications(n => ({ ...n, sms: e.target.checked }))}
          />
          &nbsp; SMS Notifications
        </label>
        <label className={styles.label}>
          <input
            type="checkbox"
            checked={notifications.push}
            onChange={e => setNotifications(n => ({ ...n, push: e.target.checked }))}
          />
          &nbsp; Push Notifications
        </label>
      </div>

      {/* Actions Section */}
      <div className={styles.buttonRow}>
        <button type="button" className={styles.button} disabled={saving} onClick={() => { /* logic to save settings */ }}>
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
        <button type="button" className={`${styles.button} ${styles.danger}`} onClick={handleDelete} disabled={deleting}>
          {deleting ? 'Deleting...' : 'Delete Account'}
        </button>
      </div>

    </div>
  );
};

export default SettingsPage;
