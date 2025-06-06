import { Outlet } from 'react-router-dom';
import type { FC, ReactNode } from 'react';
import Sidebar from './Sidebar';

interface AuthenticatedLayoutProps {
  children?: ReactNode;
}

import styles from './AuthenticatedLayout.module.css';

import { useState } from 'react';

const AuthenticatedLayout: FC<AuthenticatedLayoutProps> = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Only show menu button on mobile (≤600px)
  // Sidebar/backdrop use mobile overlay styles
  return (
    <div className={styles.root}>
      {/* Hamburger button (mobile only) */}
      <button
        className={styles.menuButton}
        aria-label={sidebarOpen ? 'Close menu' : 'Open menu'}
        style={{ display: 'none' }}
        onClick={() => setSidebarOpen((open) => !open)}
      >
        {/* Hamburger icon */}
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#222" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="4" y1="6" x2="20" y2="6" />
          <line x1="4" y1="12" x2="20" y2="12" />
          <line x1="4" y1="18" x2="20" y2="18" />
        </svg>
      </button>
      {/* Sidebar overlay for mobile */}
      <div
        className={sidebarOpen ? `${styles.sidebar} ${styles.sidebarOpen}` : styles.sidebar}
        tabIndex={-1}
        aria-hidden={!sidebarOpen}
      >
        <Sidebar />
      </div>
      {/* Backdrop overlay (mobile only, visible when sidebar open) */}
      {sidebarOpen && (
        <div
          className={styles.sidebarBackdrop}
          onClick={() => setSidebarOpen(false)}
          aria-label="Close menu"
          tabIndex={0}
          role="button"
        />
      )}
      <div className={styles.main}>
        <div className={styles.content}>
          <Outlet />
        </div>
      </div>
      {/* Show menu button only on mobile with JS (avoid SSR mismatch) */}
      <style>{`
        @media (max-width: 600px) {
          .${styles.menuButton} { display: flex !important; }
        }
      `}</style>
    </div>
  );
};

export default AuthenticatedLayout;
