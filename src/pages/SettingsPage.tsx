import { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './SettingsPage.module.css';
import { useAuth } from '../context/useAuth';
import { 
  FiUser, 
  FiMail, 
  FiCalendar, 
  FiClock, 
  FiLock, 
  FiCreditCard, 
  FiBell, 
  FiBookOpen, 
  FiShield, 
  FiDownload, 
  FiTrash2, 
  FiSave, 
  FiEdit2,
  FiEye,
  FiEyeOff,
  FiCheck,
  FiX
} from 'react-icons/fi';

interface UserPreferences {
  // Learning preferences
  cognitiveApproach: 'TOP_DOWN' | 'BOTTOM_UP' | 'ADAPTIVE';
  explanationStyles: string[];
  interactionStyle: 'DIRECT' | 'SOCRATIC';
  
  // Study settings
  bucketSize: number;
  reviewInterval: number;
  trackingIntensity: 'DENSE' | 'NORMAL' | 'SPARSE';
  
  // Notifications
  emailNotifications: boolean;
  pushNotifications: boolean;
  studyReminders: boolean;
  reviewReminders: boolean;
  
  // Privacy
  shareProgress: boolean;
  shareAnalytics: boolean;
}

const SettingsPage: React.FC = () => {
  const { user } = useAuth();
  
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [preferences, setPreferences] = useState<UserPreferences>({
    cognitiveApproach: 'ADAPTIVE',
    explanationStyles: ['PRACTICAL_EXAMPLES'],
    interactionStyle: 'DIRECT',
    bucketSize: 10,
    reviewInterval: 1,
    trackingIntensity: 'NORMAL',
    emailNotifications: true,
    pushNotifications: true,
    studyReminders: true,
    reviewReminders: true,
    shareProgress: false,
    shareAnalytics: false,
  });

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePreferenceChange = (key: keyof UserPreferences, value: any) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      // TODO: Implement API call to update user preferences
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      setIsEditing(false);
      // TODO: Show success message
    } catch (error) {
      // TODO: Handle error
      console.error('Failed to save preferences:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently lost.')) {
      setDeleting(true);
      setTimeout(() => {
        setDeleting(false);
        alert('Account deleted (demo only).');
      }, 1500);
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: FiUser },
    { id: 'learning', label: 'Learning', icon: FiBookOpen },
    { id: 'study', label: 'Study', icon: FiBookOpen },
    { id: 'notifications', label: 'Notifications', icon: FiBell },
    { id: 'billing', label: 'Billing', icon: FiCreditCard },
    { id: 'privacy', label: 'Privacy', icon: FiShield },
    { id: 'data', label: 'Data', icon: FiDownload },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div className={styles.tabContent}>
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>Personal Information</h3>
              <div className={styles.formGrid}>
                <div className={styles.formField}>
                  <label className={styles.label}>Full Name</label>
                  <div className={styles.inputWrapper}>
                    <FiUser className={styles.inputIcon} />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className={styles.input}
                      placeholder="Enter your full name"
                    />
                  </div>
                </div>
                <div className={styles.formField}>
                  <label className={styles.label}>Email Address</label>
                  <div className={styles.inputWrapper}>
                    <FiMail className={styles.inputIcon} />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={styles.input}
                      placeholder="Email address"
                      disabled
                    />
                  </div>
                  <p className={styles.helpText}>Contact support to change your email address</p>
                </div>
              </div>
            </div>

            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>Account Security</h3>
              <div className={styles.formGrid}>
                <div className={styles.formField}>
                  <label className={styles.label}>Current Password</label>
                  <div className={styles.inputWrapper}>
                    <FiLock className={styles.inputIcon} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="currentPassword"
                      value={formData.currentPassword}
                      onChange={handleInputChange}
                      className={styles.input}
                      placeholder="Enter current password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className={styles.passwordToggle}
                    >
                      {showPassword ? <FiEyeOff /> : <FiEye />}
                    </button>
                  </div>
                </div>
                <div className={styles.formField}>
                  <label className={styles.label}>New Password</label>
                  <div className={styles.inputWrapper}>
                    <FiLock className={styles.inputIcon} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="newPassword"
                      value={formData.newPassword}
                      onChange={handleInputChange}
                      className={styles.input}
                      placeholder="Enter new password"
                    />
                  </div>
                </div>
                <div className={styles.formField}>
                  <label className={styles.label}>Confirm New Password</label>
                  <div className={styles.inputWrapper}>
                    <FiLock className={styles.inputIcon} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className={styles.input}
                      placeholder="Confirm new password"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'learning':
        return (
          <div className={styles.tabContent}>
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>Learning Approach</h3>
              <div className={styles.formGrid}>
                <div className={styles.formField}>
                  <label className={styles.label}>Cognitive Approach</label>
                  <select
                    value={preferences.cognitiveApproach}
                    onChange={(e) => handlePreferenceChange('cognitiveApproach', e.target.value)}
                    className={styles.select}
                  >
                    <option value="TOP_DOWN">Top-Down (Concept to Details)</option>
                    <option value="BOTTOM_UP">Bottom-Up (Details to Concept)</option>
                    <option value="ADAPTIVE">Adaptive (Dynamic)</option>
                  </select>
                </div>
                <div className={styles.formField}>
                  <label className={styles.label}>Explanation Style</label>
                  <div className={styles.checkboxGroup}>
                    {['ANALOGY_DRIVEN', 'PRACTICAL_EXAMPLES', 'TEXTUAL_DETAILED'].map(style => (
                      <label key={style} className={styles.checkboxLabel}>
                        <input
                          type="checkbox"
                          checked={preferences.explanationStyles.includes(style)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              handlePreferenceChange('explanationStyles', [...preferences.explanationStyles, style]);
                            } else {
                              handlePreferenceChange('explanationStyles', preferences.explanationStyles.filter(s => s !== style));
                            }
                          }}
                          className={styles.checkbox}
                        />
                        <span className={styles.checkboxText}>
                          {style.replace('_', ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
                <div className={styles.formField}>
                  <label className={styles.label}>Interaction Style</label>
                  <select
                    value={preferences.interactionStyle}
                    onChange={(e) => handlePreferenceChange('interactionStyle', e.target.value)}
                    className={styles.select}
                  >
                    <option value="DIRECT">Direct (Straightforward)</option>
                    <option value="SOCRATIC">Socratic (Question-Based)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        );

      case 'study':
        return (
          <div className={styles.tabContent}>
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>Study Configuration</h3>
              <div className={styles.formGrid}>
                <div className={styles.formField}>
                  <label className={styles.label}>Review Bucket Size</label>
                  <input
                    type="number"
                    min="5"
                    max="50"
                    value={preferences.bucketSize}
                    onChange={(e) => handlePreferenceChange('bucketSize', parseInt(e.target.value))}
                    className={styles.input}
                  />
                  <p className={styles.helpText}>Number of items to review in each session</p>
                </div>
                <div className={styles.formField}>
                  <label className={styles.label}>Review Interval (days)</label>
                  <input
                    type="number"
                    min="1"
                    max="30"
                    value={preferences.reviewInterval}
                    onChange={(e) => handlePreferenceChange('reviewInterval', parseInt(e.target.value))}
                    className={styles.input}
                  />
                  <p className={styles.helpText}>How often to schedule reviews</p>
                </div>
                <div className={styles.formField}>
                  <label className={styles.label}>Tracking Intensity</label>
                  <select
                    value={preferences.trackingIntensity}
                    onChange={(e) => handlePreferenceChange('trackingIntensity', e.target.value)}
                    className={styles.select}
                  >
                    <option value="DENSE">Dense (Detailed tracking)</option>
                    <option value="NORMAL">Normal (Balanced)</option>
                    <option value="SPARSE">Sparse (Minimal tracking)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        );

      case 'notifications':
        return (
          <div className={styles.tabContent}>
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>Notification Preferences</h3>
              <div className={styles.formGrid}>
                <div className={styles.formField}>
                  <label className={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      checked={preferences.emailNotifications}
                      onChange={(e) => handlePreferenceChange('emailNotifications', e.target.checked)}
                      className={styles.checkbox}
                    />
                    <span className={styles.checkboxText}>Email Notifications</span>
                  </label>
                  <p className={styles.helpText}>Receive updates and reminders via email</p>
                </div>
                <div className={styles.formField}>
                  <label className={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      checked={preferences.pushNotifications}
                      onChange={(e) => handlePreferenceChange('pushNotifications', e.target.checked)}
                      className={styles.checkbox}
                    />
                    <span className={styles.checkboxText}>Push Notifications</span>
                  </label>
                  <p className={styles.helpText}>Receive real-time notifications in your browser</p>
                </div>
                <div className={styles.formField}>
                  <label className={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      checked={preferences.studyReminders}
                      onChange={(e) => handlePreferenceChange('studyReminders', e.target.checked)}
                      className={styles.checkbox}
                    />
                    <span className={styles.checkboxText}>Study Reminders</span>
                  </label>
                  <p className={styles.helpText}>Get reminded about scheduled study sessions</p>
                </div>
                <div className={styles.formField}>
                  <label className={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      checked={preferences.reviewReminders}
                      onChange={(e) => handlePreferenceChange('reviewReminders', e.target.checked)}
                      className={styles.checkbox}
                    />
                    <span className={styles.checkboxText}>Review Reminders</span>
                  </label>
                  <p className={styles.helpText}>Get reminded about items due for review</p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'billing':
        return (
          <div className={styles.tabContent}>
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>Subscription Information</h3>
              <div className={styles.billingCard}>
                <div className={styles.billingHeader}>
                  <div className={styles.planInfo}>
                    <h4 className={styles.planName}>Free Plan</h4>
                    <p className={styles.planDescription}>Basic features with limited access</p>
                  </div>
                  <div className={styles.planStatus}>
                    <span className={styles.statusBadge}>Active</span>
                  </div>
                </div>
                <div className={styles.billingDetails}>
                  <div className={styles.billingRow}>
                    <span>Current Plan:</span>
                    <span>Free</span>
                  </div>
                  <div className={styles.billingRow}>
                    <span>Next Billing:</span>
                    <span>N/A</span>
                  </div>
                  <div className={styles.billingRow}>
                    <span>Payment Method:</span>
                    <span>None</span>
                  </div>
                </div>
                <button className={styles.upgradeButton}>
                  Upgrade to Premium
                </button>
              </div>
            </div>
          </div>
        );

      case 'privacy':
        return (
          <div className={styles.tabContent}>
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>Privacy Settings</h3>
              <div className={styles.formGrid}>
                <div className={styles.formField}>
                  <label className={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      checked={preferences.shareProgress}
                      onChange={(e) => handlePreferenceChange('shareProgress', e.target.checked)}
                      className={styles.checkbox}
                    />
                    <span className={styles.checkboxText}>Share Learning Progress</span>
                  </label>
                  <p className={styles.helpText}>Allow others to see your learning achievements</p>
                </div>
                <div className={styles.formField}>
                  <label className={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      checked={preferences.shareAnalytics}
                      onChange={(e) => handlePreferenceChange('shareAnalytics', e.target.checked)}
                      className={styles.checkbox}
                    />
                    <span className={styles.checkboxText}>Share Analytics Data</span>
                  </label>
                  <p className={styles.helpText}>Help improve the platform with anonymous usage data</p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'data':
        return (
          <div className={styles.tabContent}>
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>Data Management</h3>
              <div className={styles.formGrid}>
                <div className={styles.formField}>
                  <button className={styles.dataButton}>
                    <FiDownload className={styles.buttonIcon} />
                    Export My Data
                  </button>
                  <p className={styles.helpText}>Download all your learning data and progress</p>
                </div>
                <div className={styles.formField}>
                  <button className={styles.dataButton}>
                    <FiDownload className={styles.buttonIcon} />
                    Export Learning Analytics
                  </button>
                  <p className={styles.helpText}>Download detailed learning analytics and insights</p>
                </div>
              </div>
            </div>

            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>Danger Zone</h3>
              <div className={styles.dangerZone}>
                <div className={styles.dangerContent}>
                  <div>
                    <h4 className={styles.dangerTitle}>Delete Account</h4>
                    <p className={styles.dangerDescription}>
                      Permanently delete your account and all associated data. This action cannot be undone.
                    </p>
                  </div>
                  <button
                    onClick={handleDelete}
                    disabled={deleting}
                    className={styles.deleteButton}
                  >
                    {deleting ? (
                      <>
                        <FiX className={styles.buttonIcon} />
                        Deleting...
                      </>
                    ) : (
                      <>
                        <FiTrash2 className={styles.buttonIcon} />
                        Delete Account
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.pageTitle}>Settings</h1>
          <p className={styles.pageSubtitle}>Customize your learning experience and manage your account</p>
        </div>
        {isEditing && (
          <div className={styles.headerActions}>
            <button
              onClick={() => setIsEditing(false)}
              className={styles.cancelButton}
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={saving}
              className={styles.saveButton}
            >
              {saving ? (
                <>
                  <FiSave className={styles.buttonIcon} />
                  Saving...
                </>
              ) : (
                <>
                  <FiSave className={styles.buttonIcon} />
                  Save Changes
                </>
              )}
            </button>
          </div>
        )}
      </div>

      <div className={styles.content}>
        <div className={styles.sidebar}>
          <nav className={styles.tabNavigation}>
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`${styles.tabButton} ${activeTab === tab.id ? styles.activeTab : ''}`}
                >
                  <Icon className={styles.tabIcon} />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        <div className={styles.mainContent}>
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
