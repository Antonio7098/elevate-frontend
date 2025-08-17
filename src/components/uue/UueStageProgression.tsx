import React from 'react';
import type { UueStageProgression } from '../../types/uueStage';
import type { UueStage } from '../../types/uueStage';

interface UueStageProgressionProps {
  progression: UueStageProgression;
  onStageClick?: (stage: UueStage) => void;
  onCriterionClick?: (criterionId: string) => void;
  className?: string;
}

const UueStageProgression: React.FC<UueStageProgressionProps> = ({
  progression,
  onStageClick,
  onCriterionClick,
  className = ''
}) => {
  const getStageColor = (stage: UueStage) => {
    switch (stage) {
      case 'UNDERSTAND':
        return 'text-blue-600 bg-blue-100 border-blue-200';
      case 'USE':
        return 'text-purple-600 bg-purple-100 border-purple-200';
      case 'EXPLORE':
        return 'text-indigo-600 bg-indigo-100 border-indigo-200';
      default:
        return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  const getStageIcon = (stage: UueStage) => {
    switch (stage) {
      case 'UNDERSTAND':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        );
      case 'USE':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        );
      case 'EXPLORE':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        );
      default:
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };

  const getStageDescription = (stage: UueStage) => {
    switch (stage) {
      case 'UNDERSTAND':
        return 'Grasp fundamental concepts and basic knowledge';
      case 'USE':
        return 'Apply knowledge in practical scenarios and exercises';
      case 'EXPLORE':
        return 'Deep dive into advanced topics and creative applications';
      default:
        return 'Unknown stage';
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 60) return 'bg-yellow-500';
    if (progress >= 40) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const stages: UueStage[] = ['UNDERSTAND', 'USE', 'EXPLORE'];
  const currentStageIndex = stages.indexOf(progression.currentStage);

  return (
    <div className={`uue-stage-progression ${className}`}>
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">UUE Stage Progression</h2>
        <p className="text-gray-600">
          Track your progress through the three learning stages: Understand, Use, and Explore
        </p>
      </div>

      {/* Current Stage Status */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            {getStageIcon(progression.currentStage)}
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Current Stage: {progression.currentStage}
              </h3>
              <p className="text-sm text-gray-600">
                {getStageDescription(progression.currentStage)}
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-blue-600">
              {progression.stageProgress}%
            </div>
            <div className="text-sm text-gray-600">Stage Progress</div>
          </div>
        </div>

        {/* Stage Progress Bar */}
        <div className="mb-4">
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className={`h-3 rounded-full transition-all duration-500 ${getProgressColor(
                progression.stageProgress
              )}`}
              style={{ width: `${progression.stageProgress}%` }}
            />
          </div>
        </div>

        {/* Stage Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-lg font-bold text-blue-600">
              {progression.masteryCriteria.length}
            </div>
            <div className="text-sm text-gray-600">Criteria</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-green-600">
              {progression.stageRequirements.length}
            </div>
            <div className="text-sm text-gray-600">Requirements</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-purple-600">
              {progression.isUnlocked ? 'Yes' : 'No'}
            </div>
            <div className="text-sm text-gray-600">Unlocked</div>
          </div>
        </div>
      </div>

      {/* Stage Progression Flow */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Learning Journey</h3>
        <div className="relative">
          {/* Connection Lines */}
          <div className="absolute top-8 left-0 right-0 h-0.5 bg-gray-200"></div>
          
          <div className="grid grid-cols-3 gap-4">
            {stages.map((stage, index) => {
              const isCurrentStage = stage === progression.currentStage;
              const isCompleted = index < currentStageIndex;
              const isAccessible = index <= currentStageIndex;
              const isLocked = !isAccessible;

              return (
                <div
                  key={stage}
                  className={`relative text-center ${
                    isLocked ? 'opacity-50' : 'cursor-pointer'
                  }`}
                  onClick={() => !isLocked && onStageClick?.(stage)}
                >
                  {/* Stage Circle */}
                  <div
                    className={`w-16 h-16 rounded-full mx-auto mb-3 flex items-center justify-center transition-all duration-200 ${
                      isCompleted
                        ? 'bg-green-100 text-green-600'
                        : isCurrentStage
                        ? 'bg-blue-100 text-blue-600'
                        : isAccessible
                        ? 'bg-gray-100 text-gray-600'
                        : 'bg-gray-100 text-gray-400'
                    }`}
                  >
                    {isCompleted ? (
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      getStageIcon(stage)
                    )}
                  </div>

                  {/* Stage Label */}
                  <div className="mb-2">
                    <div
                      className={`px-3 py-1 text-sm font-medium rounded-full inline-block ${
                        isCompleted
                          ? 'text-green-600 bg-green-100'
                          : isCurrentStage
                          ? 'text-blue-600 bg-blue-100'
                          : isAccessible
                          ? 'text-gray-600 bg-gray-100'
                          : 'text-gray-400 bg-gray-100'
                      }`}
                    >
                      {stage}
                    </div>
                  </div>

                  {/* Stage Description */}
                  <p className="text-xs text-gray-600 mb-2">
                    {getStageDescription(stage)}
                  </p>

                  {/* Stage Status */}
                  <div className="text-xs">
                    {isCompleted ? (
                      <span className="text-green-600 font-medium">Completed</span>
                    ) : isCurrentStage ? (
                      <span className="text-blue-600 font-medium">In Progress</span>
                    ) : isAccessible ? (
                      <span className="text-gray-600">Available</span>
                    ) : (
                      <span className="text-gray-400">Locked</span>
                    )}
                  </div>

                  {/* Progress Indicator for Current Stage */}
                  {isCurrentStage && (
                    <div className="mt-2">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-500 ${getProgressColor(
                            progression.stageProgress
                          )}`}
                          style={{ width: `${progression.stageProgress}%` }}
                        />
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {progression.stageProgress}% complete
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Stage Requirements */}
      {progression.stageRequirements && progression.stageRequirements.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Stage Requirements</h3>
          <div className="space-y-3">
            {progression.stageRequirements.map((requirement, index) => (
              <div
                key={index}
                className={`flex items-center p-3 rounded-lg border ${
                  requirement.isMet
                    ? 'bg-green-50 border-green-200'
                    : 'bg-gray-50 border-gray-200'
                }`}
              >
                <div className="flex-shrink-0 mr-3">
                  {requirement.isMet ? (
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  )}
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-900">
                    {requirement.description}
                  </div>
                  {requirement.details && (
                    <div className="text-xs text-gray-600 mt-1">
                      {requirement.details}
                    </div>
                  )}
                </div>
                <div className="text-xs text-gray-500">
                  {requirement.isMet ? 'Met' : 'Not Met'}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Mastery Criteria */}
      {progression.masteryCriteria && progression.masteryCriteria.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Stage Criteria</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {progression.masteryCriteria.map((criterion) => (
              <div
                key={criterion.id}
                className="p-4 border border-gray-200 rounded-lg cursor-pointer hover:border-blue-300 hover:bg-blue-50 transition-all duration-200"
                onClick={() => onCriterionClick?.(criterion.id)}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium text-gray-900 truncate">
                    {criterion.title}
                  </h4>
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${
                      criterion.uueStage === progression.currentStage
                        ? 'text-blue-600 bg-blue-100'
                        : 'text-gray-600 bg-gray-100'
                    }`}
                  >
                    {criterion.uueStage}
                  </span>
                </div>
                {criterion.description && (
                  <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                    {criterion.description}
                  </p>
                )}
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>Weight: {criterion.weight}</span>
                  <span>Complexity: {criterion.complexityScore}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default UueStageProgression;





