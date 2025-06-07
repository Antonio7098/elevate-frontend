import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDashboardData } from '../services/dashboardService';
import { getTodaysTasks } from '../services/todaysTasksService';
import type { DashboardData } from '../types/dashboard.types';
import TodaysTasksWidget from '../components/dashboard/TodaysTasksWidget';
import RecentProgressWidget from '../components/dashboard/RecentProgressWidget';
import StatsSummaryWidget from '../components/dashboard/StatsSummaryWidget';
import styles from './DashboardPage.module.css';

const DashboardPage: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isStartingTasks, setIsStartingTasks] = useState<boolean>(false);
  const [tasksError, setTasksError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleBeginTodaysTasks = async () => {
    console.log('[Dashboard] handleBeginTodaysTasks called');
    setIsStartingTasks(true);
    setTasksError(null);
    try {
      // Optional: pass a mockToday string for testing, e.g., getTodaysTasks('2023-10-27T10:00:00.000Z')
      // TEMP: Use mockToday param for backend testing. Remove after debugging.
      const data = await getTodaysTasks('2025-06-07T12:00:00.000Z');
      console.log('[Dashboard] GET /todays-tasks response:', data);
      let sessionQuestions = [
        ...(data.criticalQuestions || []),
        ...(data.coreQuestions || []),
        ...(data.plusQuestions || [])
      ];
      console.log('[Dashboard] Combined sessionQuestions:', sessionQuestions);
      console.log('[Dashboard] sessionQuestions.length:', sessionQuestions.length);
      console.log('[Dashboard] targetQuestionCount:', data.targetQuestionCount);
      // Use targetQuestionCount to limit session length if provided
      if (data.targetQuestionCount && sessionQuestions.length > data.targetQuestionCount) {
        sessionQuestions = sessionQuestions.slice(0, data.targetQuestionCount);
        console.log('[Dashboard] Sliced sessionQuestions to targetQuestionCount:', sessionQuestions.length);
      }
      if (!sessionQuestions.length) {
        setTasksError("No questions available for Today's Tasks.");
        setIsStartingTasks(false);
        return;
      }
      navigate('/review/today', {
        state: {
          questions: sessionQuestions,
          sessionTitle: "Today's Tasks Review"
        }
      });
      console.log('[Dashboard] navigate called to /review/today with questions:', sessionQuestions);
    } catch (err: any) {
      console.error('[Dashboard] Error in handleBeginTodaysTasks:', err);
      if (err?.response?.status === 401) {
        setTasksError('Session expired. Please log in again.');
        // Optionally, redirect to login page here
      } else if (err?.response?.status === 500) {
        setTasksError('Server error. Please try again later.');
      } else {
        setTasksError(err?.message || 'Failed to start Today\'s Tasks.');
      }
      setIsStartingTasks(false);
    }
  };

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

  // Debug: log dashboardData and tasksError on each render
  console.log('[Dashboard] dashboardData:', dashboardData);
  console.log('[Dashboard] tasksError:', tasksError);

  return (
    <div>
      <div className={styles.welcome}>Welcome back, Antonio!</div>
      <div style={{ display: 'flex', justifyContent: 'center', margin: '1.5rem 0' }}>
        <button
          className={styles.beginTasksBtn}
          style={{
            background: '#6366f1', color: '#fff', padding: '0.9rem 2.2rem', fontSize: '1.15rem', borderRadius: '0.7rem', border: 'none', fontWeight: 600, cursor: isStartingTasks ? 'not-allowed' : 'pointer', opacity: isStartingTasks ? 0.7 : 1, boxShadow: '0 2px 12px 0 rgba(99,102,241,0.10)' 
          }}
          onClick={handleBeginTodaysTasks}
          disabled={isStartingTasks}
        >
          {isStartingTasks ? 'Starting…' : "Start Today's Tasks"}
        </button>
      </div>
      {tasksError && (
        <div style={{ color: '#b91c1c', textAlign: 'center', marginBottom: 12 }}>{tasksError}</div>
      )}
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