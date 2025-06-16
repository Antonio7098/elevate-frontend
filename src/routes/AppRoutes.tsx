import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AuthenticatedLayout from '../components/layout/AuthenticatedLayout';
import styles from './AppRoutes.module.css';

// --- Lazy-loaded Page Components ---
// Public Pages
const LoginPage = lazy(() => import('../pages/LoginPage'));
const RegisterPage = lazy(() => import('../pages/RegisterPage'));

// Authenticated Pages
const DashboardPage = lazy(() => import('../pages/DashboardPage'));
const FoldersPage = lazy(() => import('../pages/FoldersPage').then(module => ({ default: module.FoldersPage })));
const QuestionSetsPage = lazy(() => import('../pages/QuestionSetsPage'));
const ReviewSessionPage = lazy(() => import('../pages/ReviewSessionPage'));
// const NotePage = lazy(() => import('../pages/NotePage').then(module => ({ default: module.default })));
import NotePage from '../pages/NotePage'; // Direct import for debugging
const ChatPage = lazy(() => import('../pages/ChatPage'));
const MyProgressPage = lazy(() => import('../pages/MyProgressPage'));
const SettingsPage = lazy(() => import('../pages/SettingsPage'));
const AllContentPage = lazy(() => import('../pages/AllContentPage').then(module => ({ default: module.AllContentPage })));
const QuestionsPage = lazy(() => import('../pages/QuestionsPage'));

// --- Helper Components ---
const Loading = () => (
  <div className={styles.loadingRoot}>
    <div className={styles.spinner} />
  </div>
);


// This component checks for auth and then renders the layout with the actual pages
const ProtectedRoutes = () => {
  const { isAuthenticated, isInitialized } = useAuth();

  // Show a loading indicator while the auth state is being initialized
  if (!isInitialized) {
    return <Loading />;
  }

  // If auth check is done and user is not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If authenticated, render the layout which contains the Outlet for nested routes
  return (
    <AuthenticatedLayout>
      <Routes>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="folders/:folderId?" element={<FoldersPage />} />
        <Route path="folders/:folderId/all-questions" element={<AllContentPage />} />
        <Route path="folders/:folderId/all-notes" element={<AllContentPage />} />
        <Route path="chat" element={<ChatPage />} />
        <Route path="my-progress" element={<MyProgressPage />} />
        <Route path="my-progress/folders/:folderId" element={<MyProgressPage />} />
        <Route path="my-progress/sets/:setId" element={<MyProgressPage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="question-sets/:questionSetId" element={<QuestionsPage />} />
        <Route path="quiz/set/:setId" element={<ReviewSessionPage />} />
        <Route path="review/today" element={<ReviewSessionPage />} />
        <Route path="notes/new" element={<NotePage />} />
        <Route path="notes/:noteId" element={<NotePage />} />
        <Route path="review/set/:setId" element={<ReviewSessionPage />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </AuthenticatedLayout>
  );
};

const AppRoutes = () => {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected Routes */}
        <Route path="/*" element={<ProtectedRoutes />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
