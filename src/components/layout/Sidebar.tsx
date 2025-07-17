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
  FiCpu
} from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';

interface NavigationItem {
  name: string;
  href: string;
  icon: React.ReactNode;
}

interface SidebarProps {
  onNavigate?: () => void;
}

import styles from './Sidebar.module.css';

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

  const navigationItems: NavigationItem[] = [
    { name: 'Dashboard', href: '/dashboard', icon: <FiHome className={iconClassName} /> },
    { name: 'Folders', href: '/folders', icon: <FiFolder className={iconClassName} /> },
    { name: 'Review', href: '/review', icon: <FiBookOpen className={iconClassName} /> },
    { name: 'AI Chat', href: '/chat', icon: <FiMessageSquare className={iconClassName} /> },
    { name: 'My Progress', href: '/my-progress', icon: <FiBarChart2 className={iconClassName} /> },
  ];

  const bottomNavItems: NavigationItem[] = [
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
        {navigationItems.map((item) => (
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
          {/* Settings NavLink */}
          {bottomNavItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`
              }
              title={item.name}
            >
              <span className={styles.icon}>{item.icon}</span>
              <span className={styles.linkText}>{item.name}</span>
            </NavLink>
          ))}
          
          {/* User Profile */}
          <div className={styles.profileArea}>
            {/* User Profile Clickable Area */}
            <div className={styles.profileBtn} title={user?.name || 'User'}>
              <div className={styles.profileText}>
                <p style={{ fontSize: '0.875rem', fontWeight: 500, color: '#fff' }}>{user?.name || 'User'}</p>
              </div>
            </div>
            
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