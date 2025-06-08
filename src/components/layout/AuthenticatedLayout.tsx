import { Outlet } from 'react-router-dom';
import { useEffect, useState } from 'react';
import type { FC, ReactNode } from 'react';
import Sidebar from './Sidebar';
import styles from './AuthenticatedLayout.module.css';

interface AuthenticatedLayoutProps {
  children?: ReactNode;
}

const AuthenticatedLayout: FC<AuthenticatedLayoutProps> = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Check if the viewport is mobile size
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    // Initial check
    checkIfMobile();

    // Add event listener for window resize
    window.addEventListener('resize', checkIfMobile);

    // Cleanup
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  // Close sidebar when clicking outside on mobile
  const handleBackdropClick = () => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  // Toggle sidebar (for mobile menu button)
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className={styles.root}>
      {/* Mobile Menu Button */}
      {isMobile && (
        <button
          className={styles.menuButton}
          onClick={toggleSidebar}
          aria-label={sidebarOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={sidebarOpen}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="4" y1="12" x2="20" y2="12" />
            <line x1="4" y1="6" x2="20" y2="6" />
            <line x1="4" y1="18" x2="20" y2="18" />
          </svg>
        </button>
      )}

      {/* Sidebar */}
      <div 
        className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : ''}`}
        onMouseEnter={() => !isMobile && setSidebarOpen(true)}
        onMouseLeave={() => !isMobile && setSidebarOpen(false)}
      >
        <Sidebar onNavigate={() => isMobile && setSidebarOpen(false)} />
      </div>

      {/* Backdrop for mobile */}
      {isMobile && sidebarOpen && (
        <div 
          className={styles.sidebarBackdrop} 
          onClick={handleBackdropClick}
          role="button"
          tabIndex={0}
          aria-label="Close menu"
          onKeyDown={(e) => e.key === 'Enter' && handleBackdropClick()}
        />
      )}

      {/* Main Content */}
      <main className={`${styles.main} ${sidebarOpen && !isMobile ? styles.mainShifted : ''}`}>
        <div className={styles.content}>
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AuthenticatedLayout;
