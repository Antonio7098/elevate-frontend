import React from 'react';
import { Routes, Route } from 'react-router-dom';
import PreferencesQuizPage from './pages/PreferencesQuizPage';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/onboarding/quiz" element={<PreferencesQuizPage />} />
      {/* Add other routes as needed */}
    </Routes>
  );
};

export default AppRoutes; 