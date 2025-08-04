import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { AuthProvider } from './context/AuthProvider';
import { ThemeProvider } from './context/ThemeProvider';
import AppRoutes from './routes/AppRoutes';
import { ErrorBoundary } from 'react-error-boundary';
import { StrictMode } from 'react';

console.log("🟢 [App] Initializing application");

// Create a basic client
const queryClient = new QueryClient();

import styles from './App.module.css';

function ErrorFallback({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) {
  console.error('❌ [ErrorFallary] Error caught:', error);
  return (
    <div role="alert" className={styles.errorFallback}>
      <p className={styles.fontBold}>Something went wrong:</p>
      <pre className={styles.preWrap}>{error.message}</pre>
      <button
        onClick={resetErrorBoundary}
        className={styles.retryBtn}
      >
        Try again
      </button>
    </div>
  );
}

function App() {
  console.log("🟢 [App] Rendering application");
  return (
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <ErrorBoundary
            FallbackComponent={ErrorFallback}
            onReset={() => {
              console.log("🔄 [App] Resetting application state");
              // Reset the state of your app here
              window.location.href = '/';
            }}
          >
            <ThemeProvider>
              <AuthProvider>
                <div className={styles.bg}>
                  <AppRoutes />
                </div>
              </AuthProvider>
            </ThemeProvider>
          </ErrorBoundary>
        </BrowserRouter>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </StrictMode>
  );
}

export default App;
