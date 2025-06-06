import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { AuthProvider } from './context/AuthContext';
import { AppRoutes } from './routes';
import { ErrorBoundary } from 'react-error-boundary';
import { StrictMode } from 'react';

// Create a client
const queryClient = new QueryClient();

import styles from './App.module.css';

function ErrorFallback({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) {
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
  return (
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <ErrorBoundary
            FallbackComponent={ErrorFallback}
            onReset={() => {
              // Reset the state of your app here
              window.location.href = '/';
            }}
          >
            <AuthProvider>
              <div className={styles.bg}>
                <AppRoutes />
              </div>
            </AuthProvider>
          </ErrorBoundary>
        </BrowserRouter>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </StrictMode>
  );
}

export default App;
