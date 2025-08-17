import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ROUTES } from '../../routes/blueprintRoutes';

interface NavigationItem {
  id: string;
  label: string;
  path: string;
  icon: string;
  description: string;
  children?: NavigationItem[];
}

const navigationItems: NavigationItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    path: ROUTES.BLUEPRINT_DASHBOARD,
    icon: '📊',
    description: 'Overview of all ideaspaces and progress',
  },
  {
    id: 'blueprints',
    label: 'Ideaspaces',
    path: ROUTES.BLUEPRINTS,
    icon: '📚',
    description: 'Manage learning ideaspaces',
    children: [
      {
        id: 'overview',
        label: 'Overview',
        path: 'overview',
        icon: '👁️',
        description: 'Blueprint summary and statistics',
      },
      {
        id: 'sections',
        label: 'Sections',
        path: 'sections',
        icon: '📁',
        description: 'Manage blueprint sections and hierarchy',
      },
      {
        id: 'mastery',
        label: 'Mastery Tracking',
        path: 'mastery',
        icon: '🎯',
        description: 'Track learning progress and mastery',
      },
      {
        id: 'uue-progression',
        label: 'UUE Progression',
        path: 'uue-progression',
        icon: '🚀',
        description: 'Monitor UUE stage progression',
      },
      {
        id: 'questions',
        label: 'Question Bank',
        path: 'questions',
        icon: '❓',
        description: 'Manage questions and assessments',
      },
      {
        id: 'mastery',
        label: 'Mastery',
        path: 'mastery',
        icon: '🎯',
        description: 'Track blueprint and primitive mastery',
      },
    ],
  },
  {
    id: 'pathways',
    label: 'Learning Pathways',
    path: ROUTES.LEARNING_PATHWAYS,
    icon: '🛤️',
    description: 'Structured learning journeys and courses',
  },
  {
    id: 'sections',
    label: 'Section Manager',
    path: ROUTES.SECTIONS,
    icon: '📁',
    description: 'Global section management across blueprints',
  },
  {
    id: 'mastery',
    label: 'Mastery Tracker',
    path: ROUTES.MASTERY,
    icon: '🎯',
    description: 'Global mastery tracking and progress',
  },
  {
    id: 'uue-progression',
    label: 'UUE Progression',
    path: ROUTES.UUE_PROGRESSION,
    icon: '🚀',
        description: 'Global UUE stage progression tracking',
  },
  {
    id: 'questions',
    label: 'Question Bank',
    path: ROUTES.QUESTIONS,
    icon: '❓',
    description: 'Global question management and creation',
  },
  {
    id: 'mastery',
    label: 'Mastery',
    path: ROUTES.MASTERY,
    icon: '🎯',
    description: 'Track blueprint and primitive mastery',
  },
];

interface BlueprintNavigationProps {
  className?: string;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

const BlueprintNavigation: React.FC<BlueprintNavigationProps> = ({
  className = '',
  isCollapsed = false,
  onToggleCollapse,
}) => {
  const location = useLocation();
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set(['blueprints']));

  const toggleExpanded = (itemId: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(itemId)) {
      newExpanded.delete(itemId);
    } else {
      newExpanded.add(itemId);
    }
    setExpandedItems(newExpanded);
  };

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const isActiveChild = (item: NavigationItem) => {
    if (!item.children) return false;
    return item.children.some(child => isActive(child.path));
  };

  return (
    <div className={`blueprint-navigation ${className}`}>
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Ideaspace System</h2>
        <p className="text-gray-600">
          Track your progress through the three learning stages: Understand, Use, and Explore
        </p>
      </div>

      {/* Navigation Items */}
      <div className="p-2">
        {navigationItems.map((item) => (
          <div key={item.id} className="mb-1">
            {/* Main Navigation Item */}
            <Link
              to={item.path}
              className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive(item.path)
                  ? 'bg-blue-100 text-blue-700 border-r-2 border-blue-500'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              <span className="mr-3 text-lg">{item.icon}</span>
              {!isCollapsed && (
                <>
                  <span className="flex-1">{item.label}</span>
                  {item.children && (
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        toggleExpanded(item.id);
                      }}
                      className="ml-2 p-1 rounded text-gray-400 hover:text-gray-600"
                    >
                      {expandedItems.has(item.id) ? '▼' : '▶'}
                    </button>
                  )}
                </>
              )}
            </Link>

            {/* Child Navigation Items */}
            {item.children && expandedItems.has(item.id) && !isCollapsed && (
              <div className="ml-6 mt-1 space-y-1">
                {item.children.map((child) => (
                  <Link
                    key={child.id}
                    to={`${item.path}/${child.path}`}
                    className={`flex items-center px-3 py-2 rounded-md text-sm transition-colors ${
                      isActive(`${item.path}/${child.path}`)
                        ? 'bg-blue-50 text-blue-600 border-l-2 border-blue-300'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
                    }`}
                  >
                    <span className="mr-2 text-sm">{child.icon}</span>
                    <span>{child.label}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Footer */}
      {!isCollapsed && (
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-gray-50">
          <div className="text-xs text-gray-500 text-center">
            Ideaspace System v1.0
          </div>
        </div>
      )}
    </div>
  );
};

export default BlueprintNavigation;





