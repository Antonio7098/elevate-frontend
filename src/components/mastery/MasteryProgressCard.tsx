import React from 'react';
import type { MasteryTracking } from '../../types/masteryTracking';
import type { MasteryCriterion } from '../../types/masteryCriterion';

interface MasteryProgressCardProps {
  masteryTracking: MasteryTracking;
  criterion: MasteryCriterion;
  onProgressClick?: (tracking: MasteryTracking) => void;
  onReviewClick?: (tracking: MasteryTracking) => void;
  className?: string;
}

const MasteryProgressCard: React.FC<MasteryProgressCardProps> = ({
  masteryTracking,
  criterion,
  onProgressClick,
  onReviewClick,
  className = ''
}) => {
  const getLevelColor = (level: number) => {
    if (level >= 4) return 'text-green-600 bg-green-100';
    if (level >= 3) return 'text-blue-600 bg-blue-100';
    if (level >= 2) return 'text-yellow-600 bg-yellow-100';
    if (level >= 1) return 'text-orange-600 bg-orange-100';
    return 'text-red-600 bg-red-100';
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 60) return 'bg-yellow-500';
    if (progress >= 40) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const getLevelLabel = (level: number) => {
    switch (level) {
      case 0: return 'Not Started';
      case 1: return 'Beginner';
      case 2: return 'Elementary';
      case 3: return 'Intermediate';
      case 4: return 'Advanced';
      case 5: return 'Expert';
      default: return 'Unknown';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const isDue = masteryTracking.isDue;
  const isMastered = masteryTracking.isMastered;

  return (
    <div className={`mastery-progress-card bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 ${
      isDue ? 'border-orange-300 bg-orange-50' : ''
    } ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 truncate mb-1">
              {criterion.title}
            </h3>
            <div className="flex items-center space-x-2">
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getLevelColor(masteryTracking.currentLevel)}`}>
                Level {masteryTracking.currentLevel} - {getLevelLabel(masteryTracking.currentLevel)}
              </span>
              <span className="text-xs text-gray-500">
                Target: Level {masteryTracking.targetLevel}
              </span>
            </div>
          </div>
          
          {/* Status Indicators */}
          <div className="flex flex-col items-end space-y-1">
            {isDue && (
              <span className="px-2 py-1 text-xs font-medium text-orange-600 bg-orange-100 rounded-full">
                Due
              </span>
            )}
            {isMastered && (
              <span className="px-2 py-1 text-xs font-medium text-green-600 bg-green-100 rounded-full">
                Mastered
              </span>
            )}
            {masteryTracking.updatedAt && (
              <span className="text-xs text-gray-500">
                Updated recently
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Progress Section */}
      <div className="p-4">
        {/* Progress Bar */}
        <div className="mb-3">
          <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
            <span>Progress to Next Level</span>
            <span>{masteryTracking.progressPercentage}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-500 ${getProgressColor(masteryTracking.progressPercentage)}`}
              style={{ width: `${masteryTracking.progressPercentage}%` }}
            />
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center">
            <div className="text-lg font-bold text-blue-600">
              {masteryTracking.successRate}%
            </div>
            <div className="text-xs text-gray-600">Success Rate</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-green-600">
              {masteryTracking.currentLevel}
            </div>
            <div className="text-xs text-gray-600">Current Level</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-purple-600">
              {masteryTracking.totalAttempts}
            </div>
            <div className="text-xs text-gray-600">Attempts</div>
          </div>
        </div>

        {/* UUE Stage */}
        <div className="mb-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">UUE Stage</span>
            <span className="text-sm text-gray-900">{criterion.uueStage}</span>
          </div>
          <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-purple-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${(masteryTracking.currentLevel / 5) * 100}%` }}
            />
          </div>
        </div>

        {/* Last Updated */}
        <div className="text-xs text-gray-500 text-center">
          Last updated: {formatDate(masteryTracking.updatedAt)}
        </div>
      </div>

      {/* Actions */}
      <div className="p-4 bg-gray-50 border-t border-gray-200">
        <div className="flex space-x-2">
          {onProgressClick && (
            <button
              onClick={() => onProgressClick(masteryTracking)}
              className="flex-1 px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 hover:border-blue-300 transition-colors duration-200"
            >
              View Progress
            </button>
          )}
          {onReviewClick && (
            <button
              onClick={() => onReviewClick(masteryTracking)}
              className={`flex-1 px-3 py-2 text-sm font-medium rounded-md border transition-colors duration-200 ${
                isDue
                  ? 'text-white bg-orange-600 border-orange-600 hover:bg-orange-700'
                  : 'text-gray-600 bg-gray-50 border-gray-200 hover:bg-gray-100'
              }`}
            >
              {isDue ? 'Review Now' : 'Review'}
            </button>
          )}
        </div>
      </div>

      {/* Due Reminder */}
      {isDue && (
        <div className="px-4 py-2 bg-orange-100 border-t border-orange-200">
          <div className="flex items-center text-sm text-orange-800">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Due for review</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default MasteryProgressCard;
