import React from 'react';
import type { BlueprintSection } from '../../types/blueprintSection';
import type { MasteryProgress } from '../../types/masteryTracking';

interface SectionHeaderProps {
  section: BlueprintSection;
  masteryProgress?: MasteryProgress;
  onEdit?: (section: BlueprintSection) => void;
  onDelete?: (sectionId: string) => void;
  onAddChild?: (parentSectionId: string) => void;
  isEditable?: boolean;
  className?: string;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({
  section,
  masteryProgress,
  onEdit,
  onDelete,
  onAddChild,
  isEditable = false,
  className = ''
}) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'text-green-600 bg-green-100 border-green-200';
      case 'intermediate':
        return 'text-yellow-600 bg-yellow-100 border-yellow-200';
      case 'advanced':
        return 'text-red-600 bg-red-100 border-red-200';
      default:
        return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'text-green-600 bg-green-100';
    if (progress >= 60) return 'text-yellow-600 bg-yellow-100';
    if (progress >= 40) return 'text-orange-600 bg-orange-100';
    return 'text-red-600 bg-red-100';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes}m`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
  };

  return (
    <div className={`section-header bg-white rounded-lg shadow-sm border border-gray-200 ${className}`}>
      {/* Main Header */}
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            {/* Title and Difficulty */}
            <div className="flex items-center space-x-3 mb-3">
              <h1 className="text-2xl font-bold text-gray-900 truncate">
                {section.title}
              </h1>
              <span
                className={`px-3 py-1 text-sm font-medium rounded-full border ${getDifficultyColor(
                  section.difficulty
                )}`}
              >
                {section.difficulty}
              </span>
            </div>

            {/* Description */}
            {section.description && (
              <p className="text-gray-600 text-lg mb-4 leading-relaxed">
                {section.description}
              </p>
            )}

            {/* Metadata Row */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
              {/* Estimated Time */}
              {section.estimatedTimeMinutes && (
                <div className="flex items-center">
                  <svg
                    className="w-4 h-4 mr-2"
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
                  <span>Estimated time: {formatTime(section.estimatedTimeMinutes)}</span>
                </div>
              )}

              {/* Content Count */}
              {section.contentCount && section.contentCount > 0 && (
                <div className="flex items-center">
                  <svg
                    className="w-4 h-4 mr-2"
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
                  <span>{section.contentCount} content items</span>
                </div>
              )}

              {/* Created Date */}
              <div className="flex items-center">
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <span>Created {formatDate(section.createdAt)}</span>
              </div>

              {/* Last Updated */}
              {section.updatedAt !== section.createdAt && (
                <div className="flex items-center">
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                  <span>Updated {formatDate(section.updatedAt)}</span>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          {isEditable && (
            <div className="flex items-center space-x-2 ml-4">
              {onAddChild && (
                <button
                  onClick={() => onAddChild(section.id)}
                  className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 hover:border-blue-300 transition-colors duration-200"
                  title="Add child section"
                >
                  <svg
                    className="w-4 h-4 mr-2 inline"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                  Add Child
                </button>
              )}

              {onEdit && (
                <button
                  onClick={() => onEdit(section)}
                  className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-50 border border-gray-200 rounded-md hover:bg-gray-100 hover:border-gray-300 transition-colors duration-200"
                  title="Edit section"
                >
                  <svg
                    className="w-4 h-4 mr-2 inline"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                  Edit
                </button>
              )}

              {onDelete && (
                <button
                  onClick={() => onDelete(section.id)}
                  className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 border border-red-200 rounded-md hover:bg-red-100 hover:border-red-300 transition-colors duration-200"
                  title="Delete section"
                >
                  <svg
                    className="w-4 h-4 mr-2 inline"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                  Delete
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Mastery Progress Section */}
      {masteryProgress && (
        <div className="border-t border-gray-200 bg-gray-50 px-6 py-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-gray-900">Mastery Progress</h3>
            <span
              className={`px-3 py-1 text-sm font-medium rounded-full ${getProgressColor(
                masteryProgress.overallProgress
              )}`}
            >
              {masteryProgress.overallProgress}% Complete
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-3 mb-3">
            <div
              className={`h-3 rounded-full transition-all duration-500 ${
                masteryProgress.overallProgress >= 80
                  ? 'bg-green-500'
                  : masteryProgress.overallProgress >= 60
                  ? 'bg-yellow-500'
                  : masteryProgress.overallProgress >= 40
                  ? 'bg-orange-500'
                  : 'bg-red-500'
              }`}
              style={{ width: `${masteryProgress.overallProgress}%` }}
            />
          </div>

          {/* Progress Stats */}
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {masteryProgress.masteredCriteria}
              </div>
              <div className="text-gray-600">Mastered</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {masteryProgress.inProgressCriteria}
              </div>
              <div className="text-gray-600">In Progress</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-600">
                {masteryProgress.notStartedCriteria}
              </div>
              <div className="text-gray-600">Not Started</div>
            </div>
          </div>

          {/* Last Updated */}
          <div className="text-xs text-gray-500 text-center mt-3">
            Last updated: {formatDate(masteryProgress.lastUpdated)}
          </div>
        </div>
      )}
    </div>
  );
};

export default SectionHeader;





