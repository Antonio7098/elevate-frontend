import React, { useState } from 'react';
import styles from './SettingsPage.module.css';

import { useTheme } from '../context/ThemeContext';

const SettingsPage: React.FC = () => {
  // Demo state for form fields
  const [email, setEmail] = useState('user@example.com');
  const [displayName, setDisplayName] = useState('Antonio');
  // Remove local theme state, use context
  const { theme, toggleTheme } = useTheme();
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    push: true,
  });
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [success, setSuccess] = useState('');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setSuccess('Settings saved!');
      setTimeout(() => setSuccess(''), 2000);
    }, 1200);
  };

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
    <form className={styles.container} onSubmit={handleSave}>
      <h1 className={styles.header}>Settings</h1>

      {/* Profile Section */}
      <div className={styles.formGroup}>
        <div className={styles.sectionTitle}>Profile</div>
        <label htmlFor="email" className={styles.label}>Email</label>
        <input
          id="email"
          type="email"
          className={styles.input}
          value={email}
          onChange={e => setEmail(e.target.value)}
          autoComplete="email"
        />
        <label htmlFor="displayName" className={styles.label}>Display Name</label>
        <input
          id="displayName"
          type="text"
          className={styles.input}
          value={displayName}
          onChange={e => setDisplayName(e.target.value)}
          autoComplete="name"
        />
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
        <button type="submit" className={styles.button} disabled={saving}>
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
        <button type="button" className={`${styles.button} ${styles.danger}`} onClick={handleDelete} disabled={deleting}>
          {deleting ? 'Deleting...' : 'Delete Account'}
        </button>
      </div>
      {success && <div style={{color: '#4ade80', marginTop: '1.5rem', fontWeight: 500}}>{success}</div>}
    </form>
  );
};

export default SettingsPage;
