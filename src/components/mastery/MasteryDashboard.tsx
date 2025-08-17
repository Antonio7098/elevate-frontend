import React, { useState, useCallback } from 'react';
import type { MasteryProgress } from '../../types/masteryTracking';
import type { UueStage } from '../../types/uueStage';

interface MasteryDashboardProps {
  masteryProgress: MasteryProgress;
  onStageClick?: (stage: UueStage) => void;
  onCriterionClick?: (criterionId: string) => void;
  className?: string;
}

const MasteryDashboard: React.FC<MasteryDashboardProps> = ({
  masteryProgress,
  onStageClick,
  onCriterionClick,
  className = ''
}) => {
  const [selectedView, setSelectedView] = useState<'overview' | 'stages' | 'criteria'>('overview');

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

  const handleStageClick = useCallback((stage: UueStage) => {
    if (onStageClick) {
      onStageClick(stage);
    }
  }, [onStageClick]);

  const handleCriterionClick = useCallback((criterionId: string) => {
    if (onCriterionClick) {
      onCriterionClick(criterionId);
    }
  }, [onCriterionClick]);

  return (
    <div className={`mastery-dashboard ${className}`}>
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900">Mastery Dashboard</h2>
          <div className="flex space-x-2">
            <button
              onClick={() => setSelectedView('overview')}
              className={`px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                selectedView === 'overview'
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setSelectedView('stages')}
              className={`px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                selectedView === 'stages'
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              UUE Stages
            </button>
            <button
              onClick={() => setSelectedView('criteria')}
              className={`px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                selectedView === 'criteria'
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Criteria
            </button>
          </div>
        </div>

        {/* Overall Progress */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Overall Progress</h3>
            <span
              className={`px-3 py-1 text-sm font-medium rounded-full ${getProgressColor(
                masteryProgress.overallProgress
              )}`}
            >
              {masteryProgress.overallProgress}% Complete
            </span>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className={`h-3 rounded-full transition-all duration-500 ${getProgressBarColor(
                  masteryProgress.overallProgress
                )}`}
                style={{ width: `${masteryProgress.overallProgress}%` }}
              />
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-4 gap-4">
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
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {masteryProgress.totalCriteria}
              </div>
              <div className="text-sm text-gray-600">Total</div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Views */}
      {selectedView === 'overview' && (
        <div className="space-y-6">
          {/* UUE Stage Progress */}
          {masteryProgress.uueStageProgress && masteryProgress.uueStageProgress.length > 0 && (
            <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">UUE Stage Progress</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {masteryProgress.uueStageProgress.map((stage) => (
                  <div
                    key={stage.stage}
                    className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 hover:shadow-md ${
                      onStageClick ? 'hover:border-blue-300' : ''
                    }`}
                    onClick={() => handleStageClick(stage.stage)}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span
                        className={`px-3 py-1 text-sm font-medium rounded-full ${getStageColor(
                          stage.stage
                        )}`}
                      >
                        {stage.stage}
                      </span>
                      <span className="text-sm font-medium text-gray-900">
                        {stage.progressPercentage}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                      <div
                        className={`h-2 rounded-full transition-all duration-500 ${
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
                    <div className="text-sm text-gray-600">
                      {stage.masteredCriteria}/{stage.totalCriteria} mastered
                    </div>
                    {stage.isCompleted && (
                      <div className="mt-2 flex items-center text-green-600">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-xs">Completed</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recent Activity */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
            <div className="space-y-3">
              {masteryProgress.criteriaProgress && masteryProgress.criteriaProgress.length > 0 ? (
                masteryProgress.criteriaProgress.slice(0, 5).map((criterion) => (
                  <div
                    key={criterion.criterionId}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors duration-200"
                    onClick={() => handleCriterionClick(criterion.criterionId)}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-gray-900 truncate">
                        {criterion.title}
                      </div>
                      <div className="text-xs text-gray-500">
                        Level {criterion.currentLevel}/{criterion.targetLevel}
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="text-sm font-medium text-gray-900">
                        {criterion.progressPercentage}%
                      </div>
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${getProgressBarColor(
                            criterion.progressPercentage
                          )}`}
                          style={{ width: `${criterion.progressPercentage}%` }}
                        />
                      </div>
                      {criterion.isDue && (
                        <span className="px-2 py-1 text-xs font-medium text-red-600 bg-red-100 rounded-full">
                          Due
                        </span>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No recent activity</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Start working on criteria to see your progress here.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {selectedView === 'stages' && (
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">UUE Stage Details</h3>
          {masteryProgress.uueStageProgress && masteryProgress.uueStageProgress.length > 0 ? (
            <div className="space-y-4">
              {masteryProgress.uueStageProgress.map((stage) => (
                <div key={stage.stage} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <span
                        className={`px-3 py-1 text-sm font-medium rounded-full ${getStageColor(
                          stage.stage
                        )}`}
                      >
                        {stage.stage}
                      </span>
                      <span className="text-sm text-gray-600">
                        {stage.masteredCriteria}/{stage.totalCriteria} mastered
                      </span>
                    </div>
                    <span className="text-lg font-semibold text-gray-900">
                      {stage.progressPercentage}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 mb-3">
                    <div
                      className={`h-3 rounded-full transition-all duration-500 ${
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
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>Progress to next stage</span>
                    {stage.isCompleted && (
                      <span className="text-green-600 font-medium">Stage Complete!</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>No UUE stage progress available.</p>
            </div>
          )}
        </div>
      )}

      {selectedView === 'criteria' && (
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Criteria Progress</h3>
          {masteryProgress.criteriaProgress && masteryProgress.criteriaProgress.length > 0 ? (
            <div className="space-y-3">
              {masteryProgress.criteriaProgress.map((criterion) => (
                <div
                  key={criterion.criterionId}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg cursor-pointer hover:border-blue-300 hover:bg-blue-50 transition-all duration-200"
                  onClick={() => handleCriterionClick(criterion.criterionId)}
                >
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
                  <div className="flex items-center space-x-3">
                    <div className="text-sm font-medium text-gray-900">
                      {criterion.progressPercentage}%
                    </div>
                    <div className="w-20 bg-gray-200 rounded-full h-2">
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
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>No criteria progress available.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MasteryDashboard;





