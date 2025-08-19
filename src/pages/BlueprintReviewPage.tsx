import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './ReviewPage.module.css'; // Reusing styles from ReviewPage
import Breadcrumbs from '../components/layout/Breadcrumbs';
import LoadingText from '../components/LoadingText';

// --- Mock Data based on prisma.schema ---

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
  description: string;
  masteryCriteria: MasteryCriterion[];
}

const mockBlueprintSections: BlueprintSection[] = [
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
          { id: 'q-1-1-2', questionText: 'Where does photosynthesis occur in a plant cell?', currentMasteryScore: 0.75 },
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


// --- Component ---

interface SelectedCriterion {
    criterion: MasteryCriterion;
    selectedQuestions: Set<string>; // Set of QuestionInstance IDs
}

interface SelectedSection {
  section: BlueprintSection;
  selectedCriteria: Map<string, SelectedCriterion>; // Key is criterion ID
}

const BlueprintReviewPage: React.FC = () => {
  const navigate = useNavigate();
  const [blueprintSections, setBlueprintSections] = useState<BlueprintSection[]>([]);
  const [selectedSections, setSelectedSections] = useState<Map<string, SelectedSection>>(new Map());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        setBlueprintSections(mockBlueprintSections);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching blueprint sections:', err);
        setError('Failed to load blueprint sections.');
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getFilteredBlueprintSections = () => {
    if (!searchTerm.trim()) {
      return blueprintSections;
    }
    const searchLower = searchTerm.toLowerCase();
    return blueprintSections.filter(section =>
      section.name.toLowerCase().includes(searchLower) ||
      section.description.toLowerCase().includes(searchLower) ||
      section.masteryCriteria.some(c => c.title.toLowerCase().includes(searchLower))
    );
  };

  const handleSectionToggle = (section: BlueprintSection) => {
    setSelectedSections(prev => {
      const newMap = new Map(prev);
      if (newMap.has(section.id)) {
        newMap.delete(section.id);
      } else {
        const selectedCriteria = new Map<string, SelectedCriterion>();
        section.masteryCriteria.forEach(criterion => {
          selectedCriteria.set(criterion.id, {
            criterion,
            selectedQuestions: new Set(criterion.questionInstances.map(q => q.id)),
          });
        });
        newMap.set(section.id, {
          section,
          selectedCriteria,
        });
      }
      return newMap;
    });
  };

  const handleCriterionToggle = (sectionId: string, criterion: MasteryCriterion) => {
    setSelectedSections(prev => {
        const newMap = new Map(prev);
        const selectedSection = newMap.get(sectionId);
        if (selectedSection) {
            const newSelectedCriteria = new Map(selectedSection.selectedCriteria);
            if (newSelectedCriteria.has(criterion.id)) {
                newSelectedCriteria.delete(criterion.id);
            } else {
                newSelectedCriteria.set(criterion.id, {
                    criterion,
                    selectedQuestions: new Set(criterion.questionInstances.map(q => q.id)),
                });
            }
            newMap.set(sectionId, { ...selectedSection, selectedCriteria: newSelectedCriteria });
        }
        return newMap;
    });
  };

  const handleQuestionToggle = (sectionId: string, criterionId: string, questionId: string) => {
    setSelectedSections(prev => {
        const newMap = new Map(prev);
        const selectedSection = newMap.get(sectionId);
        if (selectedSection) {
            const newSelectedCriteria = new Map(selectedSection.selectedCriteria);
            const selectedCriterion = newSelectedCriteria.get(criterionId);
            if (selectedCriterion) {
                const newSelectedQuestions = new Set(selectedCriterion.selectedQuestions);
                if (newSelectedQuestions.has(questionId)) {
                    newSelectedQuestions.delete(questionId);
                } else {
                    newSelectedQuestions.add(questionId);
                }
                newSelectedCriteria.set(criterionId, { ...selectedCriterion, selectedQuestions: newSelectedQuestions });
                newMap.set(sectionId, { ...selectedSection, selectedCriteria: newSelectedCriteria });
            }
        }
        return newMap;
    });
  };

  const getTotalSelectedQuestions = () => {
    let total = 0;
    selectedSections.forEach(section => {
      section.selectedCriteria.forEach(criterion => {
        total += criterion.selectedQuestions.size;
      });
    });
    return total;
  };

    const handleStartReview = () => {
    const allSelectedQuestions: any[] = []; // Using any for simplicity for now
    
    selectedSections.forEach((selectedSection) => {
        selectedSection.selectedCriteria.forEach(selectedCriterion => {
            const questions = selectedCriterion.criterion.questionInstances
                .filter(q => selectedCriterion.selectedQuestions.has(q.id))
                .map(q => ({
                    ...q,
                    criterionId: selectedCriterion.criterion.id,
                    criterionName: selectedCriterion.criterion.title,
                    sectionId: selectedSection.section.id,
                    sectionName: selectedSection.section.name,
                }));
            allSelectedQuestions.push(...questions);
        });
    });

    if (allSelectedQuestions.length === 0) {
      alert('Please select at least one question to start the review session.');
      return;
    }

    const sectionIds = Array.from(selectedSections.keys());
    
    navigate('/review/set', { // This will need to be adapted to a new review page
      state: {
        questions: allSelectedQuestions,
        sessionTitle: `Blueprint Review (${selectedSections.size} sections)`,
        isBlueprintReview: true,
        sectionIds: sectionIds,
      }
    });
  };

  const filteredBlueprintSections = getFilteredBlueprintSections();

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
        <h1 className={styles.title}>Create Blueprint Review Session</h1>
        <p className={styles.subtitle}>
          Select sections, criteria, and questions from your blueprints.
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
      </div>

      <div className={styles.summary}>
        <span className={styles.summaryText}>
          {selectedSections.size} sections, {getTotalSelectedQuestions()} questions selected
        </span>
      </div>

      {/* Available Sections */}
      <div className={styles.content}>
        <h2 className={styles.sectionTitle}>
          Available Sections ({filteredBlueprintSections.filter(s => !selectedSections.has(s.id)).length})
        </h2>
        <div className={styles.questionSetsList}>
          {filteredBlueprintSections
            .filter(section => !selectedSections.has(section.id))
            .map((section) => (
              <div key={section.id} className="card">
                <div className={styles.questionSetHeader} onClick={() => handleSectionToggle(section)}>
                  <input type="checkbox" checked={false} readOnly className={styles.checkbox} />
                  <div className={styles.questionSetInfo}>
                    <h4 className={styles.questionSetName}>{section.name}</h4>
                    <p className={styles.questionSetFolder}>{section.description}</p>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Selected Sections */}
      {selectedSections.size > 0 && (
        <div className={styles.content}>
          <h2 className={styles.sectionTitle}>
            Selected Sections ({selectedSections.size})
          </h2>
          <div className={styles.questionSetsList}>
            {Array.from(selectedSections.values()).map(({ section, selectedCriteria }) => (
              <div key={section.id} className="card">
                <div className={`${styles.questionSetHeader} ${styles.selected}`} onClick={() => handleSectionToggle(section)}>
                  <input type="checkbox" checked={true} readOnly className={styles.checkbox} />
                  <div className={styles.questionSetInfo}>
                     <h4 className={styles.questionSetName}>{section.name}</h4>
                     <p className={styles.questionSetFolder}>{section.description}</p>
                  </div>
                </div>
                
                <div className={styles.questionsSection}>
                    {section.masteryCriteria.map(criterion => {
                        const isCriterionSelected = selectedCriteria.has(criterion.id);
                        const selectedQuestions = selectedCriteria.get(criterion.id)?.selectedQuestions ?? new Set();

                        return (
                            <div key={criterion.id} className={styles.criterionContainer}>
                                <div className={styles.questionSetHeader} onClick={() => handleCriterionToggle(section.id, criterion)}>
                                    <input type="checkbox" checked={isCriterionSelected} readOnly className={styles.checkbox} />
                                    <h5 className={styles.questionSetName}>{criterion.title}</h5>
                                </div>
                                <div className={styles.questionsList}>
                                    {criterion.questionInstances.map((question, index) => (
                                        <div 
                                            key={question.id}
                                            className={`${styles.questionItem} ${selectedQuestions.has(question.id) ? styles.selected : ''}`}
                                            onClick={() => handleQuestionToggle(section.id, criterion.id, question.id)}
                                        >
                                            <input
                                                type="checkbox"
                                                checked={selectedQuestions.has(question.id)}
                                                readOnly
                                                className={styles.checkbox}
                                            />
                                            <div className={styles.questionContent}>
                                                <span className={styles.questionNumber}>Q{index + 1}</span>
                                                <p className={styles.questionText}>{question.questionText}</p>
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
                        );
                    })}
                </div>

              </div>
            ))}
          </div>
        </div>
      )}

      <div className={styles.actions}>
        <button onClick={() => navigate(-1)} className={styles.cancelButton}>Cancel</button>
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

export default BlueprintReviewPage;
