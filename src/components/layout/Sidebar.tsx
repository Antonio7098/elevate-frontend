import React, { useCallback } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  FiHome, 
  FiFolder, 
  FiPlusCircle, 
  FiMessageSquare, 
  FiBarChart2,
  FiSettings,
  FiBookOpen,
  FiLogOut,
  FiMap,
  FiUser
} from 'react-icons/fi';
import { useAuth } from '../../context/useAuth';
import styles from './Sidebar.module.css';

interface NavigationItem {
  name: string;
  href: string;
  icon: React.ReactNode;
}

interface SidebarProps {
  onNavigate?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onNavigate }) => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  
  // Define a common class for icons if you want consistency
  const iconClassName: string = styles.icon;
  
  const handleLogout = useCallback(async () => {
    try {
      await logout();
      navigate('/login', { replace: true });
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  }, [logout, navigate]); 

  const handleProfileClick = useCallback(() => {
    navigate('/profile');
  }, [navigate]);

  const handleSettingsClick = useCallback(() => {
    navigate('/settings');
  }, [navigate]);

  const originalNavigationItems: NavigationItem[] = [
    { name: 'Dashboard', href: '/dashboard', icon: <FiHome className={iconClassName} /> },
    { name: 'Folders', href: '/folders', icon: <FiFolder className={iconClassName} /> },
    { name: 'Library', href: '/library', icon: <FiBookOpen className={iconClassName} /> },
    { name: 'My Progress', href: '/my-progress', icon: <FiBarChart2 className={iconClassName} /> },
    { name: 'Ideaspaces', href: '/blueprints', icon: <FiFolder className={iconClassName} /> },
  ];

  const blueprintNavigationItems: NavigationItem[] = [
    { name: 'Ideaspace Dashboard', href: '/blueprints/dashboard', icon: <FiHome className={iconClassName} /> },
    { name: 'Sections', href: '/blueprints/sections', icon: <FiFolder className={iconClassName} /> },
    { name: 'Mastery', href: '/blueprints/mastery', icon: <FiBarChart2 className={iconClassName} /> },
    { name: 'UUE Progression', href: '/blueprints/uue-progression', icon: <FiBookOpen className={iconClassName} /> },
    { name: 'Questions', href: '/blueprints/questions', icon: <FiMessageSquare className={iconClassName} /> },
    { name: 'Mind Map', href: '/blueprints/mindmap', icon: <FiMap className={iconClassName} /> },
    { name: 'Ideaspace', href: '/blueprints/ideaspace', icon: <FiMap className={iconClassName} /> },
    { name: 'Pathways', href: '/blueprints/pathways', icon: <FiMap className={iconClassName} /> },
    { name: 'Chat', href: '/blueprints/chat', icon: <FiMessageSquare className={iconClassName} /> },
  ];

  const utilityItems: NavigationItem[] = [
    { name: 'Mock Login', href: '/mock-login', icon: <FiLogOut className={iconClassName} /> },
  ];

  const bottomNavItems: NavigationItem[] = [
    { name: 'Profile', href: '/profile', icon: <FiUser className={iconClassName} /> },
    { name: 'Settings', href: '/settings', icon: <FiSettings className={iconClassName} /> },
  ];
  
  // The getIcon function is no longer needed with this approach

  return (
    <div className={styles.sidebar}>
      {/* Logo/Brand Area */}
      <div className={styles.logoArea}>
        <div className={styles.logoInner}>
          {/* Placeholder for your actual logo icon if you have one */}
          <div className={styles.logoIcon}>
            E 
          </div>
          <span className={styles.logoText}>
            Elevate
          </span>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className={styles.nav}>
        {/* Original Navigation Section */}
        <div className={styles.navSection}>
          <div className={styles.navSectionHeader}>Main Navigation</div>
          {originalNavigationItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`
              }
              title={item.name}
              onClick={onNavigate}
            >
              <span className={styles.icon}>{item.icon}</span>
              <span className={styles.linkText}>{item.name}</span>
            </NavLink>
          ))}
        </div>

        {/* Ideaspace Navigation Section */}
        <div className={styles.navSection}>
          <div className={styles.navSectionHeader}>Ideaspace System</div>
          {blueprintNavigationItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`
              }
              title={item.name}
              onClick={onNavigate}
            >
              <span className={styles.icon}>{item.icon}</span>
              <span className={styles.linkText}>{item.name}</span>
            </NavLink>
          ))}
        </div>

        {/* Utility Items */}
        <div className={styles.navSection}>
          <div className={styles.navSectionHeader}>Utilities</div>
          {utilityItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`
              }
              title={item.name}
              onClick={onNavigate}
            >
              <span className={styles.icon}>{item.icon}</span>
              <span className={styles.linkText}>{item.name}</span>
            </NavLink>
          ))}
        </div>
        
        {/* Create New Button */}
        <button
          type="button"
          className={styles.createBtn}
          title="Create New"
          onClick={() => navigate('/create')}
        >
          <FiPlusCircle className={iconClassName} />
          <span className={styles.linkText}>Create New</span>
        </button>
      </nav>

      {/* Bottom Navigation */}
      <div className={styles.bottom}>
        <div className={styles.bottomNav}>
          {/* Profile and Settings Buttons */}
          <button
            onClick={handleProfileClick}
            className={styles.navLink}
            title="Profile"
          >
            <span className={styles.icon}><FiUser className={iconClassName} /></span>
            <span className={styles.linkText}>Profile</span>
          </button>
          
          <button
            onClick={handleSettingsClick}
            className={styles.navLink}
            title="Settings"
          >
            <span className={styles.icon}><FiSettings className={iconClassName} /></span>
            <span className={styles.linkText}>Settings</span>
          </button>
          
          {/* User Profile */}
          <div className={styles.profileArea}>
            {/* User Profile Clickable Area */}
            <button
              onClick={handleProfileClick}
              className={styles.profileBtn}
              title={user?.name || 'User'}
            >
              <div className={styles.profileText}>
                <p style={{ fontSize: '0.875rem', fontWeight: 500, color: '#fff' }}>{user?.name || 'User'}</p>
              </div>
            </button>
            
            {/* Logout Button */}
            <button
              type="button"
              className={styles.logoutBtn}
              title="Logout"
              onClick={handleLogout}
            >
              <FiLogOut className={styles.logoutIcon} />
              <span className={styles.linkText}>
                Logout
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;