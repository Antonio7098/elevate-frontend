import { Outlet } from 'react-router-dom';
import type { FC, ReactNode } from 'react';
import Sidebar from './Sidebar';

interface AuthenticatedLayoutProps {
  children?: ReactNode;
}

import styles from './AuthenticatedLayout.module.css';

const AuthenticatedLayout: FC<AuthenticatedLayoutProps> = () => {
  return (
    <div className={styles.root}>
      <div className={styles.sidebar}>
        <Sidebar />
      </div>
      <div className={styles.main}>
        <div className={styles.content}>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthenticatedLayout;
