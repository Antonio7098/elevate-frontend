import React from 'react';
import type { BlueprintSection } from '../../types/blueprintSection';
import type { MasteryProgress } from '../../types/masteryTracking';

interface SectionTreeItemProps {
  section: BlueprintSection;
  depth: number;
  isExpanded: boolean;
  onToggleExpand: (sectionId: string) => void;
  onSectionClick: (sectionId: string) => void;
  masteryProgress?: MasteryProgress;
  isSelected?: boolean;
}

const SectionTreeItem: React.FC<SectionTreeItemProps> = ({
  section,
  depth,
  isExpanded,
  onToggleExpand,
  onSectionClick,
  masteryProgress,
  isSelected = false
}) => {
  const hasChildren = section.children && section.children.length > 0;
  const indentStyle = { marginLeft: `${depth * 24}px` };

  const handleToggleExpand = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (hasChildren) {
      onToggleExpand(section.id);
    }
  };

  const handleSectionClick = () => {
    onSectionClick(section.id);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'text-green-600 bg-green-100';
      case 'intermediate':
        return 'text-yellow-600 bg-yellow-100';
      case 'advanced':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 60) return 'bg-yellow-500';
    if (progress >= 40) return 'bg-orange-500';
    return 'bg-red-500';
  };

  return (
    <div className="section-tree-item">
      <div
        className={`flex items-center p-3 rounded-lg cursor-pointer transition-colors duration-200 hover:bg-gray-50 ${
          isSelected ? 'bg-blue-50 border-l-4 border-blue-500' : ''
        }`}
        style={indentStyle}
        onClick={handleSectionClick}
      >
        {/* Expand/Collapse Button */}
        {hasChildren && (
          <button
            onClick={handleToggleExpand}
            className="mr-2 p-1 rounded hover:bg-gray-200 transition-colors duration-200"
            aria-label={isExpanded ? 'Collapse section' : 'Expand section'}
          >
            <svg
              className={`w-4 h-4 transform transition-transform duration-200 ${
                isExpanded ? 'rotate-90' : ''
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        )}

        {/* Section Icon */}
        <div className="mr-3">
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
            <svg
              className="w-5 h-5 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
          </div>
        </div>

        {/* Section Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-900 truncate">
              {section.title}
            </h3>
            <div className="flex items-center space-x-2">
              {/* Difficulty Badge */}
              <span
                className={`px-2 py-1 text-xs font-medium rounded-full ${getDifficultyColor(
                  section.difficulty
                )}`}
              >
                {section.difficulty}
              </span>

              {/* Content Count */}
              {section.contentCount && section.contentCount > 0 && (
                <span className="px-2 py-1 text-xs font-medium text-gray-600 bg-gray-100 rounded-full">
                  {section.contentCount} items
                </span>
              )}
            </div>
          </div>

          {/* Description */}
          {section.description && (
            <p className="text-xs text-gray-500 mt-1 truncate">
              {section.description}
            </p>
          )}

          {/* Mastery Progress */}
          {masteryProgress && (
            <div className="mt-2">
              <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                <span>Mastery Progress</span>
                <span>{masteryProgress.overallProgress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${getProgressColor(
                    masteryProgress.overallProgress
                  )}`}
                  style={{ width: `${masteryProgress.overallProgress}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>
                  {masteryProgress.masteredCriteria}/{masteryProgress.totalCriteria} mastered
                </span>
                <span>
                  {masteryProgress.inProgressCriteria} in progress
                </span>
              </div>
            </div>
          )}

          {/* Estimated Time */}
          {section.estimatedTimeMinutes && (
            <div className="flex items-center mt-2 text-xs text-gray-500">
              <svg
                className="w-4 h-4 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              {section.estimatedTimeMinutes} min
            </div>
          )}
        </div>
      </div>

      {/* Children */}
      {hasChildren && isExpanded && (
        <div className="section-children">
          {section.children.map((child) => (
            <SectionTreeItem
              key={child.id}
              section={child}
              depth={depth + 1}
              isExpanded={child.isExpanded || false}
              onToggleExpand={onToggleExpand}
              onSectionClick={onSectionClick}
              masteryProgress={child.masteryProgress}
              isSelected={isSelected}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default SectionTreeItem;





