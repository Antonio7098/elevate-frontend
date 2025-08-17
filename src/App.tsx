import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './routes/blueprintRoutes';
import { BlueprintProvider } from './contexts/BlueprintContext';
import { AuthProvider } from './context/AuthProvider';
import { ThemeProvider } from './context/ThemeProvider';
import { MockDataProvider } from './contexts/MockDataContext';

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <MockDataProvider>
          <BlueprintProvider>
            <RouterProvider router={router} />
          </BlueprintProvider>
        </MockDataProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
