import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { lazy, Suspense } from 'react';

const LoginPage = lazy(() => import('../pages/LoginPage'));
const RegisterPage = lazy(() => import('../pages/RegisterPage'));
const DashboardPage = lazy(() => import('../pages/DashboardPage'));
const FoldersPage = lazy(() => import('../pages/FoldersPage'));
const ChatPage = lazy(() => import('../pages/ChatPage'));
const StatsPage = lazy(() => import('../pages/StatsPage'));
const SettingsPage = lazy(() => import('../pages/SettingsPage'));
const ProfilePage = lazy(() => import('../pages/ProfilePage'));
const AuthenticatedLayout = lazy(() => import('../components/layout/AuthenticatedLayout'));
import { ProtectedRoute } from './ProtectedRoute';

// Simple loading component
const Loading = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
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
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/stats" element={<StatsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route index element={<Navigate to="/dashboard" replace />} />
        </Route>
        
        {/* Catch-all route */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
