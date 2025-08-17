import React from 'react';
import type { MasteryProgress } from '../../types/masteryTracking';
import type { UueStage } from '../../types/uueStage';

interface SectionProgressProps {
  masteryProgress: MasteryProgress;
  showDetails?: boolean;
  onProgressClick?: (progress: MasteryProgress) => void;
  className?: string;
}

const SectionProgress: React.FC<SectionProgressProps> = ({
  masteryProgress,
  showDetails = true,
  onProgressClick,
  className = ''
}) => {
  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'text-green-600 bg-green-100';
    if (progress >= 60) return 'text-yellow-600 bg-yellow-100';
    if (progress >= 40) return 'text-orange-600 bg-orange-100';
    return 'text-red-600 bg-red-100';
  };

  const getProgressBarColor = (progress: number) => {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 60) return 'bg-yellow-500';
    if (progress >= 40) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const getStageColor = (stage: UueStage) => {
    switch (stage) {
      case 'UNDERSTAND':
        return 'text-blue-600 bg-blue-100';
      case 'USE':
        return 'text-purple-600 bg-purple-100';
      case 'EXPLORE':
        return 'text-indigo-600 bg-indigo-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const handleClick = () => {
    if (onProgressClick) {
      onProgressClick(masteryProgress);
    }
  };

  const isClickable = !!onProgressClick;

  return (
    <div
      className={`section-progress ${className} ${
        isClickable ? 'cursor-pointer hover:bg-gray-50' : ''
      } transition-colors duration-200`}
      onClick={handleClick}
    >
      {/* Main Progress Overview */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Section Progress</h3>
          <span
            className={`px-3 py-1 text-sm font-medium rounded-full ${getProgressColor(
              masteryProgress.overallProgress
            )}`}
          >
            {masteryProgress.overallProgress}% Complete
          </span>
        </div>

        {/* Overall Progress Bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
            <span>Overall Progress</span>
            <span>{masteryProgress.overallProgress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className={`h-3 rounded-full transition-all duration-500 ${getProgressBarColor(
                masteryProgress.overallProgress
              )}`}
              style={{ width: `${masteryProgress.overallProgress}%` }}
            />
          </div>
        </div>

        {/* Progress Stats Grid */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {masteryProgress.masteredCriteria}
            </div>
            <div className="text-sm text-gray-600">Mastered</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">
              {masteryProgress.inProgressCriteria}
            </div>
            <div className="text-sm text-gray-600">In Progress</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-600">
              {masteryProgress.notStartedCriteria}
            </div>
            <div className="text-sm text-gray-600">Not Started</div>
          </div>
        </div>

        {/* Last Updated */}
        <div className="text-xs text-gray-500 text-center">
          Last updated: {new Date(masteryProgress.lastUpdated).toLocaleDateString()}
        </div>
      </div>

      {/* Detailed Progress */}
      {showDetails && (
        <div className="mt-4 space-y-4">
          {/* Criteria Progress */}
          {masteryProgress.criteriaProgress && masteryProgress.criteriaProgress.length > 0 && (
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <h4 className="text-md font-semibold text-gray-900 mb-3">Criteria Progress</h4>
              <div className="space-y-3">
                {masteryProgress.criteriaProgress.map((criterion) => (
                  <div key={criterion.criterionId} className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-gray-900 truncate">
                        {criterion.title}
                      </div>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-xs text-gray-500">
                          Level {criterion.currentLevel}/{criterion.targetLevel}
                        </span>
                        {criterion.isDue && (
                          <span className="px-2 py-1 text-xs font-medium text-red-600 bg-red-100 rounded-full">
                            Due
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="ml-4 text-right">
                      <div className="text-sm font-medium text-gray-900">
                        {criterion.progressPercentage}%
                      </div>
                      <div className="w-20 bg-gray-200 rounded-full h-2 mt-1">
                        <div
                          className={`h-2 rounded-full ${getProgressBarColor(
                            criterion.progressPercentage
                          )}`}
                          style={{ width: `${criterion.progressPercentage}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* UUE Stage Progress */}
          {masteryProgress.uueStageProgress && masteryProgress.uueStageProgress.length > 0 && (
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <h4 className="text-md font-semibold text-gray-900 mb-3">UUE Stage Progress</h4>
              <div className="space-y-3">
                {masteryProgress.uueStageProgress.map((stage) => (
                  <div key={stage.stage} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span
                        className={`px-3 py-1 text-sm font-medium rounded-full ${getStageColor(
                          stage.stage
                        )}`}
                      >
                        {stage.stage}
                      </span>
                      <div className="text-sm text-gray-600">
                        {stage.masteredCriteria}/{stage.totalCriteria} mastered
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="text-sm font-medium text-gray-900">
                        {stage.progressPercentage}%
                      </div>
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            stage.progressPercentage >= 80
                              ? 'bg-green-500'
                              : stage.progressPercentage >= 60
                              ? 'bg-yellow-500'
                              : stage.progressPercentage >= 40
                              ? 'bg-orange-500'
                              : 'bg-red-500'
                          }`}
                          style={{ width: `${stage.progressPercentage}%` }}
                        />
                      </div>
                      {stage.isCompleted && (
                        <svg
                          className="w-5 h-5 text-green-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Progress Summary */}
      <div className="mt-4 bg-blue-50 rounded-lg p-4">
        <div className="flex items-center">
          <svg
            className="w-5 h-5 text-blue-600 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <div className="text-sm text-blue-800">
            <span className="font-medium">
              {masteryProgress.masteredCriteria} of {masteryProgress.totalCriteria}
            </span>{' '}
            criteria mastered. {masteryProgress.inProgressCriteria} criteria are currently in progress.
          </div>
        </div>
      </div>
    </div>
  );
};

export default SectionProgress;





