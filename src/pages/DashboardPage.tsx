import React, { useEffect, useState } from 'react';
import { getDashboardData } from '../services/dashboardService';
import type { DashboardData } from '../types/dashboard.types';
import TodaysTasksWidget from '../components/dashboard/TodaysTasksWidget';
import RecentProgressWidget from '../components/dashboard/RecentProgressWidget';
import StatsSummaryWidget from '../components/dashboard/StatsSummaryWidget';
import styles from './DashboardPage.module.css';

const DashboardPage: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsLoading(true);
    setError(null);
    getDashboardData()
      .then((data) => {
        setDashboardData(data);
        setIsLoading(false);
      })
      .catch((err) => {
        setError(err?.message || 'Failed to load dashboard data.');
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <div style={{ border: '4px solid #e5e7eb', borderTop: '4px solid #6366f1', borderRadius: '50%', width: 48, height: 48, animation: 'spin 1s linear infinite' }} />
        <style>{'@keyframes spin { to { transform: rotate(360deg); } }'}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ color: '#b91c1c', textAlign: 'center', marginTop: 32 }}>
        <p>Failed to load dashboard: {error}</p>
      </div>
    );
  }

  return (
    <div>
      <div className={styles.welcome}>Welcome back, Antonio!</div>
      <div className={styles.dashboardContainer}>
        <TodaysTasksWidget dueToday={dashboardData?.dueToday || []} />
        <RecentProgressWidget recentProgress={dashboardData?.recentProgress || []} />
        <StatsSummaryWidget overallStats={dashboardData?.overallStats || null} />
      </div>
      <pre style={{ marginTop: '2rem', background: '#f9f9f9', padding: '1rem', borderRadius: '8px' }}>{JSON.stringify(dashboardData, null, 2)}</pre>
    </div>
  );
};

export default DashboardPage;