import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDashboardData } from '../services/dashboardService';
import { getTodaysTasks } from '../services/todaysTasksService';
import type { DashboardData } from '../types/dashboard.types';
import { mockDashboardData } from '../data/mockDashboardData';
import TodaysTasksWidget from '../components/dashboard/TodaysTasksWidget';
import RecentProgressWidget from '../components/dashboard/RecentProgressWidget';
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
    } catch (err: unknown) {
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
      <div className={`page-container ${styles.pageContainer}`}>
        <div className={`card ${styles.errorCard}`}>
          <h1 className={styles.welcome}>Offline Mode</h1>
          <p className={styles.welcomeMessage}>
            Could not connect to the server. Displaying placeholder data.
          </p>
        </div>
        <div className={styles.dashboardContainer}>
          <div className={`${styles.mainColumn} card`}>
            <TodaysTasksWidget 
              dueToday={mockDashboardData.dueToday} 
              onStartTasks={() => {}}
              isStarting={false}
              error={null}
            />
          </div>
          <div className={`${styles.sidebar} card`}>
            <RecentProgressWidget recentProgress={mockDashboardData.recentProgress} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`page-container ${styles.pageContainer}`}>
      <div className="card">
        <h1 className={styles.welcome}>Welcome back, Antonio!</h1>
        <p className={styles.welcomeMessage}>
          Your hard work is really paying off! I've noticed you've recently pushed the mastery on your "Advanced Calculus" set up to 85% – that's fantastic progress on a tough subject.
        </p>
        <p className={styles.welcomeMessage}>
          To keep that momentum going, I've lined up your tasks for today. We'll start with a few "Critical" review questions from your "Geometry" set to make sure those core theorems are locked in. After that, we have some "Core" review items from "The Tudors" ready to help you advance your understanding there. Let's get started!
        </p>
      </div>
      
      <div className={styles.dashboardContainer}>
        <div className={`${styles.mainColumn} card`}>
          <TodaysTasksWidget 
            dueToday={dashboardData?.dueToday || []} 
            onStartTasks={handleBeginTodaysTasks}
            isStarting={isStartingTasks}
            error={tasksError}
          />
        </div>
        <div className={`${styles.sidebar} card`}>
          <RecentProgressWidget recentProgress={dashboardData?.recentProgress || []} />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;