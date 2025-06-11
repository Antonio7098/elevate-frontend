import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import { FoldersPage } from './pages/FoldersPage';
import QuestionSetsPage from './pages/QuestionSetsPage';
import QuestionsPage from './pages/QuestionsPage';
import NotesPage from './pages/NotesPage';

const AppRoutes = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<DashboardPage />} />
      <Route path="/folders" element={<FoldersPage />} />
      <Route path="/folders/:folderId" element={<FoldersPage />} />
      <Route path="/question-sets/:questionSetId" element={<QuestionSetsPage />} />
      <Route path="/question-sets/:questionSetId/questions" element={<QuestionsPage />} />
      <Route path="/notes/new" element={<NotesPage />} />
      <Route path="/notes/:noteId" element={<NotesPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes; 