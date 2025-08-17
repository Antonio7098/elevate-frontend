import React, { useState } from 'react';
import type { UueStage } from '../../types/uueStage';
import type { StageTransition } from '../../types/uueStage';

interface UueStageTransitionProps {
  currentStage: UueStage;
  availableTransitions: StageTransition[];
  onTransition: (transition: StageTransition) => void;
  onCancel: () => void;
  className?: string;
}

const UueStageTransition: React.FC<UueStageTransitionProps> = ({
  currentStage,
  availableTransitions,
  onTransition,
  onCancel,
  className = ''
}) => {
  const [selectedTransition, setSelectedTransition] = useState<StageTransition | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

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

  const handleTransitionSelect = (transition: StageTransition) => {
    setSelectedTransition(transition);
    setShowConfirmation(true);
  };

  const handleConfirmTransition = () => {
    if (selectedTransition) {
      onTransition(selectedTransition);
    }
  };

  const handleCancelTransition = () => {
    setSelectedTransition(null);
    setShowConfirmation(false);
  };

  const stages: UueStage[] = ['UNDERSTAND', 'USE', 'EXPLORE'];
  const currentStageIndex = stages.indexOf(currentStage);

  return (
    <div className={`uue-stage-transition ${className}`}>
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Stage Transition</h2>
        <p className="text-gray-600">
          You're ready to advance to the next learning stage. Choose your path forward.
        </p>
      </div>

      {/* Current Stage Status */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm mb-6">
        <div className="flex items-center space-x-3 mb-4">
          {getStageIcon(currentStage)}
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Current Stage: {currentStage}
            </h3>
            <p className="text-sm text-gray-600">
              {getStageDescription(currentStage)}
            </p>
          </div>
        </div>
        
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-sm font-medium text-green-800">
              Congratulations! You've completed the {currentStage} stage.
            </span>
          </div>
        </div>
      </div>

      {/* Available Transitions */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Available Transitions</h3>
        
        {availableTransitions.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No transitions available</h3>
            <p className="mt-1 text-sm text-gray-500">
              You may need to complete additional requirements before advancing.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {availableTransitions.map((transition, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg p-4 cursor-pointer hover:border-blue-300 hover:bg-blue-50 transition-all duration-200"
                onClick={() => handleTransitionSelect(transition)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {getStageIcon(transition.targetStage)}
                    <div>
                      <h4 className="text-lg font-medium text-gray-900">
                        Advance to {transition.targetStage}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {getStageDescription(transition.targetStage)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">
                      {transition.requirementsMet}/{transition.totalRequirements} requirements met
                    </div>
                    <div className="text-xs text-gray-500">
                      {transition.isRecommended ? 'Recommended' : 'Available'}
                    </div>
                  </div>
                </div>

                {/* Transition Requirements */}
                {transition.requirements && transition.requirements.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <div className="text-sm font-medium text-gray-700 mb-2">Requirements:</div>
                    <div className="space-y-1">
                      {transition.requirements.map((req, reqIndex) => (
                        <div key={reqIndex} className="flex items-center text-sm">
                          <div className="flex-shrink-0 mr-2">
                            {req.isMet ? (
                              <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            ) : (
                              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            )}
                          </div>
                          <span className={req.isMet ? 'text-gray-900' : 'text-gray-500'}>
                            {req.description}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Transition Benefits */}
                {transition.benefits && transition.benefits.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <div className="text-sm font-medium text-gray-700 mb-2">Benefits:</div>
                    <div className="space-y-1">
                      {transition.benefits.map((benefit, benefitIndex) => (
                        <div key={benefitIndex} className="flex items-center text-sm text-gray-600">
                          <svg className="w-4 h-4 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {benefit}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Recommended Badge */}
                {transition.isRecommended && (
                  <div className="mt-3">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Recommended Path
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Stage Progression Visualization */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Learning Journey</h3>
        <div className="relative">
          {/* Connection Lines */}
          <div className="absolute top-8 left-0 right-0 h-0.5 bg-gray-200"></div>
          
          <div className="grid grid-cols-3 gap-4">
            {stages.map((stage, index) => {
              const isCurrentStage = stage === currentStage;
              const isCompleted = index < currentStageIndex;
              const isNextStage = index === currentStageIndex + 1;
              const hasTransition = availableTransitions.some(t => t.targetStage === stage);

              return (
                <div key={stage} className="relative text-center">
                  {/* Stage Circle */}
                  <div
                    className={`w-16 h-16 rounded-full mx-auto mb-3 flex items-center justify-center transition-all duration-200 ${
                      isCompleted
                        ? 'bg-green-100 text-green-600'
                        : isCurrentStage
                        ? 'bg-blue-100 text-blue-600'
                        : isNextStage && hasTransition
                        ? 'bg-yellow-100 text-yellow-600'
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
                          : isNextStage && hasTransition
                          ? 'text-yellow-600 bg-yellow-100'
                          : 'text-gray-400 bg-gray-100'
                      }`}
                    >
                      {stage}
                    </div>
                  </div>

                  {/* Stage Status */}
                  <div className="text-xs">
                    {isCompleted ? (
                      <span className="text-green-600 font-medium">Completed</span>
                    ) : isCurrentStage ? (
                      <span className="text-blue-600 font-medium">Current</span>
                    ) : isNextStage && hasTransition ? (
                      <span className="text-yellow-600 font-medium">Ready to Advance</span>
                    ) : (
                      <span className="text-gray-400">Locked</span>
                    )}
                  </div>

                  {/* Transition Arrow */}
                  {isCurrentStage && hasTransition && (
                    <div className="absolute -right-2 top-6">
                      <svg className="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmation && selectedTransition && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            {/* Background overlay */}
            <div
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              onClick={handleCancelTransition}
            />

            {/* Modal panel */}
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 py-5 sm:p-6">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                    <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Confirm Stage Transition
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Are you ready to advance from <strong>{currentStage}</strong> to <strong>{selectedTransition.targetStage}</strong>?
                      </p>
                      <p className="text-sm text-gray-500 mt-2">
                        This action will unlock new learning opportunities and reset your progress tracking for the new stage.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={handleConfirmTransition}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Advance to {selectedTransition.targetStage}
                </button>
                <button
                  type="button"
                  onClick={handleCancelTransition}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UueStageTransition;





