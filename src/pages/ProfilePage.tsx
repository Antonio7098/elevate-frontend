import { useState } from 'react';
import styles from './ProfilePage.module.css';
import { useAuth } from '../context/useAuth';
import { FiEdit2, FiSave, FiUser, FiMail, FiCalendar, FiClock, FiAward, FiTarget, FiBookOpen, FiTrendingUp } from 'react-icons/fi';

const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    dailyStudyTimeMinutes: 30,
    primaryGoal: 'Master new concepts effectively',
    cognitiveApproach: 'ADAPTIVE',
    explanationStyle: 'PRACTICAL_EXAMPLES'
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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

  // Mock data - in real app, this would come from API
  const mockStats = {
    totalStudyTime: 45,
    conceptsReviewed: 127,
    conceptsMastered: 89,
    averageMasteryScore: 0.87,
    currentStreak: 12,
    totalAchievements: 23
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.pageTitle}>Profile</h1>
          <p className={styles.pageSubtitle}>Your learning journey and achievements</p>
        </div>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className={styles.editButton}
          >
            <FiEdit2 style={{ marginRight: '0.5rem' }} />
            Edit Profile
          </button>
        )}
      </div>

      <div className={styles.profileGrid}>
        {/* Profile Header Card */}
        <div className={styles.profileHeaderCard}>
          <div className={styles.profileHeader}>
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

        {/* Stats Overview Card */}
        <div className={styles.statsCard}>
          <h3 className={styles.cardTitle}>Learning Statistics</h3>
          <div className={styles.statsGrid}>
            <div className={styles.statItem}>
              <div className={styles.statIcon}>
                <FiClock />
              </div>
              <div className={styles.statContent}>
                <div className={styles.statValue}>{mockStats.totalStudyTime}h</div>
                <div className={styles.statLabel}>Total Study Time</div>
              </div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statIcon}>
                <FiBookOpen />
              </div>
              <div className={styles.statContent}>
                <div className={styles.statValue}>{mockStats.conceptsReviewed}</div>
                <div className={styles.statLabel}>Concepts Reviewed</div>
              </div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statIcon}>
                <FiAward />
              </div>
              <div className={styles.statContent}>
                <div className={styles.statValue}>{mockStats.conceptsMastered}</div>
                <div className={styles.statLabel}>Concepts Mastered</div>
              </div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statIcon}>
                <FiTrendingUp />
              </div>
              <div className={styles.statContent}>
                <div className={styles.statValue}>{Math.round(mockStats.averageMasteryScore * 100)}%</div>
                <div className={styles.statLabel}>Avg Mastery Score</div>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Details Card */}
        <div className={styles.detailsCard}>
          {isEditing ? (
            <form onSubmit={handleSubmit} className={styles.editForm}>
              <div className={styles.formSection}>
                <h3 className={styles.sectionTitle}>Personal Information</h3>
                <div className={styles.formGrid}>
                  <div className={styles.formField}>
                    <label className={styles.label}>Full Name</label>
                    <div className={styles.inputWrapper}>
                      <div className={styles.inputIcon}>
                        <FiUser size={20} />
                      </div>
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
                      <div className={styles.inputIcon}>
                        <FiMail size={20} />
                      </div>
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

              <div className={styles.formSection}>
                <h3 className={styles.sectionTitle}>Learning Preferences</h3>
                <div className={styles.formGrid}>
                  <div className={styles.formField}>
                    <label className={styles.label}>Daily Study Goal (minutes)</label>
                    <input
                      type="number"
                      name="dailyStudyTimeMinutes"
                      value={formData.dailyStudyTimeMinutes}
                      onChange={handleInputChange}
                      className={styles.input}
                      min="15"
                      max="480"
                      step="15"
                    />
                    <p className={styles.helpText}>Set your daily study time target</p>
                  </div>
                  <div className={styles.formField}>
                    <label className={styles.label}>Primary Learning Goal</label>
                    <input
                      type="text"
                      name="primaryGoal"
                      value={formData.primaryGoal}
                      onChange={handleInputChange}
                      className={styles.input}
                      placeholder="e.g., Master new concepts effectively"
                    />
                  </div>
                  <div className={styles.formField}>
                    <label className={styles.label}>Cognitive Approach</label>
                    <select
                      name="cognitiveApproach"
                      value={formData.cognitiveApproach}
                      onChange={handleInputChange}
                      className={styles.select}
                    >
                      <option value="TOP_DOWN">Top-Down (Concept to Details)</option>
                      <option value="BOTTOM_UP">Bottom-Up (Details to Concept)</option>
                      <option value="ADAPTIVE">Adaptive (Dynamic)</option>
                    </select>
                  </div>
                  <div className={styles.formField}>
                    <label className={styles.label}>Preferred Explanation Style</label>
                    <select
                      name="explanationStyle"
                      value={formData.explanationStyle}
                      onChange={handleInputChange}
                      className={styles.select}
                    >
                      <option value="ANALOGY_DRIVEN">Analogy-Driven</option>
                      <option value="PRACTICAL_EXAMPLES">Practical Examples</option>
                      <option value="TEXTUAL_DETAILED">Textual Detailed</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className={styles.buttonRow}>
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setFormData({
                      name: user?.name || '',
                      email: user?.email || '',
                      dailyStudyTimeMinutes: 30,
                      primaryGoal: 'Master new concepts effectively',
                      cognitiveApproach: 'ADAPTIVE',
                      explanationStyle: 'PRACTICAL_EXAMPLES'
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
                  <div className={styles.buttonContent}>
                    <FiSave size={16} />
                    Save Changes
                  </div>
                </button>
              </div>
            </form>
          ) : (
            <div className={styles.profileDetails}>
              <div className={styles.detailSection}>
                <h3 className={styles.sectionTitle}>Personal Information</h3>
                <div className={styles.infoGrid}>
                  <div className={styles.infoItem}>
                    <h4 className={styles.infoLabel}>Full Name</h4>
                    <p className={styles.infoValue}>{user?.name || 'Not provided'}</p>
                  </div>
                  <div className={styles.infoItem}>
                    <h4 className={styles.infoLabel}>Email Address</h4>
                    <p className={styles.infoValue}>{user?.email || 'Not provided'}</p>
                  </div>
                  <div className={styles.infoItem}>
                    <h4 className={styles.infoLabel}>Member Since</h4>
                    <div className={styles.infoValueWithIcon}>
                      <FiCalendar size={16} />
                      {memberSince}
                    </div>
                  </div>
                  <div className={styles.infoItem}>
                    <h4 className={styles.infoLabel}>Last Active</h4>
                    <div className={styles.infoValueWithIcon}>
                      <FiClock size={16} />
                      Just now
                    </div>
                  </div>
                </div>
              </div>

              <div className={styles.detailSection}>
                <h3 className={styles.sectionTitle}>Learning Preferences</h3>
                <div className={styles.infoGrid}>
                  <div className={styles.infoItem}>
                    <h4 className={styles.infoLabel}>Daily Study Goal</h4>
                    <p className={styles.infoValue}>{formData.dailyStudyTimeMinutes} minutes</p>
                  </div>
                  <div className={styles.infoItem}>
                    <h4 className={styles.infoLabel}>Primary Goal</h4>
                    <p className={styles.infoValue}>{formData.primaryGoal}</p>
                  </div>
                  <div className={styles.infoItem}>
                    <h4 className={styles.infoLabel}>Cognitive Approach</h4>
                    <p className={styles.infoValue}>
                      {formData.cognitiveApproach === 'TOP_DOWN' && 'Top-Down (Concept to Details)'}
                      {formData.cognitiveApproach === 'BOTTOM_UP' && 'Bottom-Up (Details to Concept)'}
                      {formData.cognitiveApproach === 'ADAPTIVE' && 'Adaptive (Dynamic)'}
                    </p>
                  </div>
                  <div className={styles.infoItem}>
                    <h4 className={styles.infoLabel}>Explanation Style</h4>
                    <p className={styles.infoValue}>
                      {formData.explanationStyle === 'ANALOGY_DRIVEN' && 'Analogy-Driven'}
                      {formData.explanationStyle === 'PRACTICAL_EXAMPLES' && 'Practical Examples'}
                      {formData.explanationStyle === 'TEXTUAL_DETAILED' && 'Textual Detailed'}
                    </p>
                  </div>
                </div>
              </div>

              <div className={styles.detailSection}>
                <h3 className={styles.sectionTitle}>Account Security</h3>
                <div className={styles.securityActions}>
                  <button className={styles.securityButton}>
                    <div className={styles.securityButtonContent}>
                      <h4 className={styles.securityButtonTitle}>Change Password</h4>
                      <p className={styles.securityButtonDescription}>Update your account password</p>
                    </div>
                    <svg style={{ height: 20, width: 20, color: 'var(--color-text-muted)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                  <button className={styles.securityButton}>
                    <div className={styles.securityButtonContent}>
                      <h4 className={styles.securityButtonTitle}>Two-Factor Authentication</h4>
                      <p className={styles.securityButtonDescription}>Add an extra layer of security</p>
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
  );
};

export default ProfilePage;
