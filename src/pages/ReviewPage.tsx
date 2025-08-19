import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from './ReviewPage.module.css';
import Breadcrumbs from '../components/layout/Breadcrumbs';
import LoadingText from '../components/LoadingText';
import type { Question } from '../types/question';

// Blueprint-centric mock types and data
interface QuestionInstance {
  id: string;
  questionText: string;
  currentMasteryScore?: number;
}

interface MasteryCriterion {
  id: string;
  title: string;
  questionInstances: QuestionInstance[];
}

interface BlueprintSection {
  id: string;
  name: string;
  description?: string;
  masteryCriteria: MasteryCriterion[];
}

const mockSections: BlueprintSection[] = [
  {
    id: 'section-1',
    name: 'Introduction to Photosynthesis',
    description: 'Understanding the basic process of photosynthesis.',
    masteryCriteria: [
      {
        id: 'crit-1-1',
        title: 'Define Photosynthesis',
        questionInstances: [
          { id: 'q-1-1-1', questionText: 'What is the chemical equation for photosynthesis?' },
          { id: 'q-1-1-2', questionText: 'Where does photosynthesis occur in a plant cell?', currentMasteryScore: 0.72 },
        ],
      },
      {
        id: 'crit-1-2',
        title: 'Identify Reactants and Products',
        questionInstances: [
          { id: 'q-1-2-1', questionText: 'What are the reactants of photosynthesis?' },
          { id: 'q-1-2-2', questionText: 'What are the products of photosynthesis?' },
        ],
      },
    ],
  },
  {
    id: 'section-2',
    name: 'Cellular Respiration',
    description: 'The process of converting glucose to ATP.',
    masteryCriteria: [
      {
        id: 'crit-2-1',
        title: 'Glycolysis',
        questionInstances: [
          { id: 'q-2-1-1', questionText: 'Where does glycolysis take place?' },
        ],
      },
    ],
  },
];

interface SelectedSection {
  section: BlueprintSection;
  selectedQuestionIds: Set<string>;
}

const ReviewPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sections, setSections] = useState<BlueprintSection[]>([]);
  const [selectedSections, setSelectedSections] = useState<Map<string, SelectedSection>>(new Map());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Review Again support
  const isReviewAgain = location.state?.reviewAgain;
  const questionsToReview = useMemo(() => location.state?.questionsToReview || [], [location.state?.questionsToReview]);

  const getFilteredSections = () => {
    if (!searchTerm.trim()) return sections;
    const s = searchTerm.toLowerCase();
    return sections.filter(section =>
      section.name.toLowerCase().includes(s) ||
      (section.description || '').toLowerCase().includes(s) ||
      section.masteryCriteria.some(c => c.title.toLowerCase().includes(s))
    );
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        await new Promise(resolve => setTimeout(resolve, 250));
        setSections(mockSections);

        // Auto-select for Review Again
        if (isReviewAgain && questionsToReview.length > 0) {
          const idsToReview = new Set((questionsToReview as Question[]).map(q => q.id));
          const selected = new Map<string, SelectedSection>();

          mockSections.forEach(section => {
            const allInstanceIds = section.masteryCriteria.flatMap(c => c.questionInstances.map(q => q.id));
            const selectedIds = allInstanceIds.filter(id => idsToReview.has(id));
            if (selectedIds.length > 0) {
              selected.set(section.id, {
                section,
                selectedQuestionIds: new Set(selectedIds),
              });
            }
          });

          setSelectedSections(selected);
        }

        setLoading(false);
      } catch (err) {
        console.error('Error fetching blueprint sections:', err);
        setError('Failed to load sections.');
        setLoading(false);
      }
    };
    fetchData();
  }, [isReviewAgain, questionsToReview]);

  const handleSectionToggle = (section: BlueprintSection) => {
    const allIds = section.masteryCriteria.flatMap(c => c.questionInstances.map(q => q.id));
    setSelectedSections(prev => {
      const next = new Map(prev);
      if (next.has(section.id)) {
        next.delete(section.id);
      } else {
        next.set(section.id, {
          section,
          selectedQuestionIds: new Set(allIds),
        });
      }
      return next;
    });
  };

  const handleCriterionToggle = (sectionId: string, criterionId: string) => {
    setSelectedSections(prev => {
      const next = new Map(prev);
      const selected = next.get(sectionId);
      if (!selected) return prev;
      const criterion = selected.section.masteryCriteria.find(c => c.id === criterionId);
      if (!criterion) return prev;
      const ids = criterion.questionInstances.map(q => q.id);
      const allSelected = ids.every(id => selected.selectedQuestionIds.has(id));
      const newSet = new Set(selected.selectedQuestionIds);
      if (allSelected) {
        ids.forEach(id => newSet.delete(id));
      } else {
        ids.forEach(id => newSet.add(id));
      }
      next.set(sectionId, { ...selected, selectedQuestionIds: newSet });
      return next;
    });
  };

  const handleQuestionToggle = (sectionId: string, questionId: string) => {
    setSelectedSections(prev => {
      const next = new Map(prev);
      const selected = next.get(sectionId);
      if (!selected) return prev;
      const newSet = new Set(selected.selectedQuestionIds);
      if (newSet.has(questionId)) newSet.delete(questionId); else newSet.add(questionId);
      next.set(sectionId, { ...selected, selectedQuestionIds: newSet });
      return next;
    });
  };

  const buildSelectedQuestions = (): Question[] => {
    const nowIso = new Date().toISOString();
    const result: Question[] = [];
    selectedSections.forEach(({ section, selectedQuestionIds }) => {
      section.masteryCriteria.forEach(criterion => {
        criterion.questionInstances.forEach(inst => {
          if (selectedQuestionIds.has(inst.id)) {
            result.push({
              id: inst.id,
              text: inst.questionText,
              questionSetId: section.id, // reuse as section id
              questionSetName: section.name,
              answer: null,
              createdAt: nowIso,
              updatedAt: nowIso,
              questionType: 'SHORT_ANSWER',
              options: [],
              totalMarksAvailable: 1,
              markingCriteria: null,
              conceptTags: [],
              uueFocus: 'Understand',
              timesAnsweredCorrectly: 0,
              timesAnsweredIncorrectly: 0,
              selfMark: false,
              autoMark: false,
              aiGenerated: false,
              inCat: null,
              imageUrls: [],
              currentMasteryScore: inst.currentMasteryScore ?? null,
            } as Question);
          }
        });
      });
    });
    return result;
  };

  const handleStartReview = () => {
    const payload = buildSelectedQuestions();
    if (payload.length === 0) {
      alert('Please select at least one question to start the review session.');
      return;
    }
    const sectionIds = Array.from(selectedSections.keys());
    navigate('/blueprints/review/set', {
      state: {
        questions: payload,
        sessionTitle: `Blueprint Review (${selectedSections.size} sections)`,
        isMultiSet: true,
        isBlueprintReview: true,
        questionSetIds: sectionIds,
      },
    });
  };

  const getTotalSelectedQuestions = () => {
    let total = 0;
    selectedSections.forEach(s => { total += s.selectedQuestionIds.size; });
    return total;
  };

  const filteredSections = getFilteredSections();

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingContainer}>
          <div className={styles.loader}><LoadingText /></div>
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
          {isReviewAgain ? 'Review Again' : 'Create Blueprint Review Session'}
        </h1>
        <p className={styles.subtitle}>
          {isReviewAgain 
            ? `Questions you didn't get 100% on have been automatically selected. You can modify your selection below.`
            : 'Select multiple sections and choose criteria and question instances to include.'
          }
        </p>
      </div>

      <div className={styles.searchSection}>
        <input
          type="text"
          placeholder="Search sections or criteria..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles.searchInput}
        />
        {searchTerm && (
          <span className={styles.searchResults}>
            {filteredSections.length} section{filteredSections.length !== 1 ? 's' : ''} found
          </span>
        )}
      </div>

      <div className={styles.summary}>
        <span className={styles.summaryText}>
          {selectedSections.size} sections, {getTotalSelectedQuestions()} questions selected
          {isReviewAgain && (
            <span style={{ color: '#059669', fontWeight: '600', marginLeft: '0.5rem' }}>
              ({questionsToReview.length} questions auto-selected from previous session)
            </span>
          )}
        </span>
      </div>

      {/* Available Sections */}
      <div className={styles.content}>
        <h2 className={styles.sectionTitle}>
          Available Sections ({filteredSections.filter(s => !selectedSections.has(s.id)).length})
        </h2>
        <div className={styles.questionSetsList}>
          {filteredSections
            .filter(section => !selectedSections.has(section.id))
            .map((section) => (
              <div key={section.id} className="card">
                <div 
                  className={styles.questionSetHeader}
                  onClick={() => handleSectionToggle(section)}
                >
                  <input
                    type="checkbox"
                    checked={false}
                    onChange={() => handleSectionToggle(section)}
                    className={styles.checkbox}
                  />
                  <div className={styles.questionSetInfo}>
                    <h4 className={styles.questionSetName}>{section.name}</h4>
                    {section.description && (
                      <p className={styles.questionSetFolder}>{section.description}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
        </div>
        
        {filteredSections.filter(s => !selectedSections.has(s.id)).length === 0 && (
          <div className={styles.emptyState}>
            {searchTerm ? (
              <p>No sections found matching "{searchTerm}"</p>
            ) : (
              <p>No sections available</p>
            )}
          </div>
        )}
      </div>

      {/* Selected Sections */}
      {selectedSections.size > 0 && (
        <div className={styles.content}>
          <h2 className={styles.sectionTitle}>
            Selected Sections ({selectedSections.size})
          </h2>
          <div className={styles.questionSetsList}>
            {Array.from(selectedSections.values()).map((selected) => (
              <div key={selected.section.id} className="card">
                <div 
                  className={`${styles.questionSetHeader} ${styles.selected}`}
                  onClick={() => handleSectionToggle(selected.section)}
                >
                  <input
                    type="checkbox"
                    checked={true}
                    onChange={() => handleSectionToggle(selected.section)}
                    className={styles.checkbox}
                  />
                  <div className={styles.questionSetInfo}>
                    <h4 className={styles.questionSetName}>{selected.section.name}</h4>
                    {selected.section.description && (
                      <p className={styles.questionSetFolder}>{selected.section.description}</p>
                    )}
                  </div>
                </div>
                
                <div className={styles.questionsSection}>
                  <div className={styles.questionsList}>
                    {selected.section.masteryCriteria.map((criterion) => (
                      <div key={criterion.id} className={styles.criterionContainer}>
                        <div className={styles.questionSetHeader} onClick={() => handleCriterionToggle(selected.section.id, criterion.id)}>
                          <input
                            type="checkbox"
                            checked={criterion.questionInstances.every(q => selected.selectedQuestionIds.has(q.id))}
                            onChange={() => handleCriterionToggle(selected.section.id, criterion.id)}
                            className={styles.checkbox}
                          />
                          <h5 className={styles.questionSetName}>{criterion.title}</h5>
                        </div>
                        {criterion.questionInstances.map((question, index) => (
                          <div 
                            key={question.id}
                            className={`${styles.questionItem} ${selected.selectedQuestionIds.has(question.id) ? styles.selected : ''}`}
                            onClick={() => handleQuestionToggle(selected.section.id, question.id)}
                          >
                            <input
                              type="checkbox"
                              checked={selected.selectedQuestionIds.has(question.id)}
                              onChange={() => handleQuestionToggle(selected.section.id, question.id)}
                              className={styles.checkbox}
                            />
                            <div className={styles.questionContent}>
                              <span className={styles.questionNumber}>Q{index + 1}</span>
                              <p className={styles.questionText}>{question.questionText}</p>
                              {question.currentMasteryScore !== undefined && (
                                <span className={styles.masteryScore}>
                                  Mastery: {Math.round((question.currentMasteryScore || 0) * 100)}%
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
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