import React from 'react';
import { FiCheck, FiX, FiLoader, FiAlertTriangle } from 'react-icons/fi';
import type { EvaluationResult } from '../../services/evaluationService';

interface AnswerEvaluationProps {
  evaluation: EvaluationResult | null;
  status: 'idle' | 'loading' | 'success' | 'error' | 'self-mark-pending' | 'self-marked-success';
}

const AnswerEvaluation: React.FC<AnswerEvaluationProps> = ({ evaluation, status }) => {
  if (status === 'loading') {
    return (
      <div className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-lg">
        <div className="animate-spin text-blue-500 text-2xl mb-2">
          <FiLoader />
        </div>
        <p className="text-gray-700">AI is evaluating your answer...</p>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="flex flex-col items-center justify-center p-4 bg-red-50 rounded-lg">
        <div className="text-red-500 text-2xl mb-2">
          <FiAlertTriangle />
        </div>
        <p className="text-red-700">Could not evaluate your answer. Please try again.</p>
      </div>
    );
  }

  if (!evaluation) {
    return null;
  }

  // Handle pending evaluation (offline mode)
  if (evaluation.pendingEvaluation) {
    return (
      <div className="flex flex-col p-4 bg-yellow-50 rounded-lg">
        <div className="flex items-center mb-2">
          <div className="text-yellow-500 text-xl mr-2">
            <FiLoader />
          </div>
          <h3 className="text-lg font-medium text-yellow-800">Evaluation Pending</h3>
        </div>
        <p className="text-yellow-700">{evaluation.feedback}</p>
      </div>
    );
  }

  const scorePercentage = evaluation.scoreAchieved !== null 
    ? Math.round(evaluation.scoreAchieved * 100) 
    : null;

  return (
    <div className="flex flex-col p-4 bg-gray-50 rounded-lg">
      {/* Score Badge */}
      <div className="flex items-center mb-4">
        {evaluation.isCorrect === true ? (
          <div className="flex items-center bg-green-100 text-green-800 px-3 py-1 rounded-full">
            <div className="mr-1"><FiCheck /></div>
            <span className="font-medium">Correct</span>
          </div>
        ) : evaluation.isCorrect === false ? (
          <div className="flex items-center bg-red-100 text-red-800 px-3 py-1 rounded-full">
            <div className="mr-1"><FiX /></div>
            <span className="font-medium">Needs Improvement</span>
          </div>
        ) : (
          <div className="flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
            <span className="font-medium">Recorded</span>
          </div>
        )}

        {scorePercentage !== null && (
          <div className="ml-auto text-gray-700">
            Score: <span className="font-semibold">{scorePercentage}%</span>
          </div>
        )}
      </div>

      {/* Feedback */}
      <div className="mb-3">
        <h4 className="text-sm font-medium text-gray-700 mb-1">Feedback:</h4>
        <p className="text-gray-800">{evaluation.feedback}</p>
      </div>

      {/* Explanation (if available) */}
      {evaluation.explanation && (
        <div className="mb-3">
          <h4 className="text-sm font-medium text-gray-700 mb-1">Explanation:</h4>
          <p className="text-gray-800">{evaluation.explanation}</p>
        </div>
      )}

      {/* Concepts Identified (if available) */}
      {evaluation.conceptsIdentified && evaluation.conceptsIdentified.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-1">Concepts Identified:</h4>
          <div className="flex flex-wrap gap-1">
            {evaluation.conceptsIdentified.map((concept) => (
              <span 
                key={concept} 
                className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded"
              >
                {concept}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AnswerEvaluation;
