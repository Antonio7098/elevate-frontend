import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AuthenticatedLayout from '../components/layout/AuthenticatedLayout';
import styles from './AppRoutes.module.css';
import LearningBlueprintPage from '../pages/LearningBlueprintPage';
const CreateHubPage = lazy(() => import('../pages/CreateHubPage'));

// --- Lazy-loaded Page Components ---
// Public Pages
const LoginPage = lazy(() => import('../pages/LoginPage'));
const RegisterPage = lazy(() => import('../pages/RegisterPage'));

// Authenticated Pages
const DashboardPage = lazy(() => import('../pages/DashboardPage'));
const FoldersPage = lazy(() => import('../pages/FoldersPage').then(module => ({ default: module.FoldersPage })));

const ReviewSessionPage = lazy(() => import('../pages/ReviewSessionPage'));
const QuestionSelectionPage = lazy(() => import('../pages/QuestionSelectionPage'));
const ReviewPage = lazy(() => import('../pages/ReviewPage'));
// const NotePage = lazy(() => import('../pages/NotePage').then(module => ({ default: module.default })));
import NotePage from '../pages/NotePage'; // Direct import for debugging
const ChatPage = lazy(() => import('../pages/ChatPage'));
const MyProgressPage = lazy(() => import('../pages/MyProgressPage'));
const SettingsPage = lazy(() => import('../pages/SettingsPage'));
const ProfilePage = lazy(() => import('../pages/ProfilePage'));
const CreateQuestionSetPage = lazy(() => import('../pages/CreateQuestionSetPage'));
const CreateManualQuestionSetPage = lazy(() => import('../pages/CreateManualQuestionSetPage'));
const CreateFromBlueprintPage = lazy(() => import('../pages/CreateFromBlueprintPage'));
const GenerateQuestionsFromBlueprintPage = lazy(() => import('../pages/GenerateQuestionsFromBlueprintPage'));
const BlueprintsPage = lazy(() => import('../pages/BlueprintsPage'));
const BlueprintDetailPage = lazy(() => import('../pages/BlueprintDetailPage'));
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
        <Route path="profile" element={<ProfilePage />} />
        <Route path="question-sets/:questionSetId" element={<QuestionsPage />} />
        <Route path="quiz/set/:setId" element={<ReviewSessionPage />} />
        <Route path="review/today" element={<ReviewSessionPage />} />
        <Route path="notes/new" element={<NotePage />} />
        <Route path="notes/:noteId" element={<NotePage />} />
        <Route path="review" element={<ReviewPage />} />
        <Route path="review/select/:setId" element={<QuestionSelectionPage />} />
        <Route path="review/set" element={<ReviewSessionPage />} />
        <Route path="review/set/:setId" element={<ReviewSessionPage />} />
        <Route path="create" element={<CreateHubPage />} />
        <Route path="create/blueprint-from-source" element={<LearningBlueprintPage />} />
        <Route path="create-questions-from-scratch" element={<CreateManualQuestionSetPage />} />
        <Route path="create-questions-from-blueprint" element={<CreateFromBlueprintPage />} />
        <Route path="create-questions-from-blueprint/:blueprintId" element={<GenerateQuestionsFromBlueprintPage />} />
        <Route path="folders/:folderId/create-set" element={<CreateQuestionSetPage />} />
        <Route path="blueprints" element={<BlueprintsPage />} />
        <Route path="blueprints/:blueprintId" element={<BlueprintDetailPage />} />
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
