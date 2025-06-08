import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { lazy, Suspense } from 'react';

const LoginPage = lazy(() => import('../pages/LoginPage'));
const RegisterPage = lazy(() => import('../pages/RegisterPage'));
const DashboardPage = lazy(() => import('../pages/DashboardPage'));
const FoldersPage = lazy(() => import('../pages/FoldersPage'));
const QuestionSetsPage = lazy(() => import('../pages/QuestionSetsPage'));
const QuestionsPage = lazy(() => import('../pages/QuestionsPage'));
const CreateAiQuestionSetPage = lazy(() => import('../pages/CreateAiQuestionSetPage'));
const ChatPage = lazy(() => import('../pages/ChatPage'));
const MyProgressPage = lazy(() => import('../pages/MyProgressPage')); // Corrected import path if it was MyProgress.tsx before
const SettingsPage = lazy(() => import('../pages/SettingsPage'));
const ProfilePage = lazy(() => import('../pages/ProfilePage'));
const ReviewSessionPage = lazy(() => import('../pages/ReviewSessionPage'));
const AuthenticatedLayout = lazy(() => import('../components/layout/AuthenticatedLayout'));
import { ProtectedRoute } from './ProtectedRoute';

// Simple loading component
import styles from './AppRoutes.module.css';
const Loading = () => (
  <div className={styles.loadingRoot}>
    <div className={styles.spinner}></div>
  </div>
);

// Layout component for protected routes
const ProtectedLayout = () => {
  return (
    <ProtectedRoute>
      <AuthenticatedLayout>
        <Outlet />
      </AuthenticatedLayout>
    </ProtectedRoute>
  );
};

const AppRoutes = () => {
  console.log('🔄 [AppRoutes] Rendering routes');
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        {/* Protected routes */}
        <Route element={<ProtectedLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/folders" element={<FoldersPage />} />
          <Route path="/folders/:folderId" element={<QuestionSetsPage />} />
          <Route path="/question-sets/:questionSetId" element={<QuestionsPage />} />
          <Route path="/create-set" element={<CreateAiQuestionSetPage />} />
          <Route path="/folders/:folderId/create-set" element={<CreateAiQuestionSetPage />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/my-progress" element={<MyProgressPage />} />
          <Route path="/my-progress/folders/:folderId" element={<MyProgressPage />} />
          <Route path="/my-progress/sets/:setId" element={<MyProgressPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/review" element={<ReviewSessionPage />} />
          <Route path="/review/:folderId/:setId" element={<ReviewSessionPage />} />
          <Route path="/review/today" element={<ReviewSessionPage />} /> {/* Added for Today's Tasks */}
          <Route path="/quiz/set/:setId" element={<ReviewSessionPage />} />
          <Route index element={<Navigate to="/dashboard" replace />} />
        </Route>
        
        {/* Catch-all route */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
