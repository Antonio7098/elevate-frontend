import React, { useState, useEffect } from 'react';
import type { MasteryTracking } from '../../types/masteryTracking';
import type { MasteryCriterion } from '../../types/masteryCriterion';
import type { QuestionInstance } from '../../types/questionInstance';

interface MasteryReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (trackingId: string, isCorrect: boolean, performance: any) => void;
  masteryTracking: MasteryTracking;
  criterion: MasteryCriterion;
  questions: QuestionInstance[];
  className?: string;
}

const MasteryReviewModal: React.FC<MasteryReviewModalProps> = ({
  isOpen,
  onClose,
  onComplete,
  masteryTracking,
  criterion,
  questions,
  className = ''
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | string[] | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [endTime, setEndTime] = useState<Date | null>(null);

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  useEffect(() => {
    if (isOpen) {
      setCurrentQuestionIndex(0);
      setSelectedAnswer(null);
      setShowExplanation(false);
      setIsCorrect(false);
      setStartTime(new Date());
      setEndTime(null);
    }
  }, [isOpen]);

  const handleAnswerSelect = (answer: string | string[]) => {
    setSelectedAnswer(answer);
  };

  const handleSubmitAnswer = () => {
    if (!selectedAnswer) return;

    const correct = checkAnswer(selectedAnswer, currentQuestion);
    setIsCorrect(correct);
    setShowExplanation(true);
    setEndTime(new Date());
  };

  const handleNextQuestion = () => {
    if (isLastQuestion) {
      // Complete the review
      const performance = {
        timeSpent: endTime && startTime ? (endTime.getTime() - startTime.getTime()) / 1000 : 0,
        questionsAnswered: questions.length,
        correctAnswers: questions.filter((_, index) => index < currentQuestionIndex + 1).length,
        accuracy: ((currentQuestionIndex + 1) / questions.length) * 100
      };
      
      onComplete(masteryTracking.id, isCorrect, performance);
      onClose();
    } else {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
      setIsCorrect(false);
      setStartTime(new Date());
      setEndTime(null);
    }
  };

  const checkAnswer = (selected: string | string[], question: QuestionInstance): boolean => {
    if (!question.correctAnswer) return false;
    
    if (Array.isArray(question.correctAnswer)) {
      if (Array.isArray(selected)) {
        return selected.length === question.correctAnswer.length &&
               selected.every(ans => question.correctAnswer!.includes(ans));
      }
      return false;
    } else {
      return selected === question.correctAnswer;
    }
  };

  const renderQuestionOptions = () => {
    if (!currentQuestion.options) return null;

    switch (currentQuestion.questionType) {
      case 'multiple_choice':
        return (
          <div className="space-y-3">
            {currentQuestion.options.map((option, index) => (
              <label
                key={index}
                className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors duration-200 ${
                  selectedAnswer === option.text
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name="answer"
                  value={option.text}
                  checked={selectedAnswer === option.text}
                  onChange={() => handleAnswerSelect(option.text)}
                  className="mr-3 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-gray-900">{option.text}</span>
              </label>
            ))}
          </div>
        );

      case 'true_false':
        return (
          <div className="space-y-3">
            {['true', 'false'].map((option) => (
              <label
                key={option}
                className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors duration-200 ${
                  selectedAnswer === option
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name="answer"
                  value={option}
                  checked={selectedAnswer === option}
                  onChange={() => handleAnswerSelect(option)}
                  className="mr-3 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-gray-900 capitalize">{option}</span>
              </label>
            ))}
          </div>
        );

      case 'matching':
        // Simplified matching for now
        return (
          <div className="space-y-3">
            <p className="text-sm text-gray-600">Matching questions not yet implemented</p>
          </div>
        );

      default:
        return (
          <div className="space-y-3">
            <textarea
              placeholder="Enter your answer..."
              value={selectedAnswer as string || ''}
              onChange={(e) => handleAnswerSelect(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows={4}
            />
          </div>
        );
    }
  };

  if (!isOpen || !currentQuestion) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={onClose}
        />

        {/* Modal panel */}
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
          {/* Header */}
          <div className="bg-blue-600 px-4 py-3 sm:px-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg leading-6 font-medium text-white">
                Mastery Review - {criterion.title}
              </h3>
              <button
                onClick={onClose}
                className="rounded-md text-blue-100 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
              >
                <span className="sr-only">Close</span>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="mt-2">
              <div className="flex items-center justify-between text-sm text-blue-100">
                <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
                <span>Level {masteryTracking.currentLevel}</span>
              </div>
              <div className="w-full bg-blue-200 rounded-full h-2 mt-2">
                <div
                  className="bg-white h-2 rounded-full transition-all duration-300"
                  style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
                />
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="bg-white px-4 py-5 sm:p-6">
            {/* Question */}
            <div className="mb-6">
              <h4 className="text-lg font-medium text-gray-900 mb-4">
                {currentQuestion.question}
              </h4>
              
              {renderQuestionOptions()}
            </div>

            {/* Answer Feedback */}
            {showExplanation && (
              <div className={`mb-6 p-4 rounded-lg ${
                isCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
              }`}>
                <div className="flex items-center mb-2">
                  {isCorrect ? (
                    <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 text-red-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  )}
                  <span className={`font-medium ${
                    isCorrect ? 'text-green-800' : 'text-red-800'
                  }`}>
                    {isCorrect ? 'Correct!' : 'Incorrect'}
                  </span>
                </div>
                
                {currentQuestion.explanation && (
                  <p className="text-sm text-gray-700">
                    {currentQuestion.explanation}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            {!showExplanation ? (
              <button
                type="button"
                onClick={handleSubmitAnswer}
                disabled={!selectedAnswer}
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed sm:ml-3 sm:w-auto sm:text-sm"
              >
                Submit Answer
              </button>
            ) : (
              <button
                type="button"
                onClick={handleNextQuestion}
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm"
              >
                {isLastQuestion ? 'Complete Review' : 'Next Question'}
              </button>
            )}
            
            <button
              type="button"
              onClick={onClose}
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MasteryReviewModal;





