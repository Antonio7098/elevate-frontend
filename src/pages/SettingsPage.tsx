import React, { useState } from 'react';
import styles from './SettingsPage.module.css';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { FiEdit2, FiSave, FiUser, FiMail, FiCalendar, FiClock } from 'react-icons/fi';

const SettingsPage: React.FC = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || ''
  });

  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    push: true,
  });
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [success, setSuccess] = useState('');

  const { theme, toggleTheme } = useTheme();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement update profile logic
    console.log('Updating profile with:', formData);
    setIsEditing(false);
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setSuccess('Profile updated!');
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

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const memberSince = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
  });

  return (
    <form className={styles.container} onSubmit={handleSubmit}>
      <h1 className={styles.header}>Settings</h1>

      {/* Profile Section */}
      <div className={styles.formGroup}>
        <div className={styles.header}>
          <div>
            <h1 className={styles.sectionTitle}>Profile Settings</h1>
            <p className={styles.pageSubtitle}>Manage your account information</p>
          </div>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className={styles.button}
            >
              <FiEdit2 style={{ marginRight: '0.5rem' }} />
              Edit Profile
            </button>
          )}
        </div>

        <div className={styles.card}>
          {/* Profile Header */}
          <div className={styles.profileHeader}>
            <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
              <div style={{ position: 'relative' }}>
                <div className={styles.avatar}>
                  {user?.name ? getInitials(user.name) : 'U'}
                </div>
                {isEditing && (
                  <button className={styles.avatarEditBtn}>
                    <FiEdit2 size={16} style={{ color: '#cbd5e1' }} />
                  </button>
                )}
              </div>
              <div className={styles.profileInfo}>
                {isEditing ? (
                  <div className={styles.editProfileInfo}>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className={styles.input}
                      autoFocus
                    />
                    <div className={styles.profileMeta}>
                      <FiMail size={16} style={{ marginRight: '0.5rem' }} />
                      {user?.email}
                    </div>
                  </div>
                ) : (
                  <>
                    <h2 className={styles.profileName}>{user?.name || 'User'}</h2>
                    <p className={styles.profileEmail}>{user?.email || 'user@example.com'}</p>
                    <div className={styles.profileMeta} style={{ marginTop: '0.5rem' }}>
                      <FiCalendar size={16} style={{ marginRight: '0.375rem' }} />
                      Member since {memberSince}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Profile Details */}
          <div className={styles.details}>
            {isEditing ? (
              <div className={styles.editForm}>
                <div>
                  <h3 className={styles.sectionTitle}>Personal Information</h3>
                  <div className={styles.inputGroup}>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-1">
                        Full Name
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FiUser className="h-5 w-5 text-slate-400" />
                        </div>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          className={styles.inputWithIcon}
                          placeholder="Your full name"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-1">
                        Email Address
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FiMail className="h-5 w-5 text-slate-400" />
                        </div>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className={styles.inputWithIcon}
                          placeholder="your.email@example.com"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className={styles.buttonGroup}>
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      setFormData({
                        name: user?.name || '',
                        email: user?.email || ''
                      });
                    }}
                    className={styles.cancelBtn}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className={styles.saveBtn}
                  >
                    <div className="flex items-center">
                      <FiSave size={16} style={{ marginRight: '0.5rem' }} />
                      Save Changes
                    </div>
                  </button>
                </div>
              </div>
            ) : (
              <div style={{ borderTop: '1.5px solid var(--color-border)' }}>
                <div className="py-4">
                  <h3 className={styles.sectionTitle}>Account Information</h3>
                  <div className={styles.infoGrid}>
                    <div>
                      <h4 className={styles.infoLabel}>Full Name</h4>
                      <p className={styles.infoValue}>{user?.name || 'Not provided'}</p>
                    </div>
                    <div>
                      <h4 className={styles.infoLabel}>Email Address</h4>
                      <p className={styles.infoValue}>{user?.email || 'Not provided'}</p>
                    </div>
                    <div>
                      <h4 className={styles.infoLabel}>Member Since</h4>
                      <div className="flex items-center text-white">
                        <FiCalendar size={16} style={{ marginRight: '0.5rem', color: '#94a3b8' }} />
                        {memberSince}
                      </div>
                    </div>
                    <div>
                      <h4 className={styles.infoLabel}>Last Active</h4>
                      <div className="flex items-center text-white">
                        <FiClock size={16} style={{ marginRight: '0.5rem', color: '#94a3b8' }} />
                        Just now
                      </div>
                    </div>
                  </div>
                </div>
                <div className="py-4">
                  <h3 className={styles.sectionTitle}>Account Security</h3>
                  <div>
                    <button className="w-full flex justify-between items-center p-3 bg-slate-800/30 hover:bg-slate-800/50 rounded-lg transition-colors">
                      <div>
                        <h4 className={styles.infoLabel} style={{ color: 'var(--color-text-primary)', textAlign: 'left' }}>Change Password</h4>
                        <p className={styles.profileMeta} style={{ fontSize: '0.85rem', marginTop: '0.3rem', textAlign: 'left' }}>Update your account password</p>
                      </div>
                      <svg style={{ height: 20, width: 20, color: 'var(--color-text-muted)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                    <button className="w-full flex justify-between items-center p-3 bg-slate-800/30 hover:bg-slate-800/50 rounded-lg transition-colors">
                      <div>
                        <h4 className={styles.infoLabel} style={{ color: 'var(--color-text-primary)', textAlign: 'left' }}>Two-Factor Authentication</h4>
                        <p className={styles.profileMeta} style={{ fontSize: '0.85rem', marginTop: '0.3rem', textAlign: 'left' }}>Add an extra layer of security</p>
                      </div>
                      <svg style={{ height: 20, width: 20, color: 'var(--color-text-muted)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
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
