import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { preferenceQuizData } from '../data/preferenceQuiz';

// Stub for the API call
async function updateUserPreferences(preferences: any) {
  // Replace with actual API call
  return new Promise((resolve) => setTimeout(resolve, 1000));
}

const PreferencesQuizPage: React.FC = () => {
  const navigate = useNavigate();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Array<{ questionId: number; choice: string }>>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [results, setResults] = useState<{ mainPreference: string | null; all: Record<string, number> } | null>(null);

  const currentQuestion = preferenceQuizData[currentQuestionIndex];

  const handleAnswerSelect = async (choice: string) => {
    const newAnswers = [...answers, { questionId: currentQuestion.id, choice }];
    setAnswers(newAnswers);
    if (currentQuestionIndex < preferenceQuizData.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Quiz completed, process resultsbutton
      setIsSubmitting(true);
      setError(null);
      try {
        // Scoring logic: tally choices
        const tally: Record<string, number> = {};
        newAnswers.forEach(a => {
          tally[a.choice] = (tally[a.choice] || 0) + 1;
        });
        // Example: pick the most frequent choice as the main preference
        const sorted = Object.entries(tally).sort((a, b) => b[1] - a[1]);
        const mainPreference = sorted.length > 0 ? sorted[0][0] : null;
        // Call the API (stub)
        await updateUserPreferences({ mainPreference, all: tally });
        setResults({ mainPreference, all: tally });
        setSubmitted(true);
      } catch (e) {
        setError('Failed to save your preferences. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  if (isSubmitting) {
    return <div>Saving your preferences...</div>;
  }
  if (error) {
    return <div style={{ color: 'red' }}>{error}</div>;
  }
  if (submitted && results) {
    return (
      <div>
        <h1>Thank You!</h1>
        <p>Your preferences have been saved.</p>
        <h2>Your Learning Preferences</h2>
        <p>Your main preference is: <strong>{results.mainPreference}</strong></p>
        <p>Here's a summary of your choices:</p>
        <ul>
          {Object.entries(results.all).map(([preference, count]) => (
            <li key={preference}>{preference}: {count} times</li>
          ))}
        </ul>
        <button onClick={() => navigate('/dashboard')}>Go to Dashboard</button>
      </div>
    );
  }

  return (
    <div>
      <h1>Learning Preference Quiz</h1>
      <p>Question {currentQuestionIndex + 1} of {preferenceQuizData.length}</p>
      <div>
        <h2>{currentQuestion.scenario}</h2>
        <div>
          {currentQuestion.choices.map((choice, index) => (
            <button key={index} onClick={() => handleAnswerSelect(choice.mapsTo)}>
              {choice.text}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PreferencesQuizPage; 