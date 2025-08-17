import React from 'react';
import { Outlet } from 'react-router-dom';
import AuthenticatedLayout from '../components/layout/AuthenticatedLayout';
import BreadcrumbNavigation from '../components/navigation/BreadcrumbNavigation';
import MockDataIndicator from '../components/common/MockDataIndicator';
import styles from './BlueprintLayout.module.css';

const BlueprintLayout: React.FC = () => {
  return (
    <AuthenticatedLayout>
      {/* Breadcrumb Navigation */}
      <MockDataIndicator className={styles.mockDataIndicator} />
      <div className={styles.breadcrumbWrapper}>
        <BreadcrumbNavigation />
      </div>

      {/* Main Content */}
      <div className={styles.contentWrapper}>
        <Outlet />
      </div>
    </AuthenticatedLayout>
  );
};

export default BlueprintLayout;
