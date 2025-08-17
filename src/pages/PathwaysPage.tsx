import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import PathwaysSidebar from '../components/navigation/PathwaysSidebar';
import MindMapView from '../components/mindmap/MindMapView';
import ViewModeToggle from '../components/common/ViewModeToggle';
import { FiPlus, FiEdit3, FiTrash2, FiChevronDown, FiChevronRight } from 'react-icons/fi';
import styles from './PathwaysPage.module.css';

// Define ViewMode type locally to avoid export issues
type ViewMode = 'text' | 'mindmap';

interface QuestionInstance {
  id: string;
  questionText: string;
  answer: string;
  explanation?: string;
  context?: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  masteryCriterionId: string;
}

interface MasteryCriterion {
  id: string;
  title: string;
  description?: string;
  weight: number;
  uueStage: 'UNDERSTAND' | 'USE' | 'EXPLORE';
  complexityScore: number;
  assessmentType: string;
  masteryThreshold: number;
  timeLimit?: number;
  attemptsAllowed: number;
  questionInstances: QuestionInstance[];
  prerequisiteFor: string[]; // IDs of criteria this is a prerequisite for
  requiresPrerequisites: string[]; // IDs of criteria this requires
}

interface PathwaysItem {
  id: string;
  name: string;
  description?: string;
  type: 'section' | 'blueprint' | 'pathway';
  itemCount: number;
  children?: PathwaysItem[];
  masteryCriteria?: MasteryCriterion[];
  depth?: number;
  orderIndex?: number;
  difficulty?: string;
}

const PathwaysPage: React.FC = () => {
  const { blueprintId: urlBlueprintId, sectionId: urlSectionId } = useParams();
  const [viewMode, setViewMode] = useState<ViewMode>('text');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedItem, setSelectedItem] = useState<PathwaysItem | null>(null);
  const [currentBlueprint, setCurrentBlueprint] = useState<PathwaysItem | null>(null);
  const [masteryModal, setMasteryModal] = useState<{ isOpen: boolean; editData?: MasteryCriterion | null }>({ isOpen: false });
  const [questionModal, setQuestionModal] = useState<{ isOpen: boolean; criterionId: string; editData?: QuestionInstance | null }>({ isOpen: false, criterionId: '' });
  const [expandedCriteria, setExpandedCriteria] = useState<Set<string>>(new Set());

  // Use URL parameters or fall back to demo defaults
  const blueprintId = urlBlueprintId || 'demo-blueprint-001';
  const sectionId = urlSectionId || 'demo-section-001';

  // Import the mock data from the sidebar
  const sidebarData = [
    {
      id: '1',
      name: 'Mathematics',
      description: 'Core mathematical concepts and problem-solving',
      type: 'section' as const,
      itemCount: 3,
      children: [
        {
          id: '1-1',
          name: 'Calculus Fundamentals',
          description: 'Derivatives, integrals, and applications',
          type: 'blueprint' as const,
          itemCount: 2,
          children: [
            {
              id: '1-1-1',
              name: 'Derivatives Pathway',
              description: 'Understanding and applying derivatives',
              type: 'pathway' as const,
              itemCount: 5,
              masteryCriteria: [
                {
                  id: 'mc-1',
                  title: 'What is a derivative?',
                  description: 'Understand the basic concept of derivatives',
                  weight: 1.0,
                  uueStage: 'UNDERSTAND' as const,
                  complexityScore: 2.0,
                  assessmentType: 'QUESTION_BASED',
                  masteryThreshold: 0.8,
                  timeLimit: 300,
                  attemptsAllowed: 3,
                  questionInstances: [
                    {
                      id: 'qi-1',
                      questionText: 'What does a derivative represent?',
                      answer: 'Rate of change',
                      explanation: 'A derivative represents the instantaneous rate of change.',
                      context: 'Basic derivative concepts',
                      difficulty: 'EASY' as const,
                      masteryCriterionId: 'mc-1'
                    }
                  ],
                  prerequisiteFor: ['mc-2'],
                  requiresPrerequisites: []
                },
                {
                  id: 'mc-2',
                  title: 'Calculate basic derivatives',
                  description: 'Apply derivative rules to simple functions',
                  weight: 2.0,
                  uueStage: 'USE' as const,
                  complexityScore: 4.0,
                  assessmentType: 'APPLICATION_BASED',
                  masteryThreshold: 0.8,
                  timeLimit: 600,
                  attemptsAllowed: 3,
                  questionInstances: [
                    {
                      id: 'qi-2',
                      questionText: 'Find the derivative of f(x) = x²',
                      answer: '2x',
                      explanation: 'Using the power rule: d/dx(x^n) = n*x^(n-1)',
                      context: 'Power rule application',
                      difficulty: 'MEDIUM' as const,
                      masteryCriterionId: 'mc-2'
                    }
                  ],
                  prerequisiteFor: ['mc-3'],
                  requiresPrerequisites: ['mc-1']
                },
                {
                  id: 'mc-3',
                  title: 'Solve optimization problems',
                  description: 'Apply derivatives to real-world problems',
                  weight: 3.0,
                  uueStage: 'EXPLORE' as const,
                  complexityScore: 6.0,
                  assessmentType: 'APPLICATION_BASED',
                  masteryThreshold: 0.85,
                  timeLimit: 900,
                  attemptsAllowed: 2,
                  questionInstances: [
                    {
                      id: 'qi-3',
                      questionText: 'Find the maximum area of a rectangle with perimeter 20',
                      answer: '25 square units',
                      explanation: 'Use derivatives to find critical points and test for maximum',
                      context: 'Optimization problems',
                      difficulty: 'HARD' as const,
                      masteryCriterionId: 'mc-3'
                    }
                  ],
                  prerequisiteFor: [],
                  requiresPrerequisites: ['mc-1', 'mc-2']
                }
              ]
            },
            {
              id: '1-1-2',
              name: 'Integration Pathway',
              description: 'Learning integration techniques and applications',
              type: 'pathway' as const,
              itemCount: 4,
              masteryCriteria: [
                {
                  id: 'mc-4',
                  title: 'Understand antiderivatives',
                  description: 'Grasp the relationship between derivatives and antiderivatives',
                  weight: 1.5,
                  uueStage: 'UNDERSTAND' as const,
                  complexityScore: 3.0,
                  assessmentType: 'EXPLANATION_BASED',
                  masteryThreshold: 0.8,
                  timeLimit: 450,
                  attemptsAllowed: 3,
                  questionInstances: [
                    {
                      id: 'qi-4',
                      questionText: 'What is the antiderivative of 2x?',
                      answer: 'x² + C',
                      explanation: 'The antiderivative of 2x is x² + C, where C is the constant of integration.',
                      context: 'Basic antiderivative concepts',
                      difficulty: 'MEDIUM' as const,
                      masteryCriterionId: 'mc-4'
                    }
                  ],
                  prerequisiteFor: ['mc-5'],
                  requiresPrerequisites: ['mc-1']
                }
              ]
            }
          ]
        },
        {
          id: '1-2',
          name: 'Linear Algebra',
          description: 'Vectors, matrices, and linear transformations',
          type: 'blueprint' as const,
          itemCount: 1,
          children: [
            {
              id: '1-2-1',
              name: 'Vector Operations',
              description: 'Understanding vector addition, multiplication, and applications',
              type: 'pathway' as const,
              itemCount: 3,
              masteryCriteria: [
                {
                  id: 'mc-5',
                  title: 'Vector addition and subtraction',
                  description: 'Perform basic vector operations',
                  weight: 1.0,
                  uueStage: 'UNDERSTAND' as const,
                  complexityScore: 2.5,
                  assessmentType: 'QUESTION_BASED',
                  masteryThreshold: 0.8,
                  timeLimit: 300,
                  attemptsAllowed: 3,
                  questionInstances: [
                    {
                      id: 'qi-5',
                      questionText: 'Add the vectors (1, 2) and (3, 4)',
                      answer: '(4, 6)',
                      explanation: 'Add corresponding components: (1+3, 2+4) = (4, 6)',
                      context: 'Vector addition',
                      difficulty: 'EASY' as const,
                      masteryCriterionId: 'mc-5'
                    }
                  ],
                  prerequisiteFor: [],
                  requiresPrerequisites: []
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: '2',
      name: 'Computer Science',
      description: 'Programming, algorithms, and data structures',
      type: 'section' as const,
      itemCount: 2,
      children: [
        {
          id: '2-1',
          name: 'Data Structures',
          description: 'Understanding fundamental data structures',
          type: 'blueprint' as const,
          itemCount: 1,
          children: [
            {
              id: '2-1-1',
              name: 'Arrays and Lists',
              description: 'Linear data structures and their operations',
              type: 'pathway' as const,
              itemCount: 3,
              masteryCriteria: [
                {
                  id: 'mc-6',
                  title: 'Array fundamentals',
                  description: 'Understand basic array operations and memory layout',
                  weight: 1.0,
                  uueStage: 'UNDERSTAND' as const,
                  complexityScore: 2.0,
                  assessmentType: 'QUESTION_BASED',
                  masteryThreshold: 0.8,
                  timeLimit: 300,
                  attemptsAllowed: 3,
                  questionInstances: [
                    {
                      id: 'qi-6',
                      questionText: 'What is the time complexity of accessing an array element?',
                      answer: 'O(1)',
                      explanation: 'Array access is constant time because we can directly calculate the memory address.',
                      context: 'Array time complexity',
                      difficulty: 'EASY' as const,
                      masteryCriterionId: 'mc-6'
                    }
                  ],
                  prerequisiteFor: ['mc-7'],
                  requiresPrerequisites: []
                }
              ]
            }
          ]
        }
      ]
    }
  ];

  // Set initial data
  useEffect(() => {
    setCurrentBlueprint(sidebarData[0]);
    setSelectedItem(sidebarData[0]);
  }, []);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const handleItemSelect = (item: PathwaysItem) => {
    setSelectedItem(item);
    if (item.type === 'blueprint') {
      setCurrentBlueprint(item);
    }
  };

  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode);
  };

  const toggleCriterionExpanded = (criterionId: string) => {
    const newExpanded = new Set(expandedCriteria);
    if (newExpanded.has(criterionId)) {
      newExpanded.delete(criterionId);
    } else {
      newExpanded.add(criterionId);
    }
    setExpandedCriteria(newExpanded);
  };

  const handleAddMasteryCriterion = () => {
    setMasteryModal({ isOpen: true, editData: null });
  };

  const handleEditMasteryCriterion = (criterion: MasteryCriterion) => {
    setMasteryModal({ isOpen: true, editData: criterion });
  };

  const handleAddQuestion = (criterionId: string) => {
    setQuestionModal({ isOpen: true, criterionId, editData: null });
  };

  const handleEditQuestion = (question: QuestionInstance, criterionId: string) => {
    setQuestionModal({ isOpen: true, criterionId, editData: question });
  };

  const handleSaveMasteryCriterion = (formData: Partial<MasteryCriterion>) => {
    // In a real app, this would save to the backend
    console.log('Saving mastery criterion:', formData);
    setMasteryModal({ isOpen: false });
    // Refresh data or update local state
  };

  const handleSaveQuestion = (formData: Partial<QuestionInstance>) => {
    // In a real app, this would save to the backend
    console.log('Saving question:', formData);
    setQuestionModal({ isOpen: false, criterionId: '' });
    // Refresh data or update local state
  };

  const renderContentView = () => {
    if (viewMode === 'mindmap') {
      // Check if we have a blueprint to display
      if (!currentBlueprint) {
        return (
          <div className={styles.textContent}>
            <div className={styles.contentHeader}>
              <h1>Pathways Mind Map View</h1>
              <p>No blueprint selected</p>
            </div>
            <div className={styles.contentSections}>
              <section className={styles.contentSection}>
                <h2>Select a Blueprint</h2>
                <p>To view the pathways mind map, please select a blueprint from the sidebar.</p>
                <p>You can select a section, blueprint, or pathway to see its mastery criteria structure visualized.</p>
              </section>
            </div>
          </div>
        );
      }

      return (
        <MindMapView
          key={`pathways-${selectedItem?.id || 'default'}`}
          blueprintId={currentBlueprint.id}
          sectionId={sectionId}
          className={styles.mindMapContainer}
          selectedItem={selectedItem}
          pageType="pathways"
        />
      );
    }

    // Add debugging
    console.log('🔍 [PathwaysPage] Debug Info:', {
      viewMode,
      currentBlueprint: currentBlueprint?.name,
      selectedItem: selectedItem?.name,
      selectedItemType: selectedItem?.type,
      hasMasteryCriteria: (selectedItem?.masteryCriteria?.length || 0) > 0,
      hasPrimitives: false, // PathwaysPage should never have primitives
      pageType: 'pathways'
    });

    // Text mode content based on selected item
    if (!selectedItem) {
      return (
        <div className={styles.textContent}>
          <div className={styles.contentHeader}>
            <h1>Welcome to Learning Pathways</h1>
            <p>Select an item from the sidebar to view mastery criteria and learning paths</p>
          </div>
          
          <div className={styles.contentSections}>
            <section className={styles.contentSection}>
              <h2>Getting Started</h2>
              <p>Use the sidebar navigation to explore different learning sections, blueprints, and pathways. Click on any item to view its mastery criteria and prerequisite relationships.</p>
            </section>
          </div>
        </div>
      );
    }

    return (
      <div className={styles.textContent}>
        <div className={styles.contentHeader}>
          <h1>{selectedItem.name}</h1>
          {selectedItem.description && (
            <p className={styles.itemDescription}>{selectedItem.description}</p>
          )}
          <div className={styles.itemMeta}>
            <span className={styles.itemType}>{selectedItem.type}</span>
            <span className={styles.itemCount}>{selectedItem.itemCount} items</span>
            {selectedItem.difficulty && (
              <span className={styles.itemDifficulty}>{selectedItem.difficulty}</span>
            )}
          </div>
        </div>

        <div className={styles.contentSections}>
          {selectedItem.children && selectedItem.children.length > 0 && (
            <section className={styles.contentSection}>
              <h2>Learning Pathways</h2>
              <p>Explore the structured learning paths through mastery criteria.</p>
              <div className={styles.itemsGrid}>
                {selectedItem.children.map((child) => (
                  <div key={child.id} className={styles.itemCard}>
                    <h3>{child.name}</h3>
                    {child.description && <p>{child.description}</p>}
                    <div className={styles.itemCardMeta}>
                      <span className={styles.itemType}>{child.type}</span>
                      <span className={styles.itemCount}>{child.itemCount} criteria</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {selectedItem.masteryCriteria && selectedItem.masteryCriteria.length > 0 ? (
            <section className={styles.contentSection}>
              <div className={styles.sectionHeader}>
                <h2>Mastery Criteria</h2>
                <button 
                  className={styles.addButton}
                  onClick={handleAddMasteryCriterion}
                  title="Add Mastery Criterion"
                >
                  <FiPlus />
                  Add Criterion
                </button>
              </div>
              <p>Specific learning objectives and assessments that form the learning pathway.</p>
              <div className={styles.criteriaGrid}>
                {selectedItem.masteryCriteria.map((criterion) => (
                  <div key={criterion.id} className={styles.criterionCard}>
                    <div className={styles.criterionHeader}>
                      <div className={styles.criterionTitleRow}>
                        <button
                          className={styles.expandButton}
                          onClick={() => toggleCriterionExpanded(criterion.id)}
                          aria-label={expandedCriteria.has(criterion.id) ? 'Collapse' : 'Expand'}
                        >
                          {expandedCriteria.has(criterion.id) ? <FiChevronDown /> : <FiChevronRight />}
                        </button>
                        <h3>{criterion.title}</h3>
                        <div className={styles.criterionActions}>
                          <button
                            className={styles.actionButton}
                            onClick={() => handleEditMasteryCriterion(criterion)}
                            title="Edit Criterion"
                          >
                            <FiEdit3 />
                          </button>
                          <button
                            className={styles.actionButton}
                            onClick={() => handleAddQuestion(criterion.id)}
                            title="Add Question"
                          >
                            <FiPlus />
                          </button>
                        </div>
                      </div>
                      <div className={styles.criterionMeta}>
                        <span className={styles.criterionWeight}>Weight: {criterion.weight}</span>
                        <span className={styles.criterionStage}>{criterion.uueStage}</span>
                        <span className={styles.criterionType}>{criterion.assessmentType}</span>
                        <span className={styles.criterionThreshold}>Threshold: {criterion.masteryThreshold * 100}%</span>
                      </div>
                    </div>
                    
                    {criterion.description && (
                      <p className={styles.criterionDescription}>{criterion.description}</p>
                    )}
                    
                    <div className={styles.criterionDetails}>
                      <div className={styles.criterionStats}>
                        <span className={styles.criterionComplexity}>Complexity: {criterion.complexityScore}</span>
                        {criterion.timeLimit && (
                          <span className={styles.criterionTimeLimit}>Time Limit: {criterion.timeLimit}s</span>
                        )}
                        <span className={styles.criterionAttempts}>Attempts: {criterion.attemptsAllowed}</span>
                      </div>
                    </div>

                    {/* Prerequisites */}
                    {criterion.requiresPrerequisites && criterion.requiresPrerequisites.length > 0 && (
                      <div className={styles.prerequisites}>
                        <h5>Prerequisites</h5>
                        <div className={styles.prerequisiteTags}>
                          {criterion.requiresPrerequisites.map((prereqId) => {
                            const prereq = selectedItem.masteryCriteria?.find(c => c.id === prereqId);
                            return (
                              <span key={prereqId} className={styles.prerequisiteTag}>
                                {prereq ? prereq.title : `Criterion ${prereqId}`}
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Prerequisites for */}
                    {criterion.prerequisiteFor && criterion.prerequisiteFor.length > 0 && (
                      <div className={styles.prerequisitesFor}>
                        <h5>Required For</h5>
                        <div className={styles.prerequisiteTags}>
                          {criterion.prerequisiteFor.map((nextId) => {
                            const next = selectedItem.masteryCriteria?.find(c => c.id === nextId);
                            return (
                              <span key={nextId} className={styles.prerequisiteTag}>
                                {next ? next.title : `Criterion ${nextId}`}
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Expandable Question Instances */}
                    {expandedCriteria.has(criterion.id) && (
                      <div className={styles.questionInstances}>
                        <div className={styles.questionInstancesHeader}>
                          <h5>Practice Questions ({criterion.questionInstances.length})</h5>
                          <button
                            className={styles.addQuestionButton}
                            onClick={() => handleAddQuestion(criterion.id)}
                            title="Add Question"
                          >
                            <FiPlus />
                            Add Question
                          </button>
                        </div>
                        <div className={styles.questionList}>
                          {criterion.questionInstances.map((question) => (
                            <div key={question.id} className={styles.questionItem}>
                              <div className={styles.questionHeader}>
                                <strong>{question.questionText}</strong>
                                <div className={styles.questionActions}>
                                  <span className={`${styles.questionDifficulty} ${styles[question.difficulty.toLowerCase()]}`}>
                                    {question.difficulty}
                                  </span>
                                  <button
                                    className={styles.actionButton}
                                    onClick={() => handleEditQuestion(question, criterion.id)}
                                    title="Edit Question"
                                  >
                                    <FiEdit3 />
                                  </button>
                                </div>
                              </div>
                              {question.context && (
                                <p className={styles.questionContext}>{question.context}</p>
                              )}
                              <div className={styles.questionAnswer}>
                                <strong>Answer:</strong> {question.answer}
                              </div>
                              {question.explanation && (
                                <div className={styles.questionExplanation}>
                                  <strong>Explanation:</strong> {question.explanation}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          ) : (
            <section className={styles.contentSection}>
              <h2>Mastery Criteria</h2>
              <p>Learning objectives and assessments will appear here when you select a pathway.</p>
              <div className={styles.masteryGrid}>
                <div className={styles.masteryItem}>
                  <h4>Understanding Stage</h4>
                  <p>Basic comprehension and knowledge acquisition</p>
                </div>
                <div className={styles.masteryItem}>
                  <h4>Application Stage</h4>
                  <p>Practical use and problem-solving</p>
                </div>
                <div className={styles.masteryItem}>
                  <h4>Exploration Stage</h4>
                  <p>Advanced synthesis and creative application</p>
                </div>
              </div>
            </section>
          )}
          
          <section className={styles.contentSection}>
            <h2>Learning Pathway Structure</h2>
            <p>This pathway is designed with prerequisite relationships to ensure optimal learning progression.</p>
            <div className={styles.masteryGrid}>
              <div className={styles.masteryItem}>
                <h4>Prerequisites</h4>
                <p>Master foundational concepts before advancing</p>
              </div>
              <div className={styles.masteryItem}>
                <h4>Progressive Complexity</h4>
                <p>Build skills incrementally with increasing difficulty</p>
              </div>
              <div className={styles.masteryItem}>
                <h4>Assessment Types</h4>
                <p>Multiple assessment methods for comprehensive learning</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    );
  };

  return (
    <div className={styles.pathwaysPage}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <button
            className={styles.sidebarToggle}
            onClick={toggleSidebar}
            aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            ☰
          </button>
          <h1 className={styles.pageTitle}>Learning Pathways</h1>
        </div>
        
        <div className={styles.headerRight}>
          <select
            className={styles.blueprintSelector}
            value={currentBlueprint?.id || '1'}
            onChange={(e) => {
              const blueprint = sidebarData.find(bp => bp.id === e.target.value);
              if (blueprint) {
                setCurrentBlueprint(blueprint);
                setSelectedItem(blueprint);
              }
            }}
          >
            {sidebarData.map(blueprint => (
              <option key={blueprint.id} value={blueprint.id}>
                {blueprint.name}
              </option>
            ))}
          </select>
          <ViewModeToggle
            currentMode={viewMode}
            onModeChange={handleViewModeChange}
            className={styles.viewModeToggle}
          />
        </div>
      </header>

      {/* Main Content */}
      <div className={styles.mainContent}>
        {/* Sidebar */}
        <div className={`${styles.sidebar} ${sidebarCollapsed ? styles.collapsed : ''}`}>
          <PathwaysSidebar
            onItemSelect={handleItemSelect}
            onViewModeChange={handleViewModeChange}
            currentViewMode={viewMode}
          />
        </div>

        {/* Content Area */}
        <div className={styles.contentArea}>
          {renderContentView()}
        </div>
      </div>

      {/* Mastery Criterion Modal */}
      {masteryModal.isOpen && (
        <MasteryCriterionModal
          isOpen={masteryModal.isOpen}
          onClose={() => setMasteryModal({ isOpen: false })}
          onSave={handleSaveMasteryCriterion}
          editData={masteryModal.editData}
        />
      )}

      {/* Question Modal */}
      {questionModal.isOpen && (
        <QuestionModal
          isOpen={questionModal.isOpen}
          onClose={() => setQuestionModal({ isOpen: false, criterionId: '' })}
          onSave={handleSaveQuestion}
          criterionId={questionModal.criterionId}
          editData={questionModal.editData}
        />
      )}
    </div>
  );
};

// Mastery Criterion Modal Component
interface MasteryCriterionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<MasteryCriterion>) => void;
  editData?: MasteryCriterion | null;
}

const MasteryCriterionModal: React.FC<MasteryCriterionModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editData
}) => {
  const [formData, setFormData] = useState({
    title: editData?.title || '',
    description: editData?.description || '',
    weight: editData?.weight || 1.0,
    uueStage: editData?.uueStage || 'UNDERSTAND',
    complexityScore: editData?.complexityScore || 1,
    assessmentType: editData?.assessmentType || 'QUESTION_BASED',
    masteryThreshold: editData?.masteryThreshold || 0.8,
    timeLimit: editData?.timeLimit || 300,
    attemptsAllowed: editData?.attemptsAllowed || 3
  });

  useEffect(() => {
    if (editData) {
      setFormData({
        title: editData.title || '',
        description: editData.description || '',
        weight: editData.weight || 1.0,
        uueStage: editData.uueStage || 'UNDERSTAND',
        complexityScore: editData.complexityScore || 1,
        assessmentType: editData.assessmentType || 'QUESTION_BASED',
        masteryThreshold: editData.masteryThreshold || 0.8,
        timeLimit: editData.timeLimit || 300,
        attemptsAllowed: editData.attemptsAllowed || 3
      });
    }
  }, [editData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h2>{editData ? 'Edit Mastery Criterion' : 'Add Mastery Criterion'}</h2>
          <button className={styles.modalClose} onClick={onClose}>×</button>
        </div>
        <form onSubmit={handleSubmit} className={styles.modalForm}>
          <div className={styles.formGroup}>
            <label htmlFor="title">Title *</label>
            <input
              type="text"
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              placeholder="e.g., What is a derivative?"
            />
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="e.g., Understand the basic concept of derivatives"
              rows={3}
            />
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="weight">Weight</label>
              <input
                type="number"
                id="weight"
                value={formData.weight}
                onChange={(e) => setFormData({ ...formData, weight: parseFloat(e.target.value) })}
                min="0.1"
                max="10"
                step="0.1"
              />
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="complexityScore">Complexity Score</label>
              <input
                type="number"
                id="complexityScore"
                value={formData.complexityScore}
                onChange={(e) => setFormData({ ...formData, complexityScore: parseInt(e.target.value) })}
                min="1"
                max="10"
              />
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="uueStage">UUE Stage</label>
              <select
                id="uueStage"
                value={formData.uueStage}
                onChange={(e) => setFormData({ ...formData, uueStage: e.target.value as 'UNDERSTAND' | 'USE' | 'EXPLORE' })}
              >
                <option value="UNDERSTAND">Understand</option>
                <option value="USE">Use</option>
                <option value="EXPLORE">Explore</option>
              </select>
          </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="assessmentType">Assessment Type</label>
              <select
                id="assessmentType"
                value={formData.assessmentType}
                onChange={(e) => setFormData({ ...formData, assessmentType: e.target.value })}
              >
                <option value="QUESTION_BASED">Question Based</option>
                <option value="EXPLANATION_BASED">Explanation Based</option>
                <option value="APPLICATION_BASED">Application Based</option>
                <option value="COMPARISON_BASED">Comparison Based</option>
                <option value="CREATION_BASED">Creation Based</option>
              </select>
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="masteryThreshold">Mastery Threshold</label>
              <input
                type="number"
                id="masteryThreshold"
                value={formData.masteryThreshold}
                onChange={(e) => setFormData({ ...formData, masteryThreshold: parseFloat(e.target.value) })}
                min="0.1"
                max="1"
                step="0.1"
              />
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="timeLimit">Time Limit (seconds)</label>
              <input
                type="number"
                id="timeLimit"
                value={formData.timeLimit}
                onChange={(e) => setFormData({ ...formData, timeLimit: parseInt(e.target.value) })}
                min="30"
                step="30"
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="attemptsAllowed">Attempts Allowed</label>
            <input
              type="number"
              id="attemptsAllowed"
              value={formData.attemptsAllowed}
              onChange={(e) => setFormData({ ...formData, attemptsAllowed: parseInt(e.target.value) })}
              min="1"
              max="10"
            />
          </div>

          <div className={styles.modalActions}>
            <button type="button" className={styles.cancelButton} onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className={styles.saveButton}>
              {editData ? 'Update' : 'Create'} Criterion
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Question Modal Component
interface QuestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<QuestionInstance>) => void;
  criterionId: string;
  editData?: QuestionInstance | null;
}

const QuestionModal: React.FC<QuestionModalProps> = ({
  isOpen,
  onClose,
  onSave,
  criterionId,
  editData
}) => {
  const [formData, setFormData] = useState({
    questionText: editData?.questionText || '',
    answer: editData?.answer || '',
    explanation: editData?.explanation || '',
    context: editData?.context || '',
    difficulty: editData?.difficulty || 'MEDIUM'
  });

  useEffect(() => {
    if (editData) {
      setFormData({
        questionText: editData.questionText || '',
        answer: editData.answer || '',
        explanation: editData.explanation || '',
        context: editData.context || '',
        difficulty: editData.difficulty || 'MEDIUM'
      });
    }
  }, [editData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      masteryCriterionId: criterionId
    });
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h2>{editData ? 'Edit Question' : 'Add Question'}</h2>
          <button className={styles.modalClose} onClick={onClose}>×</button>
        </div>
        <form onSubmit={handleSubmit} className={styles.modalForm}>
          <div className={styles.formGroup}>
            <label htmlFor="questionText">Question Text *</label>
            <textarea
              id="questionText"
              value={formData.questionText}
              onChange={(e) => setFormData({ ...formData, questionText: e.target.value })}
              required
              placeholder="Enter the question text"
              rows={3}
            />
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="answer">Correct Answer *</label>
            <input
              type="text"
              id="answer"
              value={formData.answer}
              onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
              required
              placeholder="Enter the correct answer"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="explanation">Explanation</label>
            <textarea
              id="explanation"
              value={formData.explanation}
              onChange={(e) => setFormData({ ...formData, explanation: e.target.value })}
              placeholder="Explain why this answer is correct"
              rows={3}
            />
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="context">Context</label>
              <input
                type="text"
                id="context"
                value={formData.context}
                placeholder="Additional context for the question"
                onChange={(e) => setFormData({ ...formData, context: e.target.value })}
              />
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="difficulty">Difficulty</label>
              <select
                id="difficulty"
                value={formData.difficulty}
                onChange={(e) => setFormData({ ...formData, difficulty: e.target.value as 'EASY' | 'MEDIUM' | 'HARD' })}
              >
                <option value="EASY">Easy</option>
                <option value="MEDIUM">Medium</option>
                <option value="HARD">Hard</option>
              </select>
            </div>
          </div>

          <div className={styles.modalActions}>
            <button type="button" className={styles.cancelButton} onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className={styles.saveButton}>
              {editData ? 'Update' : 'Create'} Question
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PathwaysPage;

