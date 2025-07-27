import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { apiClient } from '../services/apiClient';
import type { Question } from '../types/question';
import type { EnhancedQuestionSet } from '../types/questionSet';
import styles from './ReviewPage.module.css';
import Breadcrumbs from '../components/layout/Breadcrumbs';

interface SelectedQuestionSet {
  questionSet: EnhancedQuestionSet;
  selectedQuestions: Set<string>;
  folderPath: string;
}

const ReviewPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [questionSets, setQuestionSets] = useState<EnhancedQuestionSet[]>([]);
  const [selectedQuestionSets, setSelectedQuestionSets] = useState<Map<string, SelectedQuestionSet>>(new Map());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Check if this is a "Review Again" session
  const isReviewAgain = location.state?.reviewAgain;
  const questionsToReview = useMemo(() => location.state?.questionsToReview || [], [location.state?.questionsToReview]);

  // Filter question sets based on search term
  const getFilteredQuestionSets = () => {
    if (!searchTerm.trim()) {
      return questionSets;
    }
    
    const searchLower = searchTerm.toLowerCase();
    return questionSets.filter(questionSet =>
      questionSet.name.toLowerCase().includes(searchLower) ||
      questionSet.folder.name.toLowerCase().includes(searchLower)
    );
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Use the new comprehensive endpoint
        const response = await apiClient.get<EnhancedQuestionSet[]>('/questionsets');
        setQuestionSets(response.data);
        
        // If this is a "Review Again" session, automatically select question sets with questions that need review
        if (isReviewAgain && questionsToReview.length > 0) {
          const questionIdsToReview = new Set(questionsToReview.map((q: Question) => q.id));
          
          const questionSetsToSelect = response.data.filter(questionSet => 
            questionSet.questions.some(question => questionIdsToReview.has(question.id))
          );
          
          const selectedSets = new Map<string, SelectedQuestionSet>();
          
          questionSetsToSelect.forEach(questionSet => {
            const questionsInSet = questionSet.questions.filter(q => questionIdsToReview.has(q.id));
            const selectedQuestions = new Set(questionsInSet.map(q => q.id));
            
            selectedSets.set(questionSet.id, {
              questionSet,
              selectedQuestions,
              folderPath: questionSet.folder.name
            });
          });
          
          setSelectedQuestionSets(selectedSets);
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching question sets:', err);
        setError('Failed to load question sets.');
        setLoading(false);
      }
    };
    fetchData();
  }, [isReviewAgain, questionsToReview]);

  const handleQuestionSetToggle = (questionSet: EnhancedQuestionSet) => {
    const questionSetId = questionSet.id;
    const folderPath = questionSet.folder.name;
    
    if (selectedQuestionSets.has(questionSetId)) {
      setSelectedQuestionSets(prev => {
        const newMap = new Map(prev);
        newMap.delete(questionSetId);
        return newMap;
      });
    } else {
      setSelectedQuestionSets(prev => {
        const newMap = new Map(prev);
        newMap.set(questionSetId, {
          questionSet,
          selectedQuestions: new Set(questionSet.questions.map(q => q.id)),
          folderPath
        });
        return newMap;
      });
    }
  };

  const handleQuestionToggle = (questionSetId: string, questionId: string) => {
    setSelectedQuestionSets(prev => {
      const newMap = new Map(prev);
      const selectedSet = newMap.get(questionSetId);
      if (selectedSet) {
        const newSelectedQuestions = new Set(selectedSet.selectedQuestions);
        if (newSelectedQuestions.has(questionId)) {
          newSelectedQuestions.delete(questionId);
        } else {
          newSelectedQuestions.add(questionId);
        }
        newMap.set(questionSetId, {
          ...selectedSet,
          selectedQuestions: newSelectedQuestions
        });
      }
      return newMap;
    });
  };

  const handleStartReview = () => {
    const allSelectedQuestions: Question[] = [];
    
    selectedQuestionSets.forEach((selectedSet) => {
      const questions = selectedSet.questionSet.questions.filter(q => 
        selectedSet.selectedQuestions.has(q.id)
      ).map(q => ({
        id: q.id,
        text: q.text,
        questionType: q.questionType,
        currentMasteryScore: q.currentMasteryScore,
        questionSetId: selectedSet.questionSet.id,
        questionSetName: selectedSet.questionSet.name,
        answer: null,
        createdAt: selectedSet.questionSet.createdAt,
        updatedAt: selectedSet.questionSet.updatedAt,
        options: [],
        totalMarksAvailable: 1,
        markingCriteria: null,
        conceptTags: [],
        uueFocus: "Understand",
        timesAnsweredCorrectly: 0,
        timesAnsweredIncorrectly: 0,
        selfMark: false,
        autoMark: false,
        aiGenerated: false,
        inCat: null,
        imageUrls: []
      }));
      allSelectedQuestions.push(...questions);
    });

    if (allSelectedQuestions.length === 0) {
      alert('Please select at least one question to start the review session.');
      return;
    }

    const questionSetIds = Array.from(selectedQuestionSets.keys());
    
    navigate('/review/set', {
      state: {
        questions: allSelectedQuestions,
        sessionTitle: `Multi-Set Review (${selectedQuestionSets.size} sets)`,
        questionSetId: questionSetIds.join(','),
        isMultiSet: true,
        questionSetIds: questionSetIds
      }
    });
  };

  const getTotalSelectedQuestions = () => {
    let total = 0;
    selectedQuestionSets.forEach((selectedSet) => {
      total += selectedSet.selectedQuestions.size;
    });
    return total;
  };

  const filteredQuestionSets = getFilteredQuestionSets();

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingContainer}>
          <div className={styles.loader}>Loading...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.errorContainer}>
          <h2>Error</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Breadcrumbs />
      
      <div className={styles.header}>
        <h1 className={styles.title}>
          {isReviewAgain ? 'Review Again' : 'Create Review Session'}
        </h1>
        <p className={styles.subtitle}>
          {isReviewAgain 
            ? `Questions you didn't get 100% on have been automatically selected. You can modify your selection below.`
            : 'Select multiple question sets and choose which questions to include.'
          }
        </p>
      </div>

      <div className={styles.searchSection}>
        <input
          type="text"
          placeholder="Search question sets or folders..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles.searchInput}
        />
        {searchTerm && (
          <span className={styles.searchResults}>
            {filteredQuestionSets.length} question set{filteredQuestionSets.length !== 1 ? 's' : ''} found
          </span>
        )}
      </div>

      <div className={styles.summary}>
        <span className={styles.summaryText}>
          {selectedQuestionSets.size} sets, {getTotalSelectedQuestions()} questions selected
          {isReviewAgain && (
            <span style={{ color: '#059669', fontWeight: '600', marginLeft: '0.5rem' }}>
              ({questionsToReview.length} questions auto-selected from previous session)
            </span>
          )}
        </span>
      </div>

      {/* Available Question Sets Section */}
      <div className={styles.content}>
        <h2 className={styles.sectionTitle}>
          Available Question Sets ({filteredQuestionSets.filter(qs => !selectedQuestionSets.has(qs.id)).length})
        </h2>
        <div className={styles.questionSetsList}>
          {filteredQuestionSets
            .filter(questionSet => !selectedQuestionSets.has(questionSet.id))
            .map((questionSet) => (
              <div key={questionSet.id} className="card">
                <div 
                  className={styles.questionSetHeader}
                  onClick={() => handleQuestionSetToggle(questionSet)}
                >
                  <input
                    type="checkbox"
                    checked={false}
                    onChange={() => handleQuestionSetToggle(questionSet)}
                    className={styles.checkbox}
                  />
                  <div className={styles.questionSetInfo}>
                    <h4 className={styles.questionSetName}>{questionSet.name}</h4>
                    <p className={styles.questionSetFolder}>{questionSet.folder.name}</p>
                    {questionSet.recentNote && (
                      <p className={styles.recentNote}>
                        📝 Recent note: {questionSet.recentNote.title}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
        </div>
        
        {filteredQuestionSets.filter(qs => !selectedQuestionSets.has(qs.id)).length === 0 && (
          <div className={styles.emptyState}>
            {searchTerm ? (
              <p>No question sets found matching "{searchTerm}"</p>
            ) : (
              <p>No question sets available</p>
            )}
          </div>
        )}
      </div>

      {/* Selected Question Sets Section */}
      {selectedQuestionSets.size > 0 && (
        <div className={styles.content}>
          <h2 className={styles.sectionTitle}>
            Selected Question Sets ({selectedQuestionSets.size})
          </h2>
          <div className={styles.questionSetsList}>
            {Array.from(selectedQuestionSets.values()).map((selectedSet) => {
              const questionSet = selectedSet.questionSet;
              
              return (
                <div key={questionSet.id} className="card">
                  <div 
                    className={`${styles.questionSetHeader} ${styles.selected}`}
                    onClick={() => handleQuestionSetToggle(questionSet)}
                  >
                    <input
                      type="checkbox"
                      checked={true}
                      onChange={() => handleQuestionSetToggle(questionSet)}
                      className={styles.checkbox}
                    />
                    <div className={styles.questionSetInfo}>
                      <h4 className={styles.questionSetName}>{questionSet.name}</h4>
                      <p className={styles.questionSetFolder}>{questionSet.folder.name}</p>
                      {questionSet.recentNote && (
                        <p className={styles.recentNote}>
                          📝 Recent note: {questionSet.recentNote.title}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className={styles.questionsSection}>
                    <div className={styles.questionsList}>
                      {questionSet.questions.map((question, index) => (
                        <div 
                          key={question.id}
                          className={`${styles.questionItem} ${selectedSet.selectedQuestions.has(question.id) ? styles.selected : ''}`}
                          onClick={() => handleQuestionToggle(questionSet.id, question.id)}
                        >
                          <input
                            type="checkbox"
                            checked={selectedSet.selectedQuestions.has(question.id)}
                            onChange={() => handleQuestionToggle(questionSet.id, question.id)}
                            className={styles.checkbox}
                          />
                          <div className={styles.questionContent}>
                            <span className={styles.questionNumber}>Q{index + 1}</span>
                            <p className={styles.questionText}>{question.text}</p>
                            {question.currentMasteryScore !== undefined && (
                              <span className={styles.masteryScore}>
                                Mastery: {Math.round(question.currentMasteryScore * 100)}%
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className={styles.actions}>
        <button 
          onClick={() => navigate(-1)} 
          className={styles.cancelButton}
        >
          Cancel
        </button>
        <button 
          onClick={handleStartReview}
          className={styles.startButton}
          disabled={getTotalSelectedQuestions() === 0}
        >
          Start Review Session ({getTotalSelectedQuestions()} questions)
        </button>
      </div>
    </div>
  );
};

export default ReviewPage; 