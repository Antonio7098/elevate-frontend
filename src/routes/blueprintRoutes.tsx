import { createBrowserRouter, Navigate } from 'react-router-dom';
import BlueprintLayout from '../layouts/BlueprintLayout';
import BlueprintDashboard from '../pages/blueprints/BlueprintDashboard';
import SectionsPage from '../pages/blueprints/SectionsPage';
import MasteryPage from '../pages/blueprints/MasteryPage';
import UueProgressionPage from '../pages/blueprints/UueProgressionPage';

import QuestionsPage from '../pages/blueprints/QuestionsPage';
import BlueprintMindmapPage from '../pages/BlueprintMindmapPage';
import IdeaspacePage from '../pages/IdeaspacePage';
import PathwaysPage from '../pages/PathwaysPage';
import MockLoginPage from '../pages/auth/MockLoginPage';
import ChatPage from '../pages/ChatPage';
import IdeaspaceDemoPage from '../pages/IdeaspaceDemoPage';
import SettingsPage from '../pages/SettingsPage';
import ProfilePage from '../pages/ProfilePage';
import AuthenticatedLayout from '../components/layout/AuthenticatedLayout';
import ReviewPage from '../pages/ReviewPage';
import ReviewSessionPage from '../pages/ReviewSessionPage';

// Route configuration
export const blueprintRoutes = [
  {
    path: '/blueprints',
    element: <BlueprintLayout />,
    children: [
      { index: true, element: <Navigate to="/blueprints/dashboard" replace /> },
      { path: 'dashboard', element: <BlueprintDashboard /> },
      { path: 'chat', element: <ChatPage /> },
      { path: ':blueprintId', element: <div>Blueprint Editor</div> },
      { path: 'sections', element: <SectionsPage /> },
      { path: 'mastery', element: <MasteryPage /> },
      { path: 'mastery/sections/:sectionId', element: <MasteryPage /> },
      { path: 'mastery/primitives/:primitiveId', element: <MasteryPage /> },
      { path: 'uue-progression', element: <UueProgressionPage /> },
      { path: 'questions', element: <QuestionsPage /> },
      { path: 'mindmap', element: <BlueprintMindmapPage /> },
      { path: ':blueprintId/mindmap', element: <BlueprintMindmapPage /> },
      { path: ':blueprintId/sections/:sectionId/mindmap', element: <BlueprintMindmapPage /> },
      { path: 'ideaspace', element: <IdeaspacePage /> },
      { path: 'pathways', element: <PathwaysPage /> },
      // Review routes under ideaspace
      { path: 'review', element: <ReviewPage /> },
      { path: 'review/set', element: <ReviewSessionPage /> },
    ],
  },
  {
    path: '/ideaspaces',
    children: [
      { path: 'demo', element: <IdeaspaceDemoPage /> },
    ],
  },
];

// Main app routes
export const appRoutes = [
  { path: '/', element: <Navigate to="/blueprints" replace /> },
  { path: '/mock-login', element: <MockLoginPage /> },
  
  // User-specific routes with AuthenticatedLayout
  {
    path: '/profile',
    element: <AuthenticatedLayout><ProfilePage /></AuthenticatedLayout>,
  },
  {
    path: '/settings',
    element: <AuthenticatedLayout><SettingsPage /></AuthenticatedLayout>,
  },
  
  ...blueprintRoutes,
  { path: '*', element: <Navigate to="/blueprints" replace /> },
];

// Create the router instance
export const router = createBrowserRouter(appRoutes);

// Route constants
export const ROUTES = {
  HOME: '/',
  MOCK_LOGIN: '/mock-login',
  
  // Profile and Settings routes (at root level)
  PROFILE: '/profile',
  SETTINGS: '/settings',
  
  // Blueprint routes
  BLUEPRINTS: '/blueprints',
  BLUEPRINT_DASHBOARD: '/blueprints/dashboard',
  SECTIONS: '/blueprints/sections',
  MASTERY: '/blueprints/mastery',
  MASTERY_SECTION: '/blueprints/mastery/sections',
  MASTERY_PRIMITIVE: '/blueprints/mastery/primitives',
  UUE_PROGRESSION: '/blueprints/uue-progression',
  LEARNING_PATHWAYS: '/blueprints/pathways',
  QUESTIONS: '/blueprints/questions',
  MINDMAP: '/blueprints/mindmap',
  BLUEPRINT_MINDMAP: '/blueprints/:blueprintId/mindmap',
  SECTION_MINDMAP: '/blueprints/:blueprintId/sections/:sectionId/mindmap',
  IDEASPACE: '/blueprints/ideaspace',
  PATHWAYS: '/blueprints/pathways',
  IDEASPACE_DEMO: '/ideaspaces/demo',
  REVIEW: '/blueprints/review',
  REVIEW_SET: '/blueprints/review/set',
};
