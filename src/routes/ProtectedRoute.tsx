import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import type { ReactNode } from 'react';

import styles from './ProtectedRoute.module.css';
const Loading = () => (
  <div className={styles.loadingRoot}>
    <div className={styles.spinner}></div>
  </div>
);

interface ProtectedRouteProps {
  children?: ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated, isInitialized } = useAuth();
  const location = useLocation();

  // Log current state for debugging
  console.log('🔒 [ProtectedRoute] State: ', { 
    isAuthenticated, 
    isInitialized, 
    currentPath: location.pathname,
    hasChildren: !!children
  });

  // 1. If AuthContext hasn't finished its initial check, show loading
  if (!isInitialized) {
    console.log('⏳ [ProtectedRoute] Auth not initialized. Rendering Loading...');
    return <Loading />;
  }

  // 2. If AuthContext is initialized and user is NOT authenticated, redirect to login
  if (!isAuthenticated) {
    console.log('🔐 [ProtectedRoute] Not authenticated. Redirecting to /login. Intended path:', location.pathname);
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 3. If AuthContext is initialized AND user is authenticated, render the protected content
  console.log('✅ [ProtectedRoute] Authenticated. Rendering protected content.');
  return children ? <>{children}</> : <Outlet />;
};

export default ProtectedRoute;
