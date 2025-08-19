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
  description: string;
  type: 'knowledge' | 'skill' | 'application';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  prerequisites: string[];
  dependencies: string[];
  assessmentCriteria: string[];
  resources: string[];
  estimatedTime: string;
}

interface PathwaysItem {
  id: string;
  title: string;
  description?: string;
  type: 'section' | 'blueprint' | 'pathway';
  children?: PathwaysItem[];
  masteryCriteria?: MasteryCriterion[];
  difficulty?: string;
  estimatedHours?: number;
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

  // Enhanced mock data with complex mastery criteria
  const enhancedSidebarData = [
    {
      id: '1',
      title: 'Computer Science Fundamentals',
      type: 'section',
      children: [
        {
          id: '1.1',
          title: 'Programming Basics',
          type: 'blueprint',
          children: [
            {
              id: '1.1.1',
              title: 'Python Fundamentals',
              type: 'pathway',
              description: 'Master the basics of Python programming',
              difficulty: 'Beginner',
              estimatedHours: 40,
              masteryCriteria: [
                {
                  id: 'mc-1.1.1.1',
                  title: 'Variables and Data Types',
                  description: 'Understand Python variables, integers, floats, strings, and booleans',
                  type: 'knowledge',
                  difficulty: 'Beginner',
                  prerequisites: [],
                  dependencies: [],
                  assessmentCriteria: [
                    'Can declare and initialize variables',
                    'Understands type conversion',
                    'Can perform basic operations on different data types'
                  ],
                  resources: ['Python Official Docs', 'Codecademy Python Course'],
                  estimatedTime: '2 hours'
                },
                {
                  id: 'mc-1.1.1.2',
                  title: 'Control Flow',
                  description: 'Master if-else statements, loops, and conditional logic',
                  type: 'skill',
                  difficulty: 'Beginner',
                  prerequisites: ['mc-1.1.1.1'],
                  dependencies: [],
                  assessmentCriteria: [
                    'Can write if-else statements with multiple conditions',
                    'Understands for and while loops',
                    'Can use break and continue statements'
                  ],
                  resources: ['Python Control Flow Tutorial', 'Practice Exercises'],
                  estimatedTime: '3 hours'
                },
                {
                  id: 'mc-1.1.1.3',
                  title: 'Functions and Scope',
                  description: 'Create and use functions with proper scope management',
                  type: 'skill',
                  difficulty: 'Intermediate',
                  prerequisites: ['mc-1.1.1.2'],
                  dependencies: ['mc-1.1.1.1'],
                  assessmentCriteria: [
                    'Can define functions with parameters',
                    'Understands return values',
                    'Grasps local vs global scope',
                    'Can use default arguments'
                  ],
                  resources: ['Function Tutorial', 'Scope Examples'],
                  estimatedTime: '4 hours'
                }
              ]
            },
            {
              id: '1.1.2',
              title: 'Object-Oriented Programming',
              type: 'pathway',
              description: 'Learn OOP principles and implementation',
              difficulty: 'Intermediate',
              estimatedHours: 60,
              masteryCriteria: [
                {
                  id: 'mc-1.1.2.1',
                  title: 'Classes and Objects',
                  description: 'Understand class definition, instantiation, and basic OOP concepts',
                  type: 'knowledge',
                  difficulty: 'Intermediate',
                  prerequisites: ['mc-1.1.1.3'],
                  dependencies: [],
                  assessmentCriteria: [
                    'Can define a class with attributes and methods',
                    'Understands constructor methods',
                    'Can create and use object instances'
                  ],
                  resources: ['OOP Tutorial', 'Class Examples'],
                  estimatedTime: '5 hours'
                },
                {
                  id: 'mc-1.1.2.2',
                  title: 'Inheritance and Polymorphism',
                  description: 'Master inheritance hierarchies and polymorphic behavior',
                  type: 'skill',
                  difficulty: 'Advanced',
                  prerequisites: ['mc-1.1.2.1'],
                  dependencies: ['mc-1.1.1.3'],
                  assessmentCriteria: [
                    'Can create inheritance hierarchies',
                    'Understands method overriding',
                    'Can implement abstract classes',
                    'Grasps polymorphic behavior'
                  ],
                  resources: ['Inheritance Guide', 'Polymorphism Examples'],
                  estimatedTime: '8 hours'
                }
              ]
            }
          ]
        },
        {
          id: '1.2',
          title: 'Data Structures',
          type: 'blueprint',
          children: [
            {
              id: '1.2.1',
              title: 'Linear Data Structures',
              type: 'pathway',
              description: 'Master arrays, linked lists, stacks, and queues',
              difficulty: 'Intermediate',
              estimatedHours: 50,
              masteryCriteria: [
                {
                  id: 'mc-1.2.1.1',
                  title: 'Arrays and Lists',
                  description: 'Understand array operations, dynamic arrays, and list implementations',
                  type: 'knowledge',
                  difficulty: 'Intermediate',
                  prerequisites: ['mc-1.1.1.2'],
                  dependencies: [],
                  assessmentCriteria: [
                    'Can implement basic array operations',
                    'Understands time complexity of operations',
                    'Can work with dynamic arrays',
                    'Grasps list vs array differences'
                  ],
                  resources: ['Data Structures Book', 'Array Tutorial'],
                  estimatedTime: '6 hours'
                },
                {
                  id: 'mc-1.2.1.2',
                  title: 'Linked Lists',
                  description: 'Implement and manipulate singly and doubly linked lists',
                  type: 'skill',
                  difficulty: 'Intermediate',
                  prerequisites: ['mc-1.2.1.1'],
                  dependencies: ['mc-1.1.1.3'],
                  assessmentCriteria: [
                    'Can implement singly linked list',
                    'Can implement doubly linked list',
                    'Understands insertion and deletion',
                    'Can reverse a linked list'
                  ],
                  resources: ['Linked List Guide', 'Implementation Examples'],
                  estimatedTime: '8 hours'
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: '2',
      title: 'Mathematics for CS',
      type: 'section',
      children: [
        {
          id: '2.1',
          title: 'Discrete Mathematics',
          type: 'blueprint',
          children: [
            {
              id: '2.1.1',
              title: 'Logic and Proofs',
              type: 'pathway',
              description: 'Master mathematical logic, proofs, and reasoning',
              difficulty: 'Advanced',
              estimatedHours: 80,
              masteryCriteria: [
                {
                  id: 'mc-2.1.1.1',
                  title: 'Propositional Logic',
                  description: 'Understand logical operators, truth tables, and logical equivalences',
                  type: 'knowledge',
                  difficulty: 'Advanced',
                  prerequisites: [],
                  dependencies: [],
                  assessmentCriteria: [
                    'Can construct truth tables',
                    'Understands logical operators',
                    'Can prove logical equivalences',
                    'Can use De Morgan\'s laws'
                  ],
                  resources: ['Logic Textbook', 'Truth Table Generator'],
                  estimatedTime: '10 hours'
                },
                {
                  id: 'mc-2.1.1.2',
                  title: 'Mathematical Induction',
                  description: 'Master proof by induction and strong induction',
                  type: 'skill',
                  difficulty: 'Advanced',
                  prerequisites: ['mc-2.1.1.1'],
                  dependencies: [],
                  assessmentCriteria: [
                    'Can identify when to use induction',
                    'Can write base case and inductive step',
                    'Understands strong induction',
                    'Can prove recursive formulas'
                  ],
                  resources: ['Induction Guide', 'Proof Examples'],
                  estimatedTime: '12 hours'
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
    // Use enhanced data instead of basic sidebarData
    const data = enhancedSidebarData as PathwaysItem[];
    
    // Find first pathway with mastery criteria for initial display
    const findFirstPathway = (items: PathwaysItem[]): PathwaysItem | null => {
      for (const item of items) {
        if (item.children) {
          const pathway = findFirstPathway(item.children);
          if (pathway) return pathway;
        }
        if (item.type === 'pathway' && item.masteryCriteria && item.masteryCriteria.length > 0) {
          return item;
        }
      }
      return null;
    };
    
    const firstPathway = findFirstPathway(data);
    if (firstPathway) {
      setCurrentBlueprint(firstPathway);
      setSelectedItem(firstPathway);
    } else {
      setCurrentBlueprint(data[0]);
      setSelectedItem(data[0]);
    }
  }, []);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const handleItemSelect = (item: PathwaysItem) => {
    console.log('🔍 [PathwaysPage] Item selected:', {
      title: item.title,
      type: item.type,
      hasMasteryCriteria: (item as any).masteryCriteria?.length > 0,
      hasChildren: (item as any).children?.length > 0
    });

    setSelectedItem(item);
    
    // If this is a pathway with mastery criteria, use it directly
    if (item.type === 'pathway' && (item as any).masteryCriteria && (item as any).masteryCriteria.length > 0) {
      setCurrentBlueprint(item);
      console.log('🔍 [PathwaysPage] Selected pathway with mastery criteria:', item.title);
    }
    // If this is a blueprint, find its first pathway
    else if (item.type === 'blueprint' && (item as any).children && (item as any).children.length > 0) {
      const pathway = (item as any).children.find((child: any) => 
        child.type === 'pathway' && (child as any).masteryCriteria && (child as any).masteryCriteria.length > 0
      );
      if (pathway) {
        setCurrentBlueprint(pathway);
        console.log('🔍 [PathwaysPage] Found pathway in blueprint:', pathway.title);
      } else {
        setCurrentBlueprint(item);
        console.log('🔍 [PathwaysPage] No pathway found in blueprint, using blueprint itself');
      }
    }
    // If this is a section, find its first pathway
    else if (item.type === 'section' && (item as any).children && (item as any).children.length > 0) {
      const findFirstPathway = (items: any[]): any => {
        for (const child of items) {
          if (child.type === 'pathway' && (child as any).masteryCriteria && (child as any).masteryCriteria.length > 0) {
            return child;
          }
          if ((child as any).children) {
            const pathway = findFirstPathway((child as any).children);
            if (pathway) return pathway;
          }
        }
        return null;
      };
      
      const pathway = findFirstPathway((item as any).children);
      if (pathway) {
        setCurrentBlueprint(pathway);
        console.log('🔍 [PathwaysPage] Found pathway in section:', pathway.title);
      } else {
        setCurrentBlueprint(item);
        console.log('🔍 [PathwaysPage] No pathway found in section, using section itself');
      }
    }
    // Otherwise, use the item as is
    else {
      setCurrentBlueprint(item);
      console.log('🔍 [PathwaysPage] Using selected item as blueprint:', item.title);
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
      currentBlueprint: currentBlueprint?.title,
      selectedItem: selectedItem?.title,
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
          <h1>{selectedItem.title}</h1>
          {selectedItem.description && (
            <p className={styles.itemDescription}>{selectedItem.description}</p>
          )}
          <div className={styles.itemMeta}>
            <span className={styles.itemType}>{selectedItem.type}</span>
            <span className={styles.itemCount}>{(selectedItem as any).masteryCriteria?.length || 0} criteria</span>
            {selectedItem.difficulty && (
              <span className={styles.itemDifficulty}>{selectedItem.difficulty}</span>
            )}
          </div>
        </div>

        <div className={styles.contentSections}>
          {(selectedItem as any).children && (selectedItem as any).children.length > 0 && (
            <section className={styles.contentSection}>
              <h2>Learning Pathways</h2>
              <p>Explore the structured learning paths through mastery criteria.</p>
              <div className={styles.itemsGrid}>
                {(selectedItem as any).children.map((child: any) => (
                  <div key={child.id} className={styles.itemCard}>
                    <h3>{child.title}</h3>
                    {child.description && <p>{child.description}</p>}
                    <div className={styles.itemCardMeta}>
                      <span className={styles.itemType}>{child.type}</span>
                      <span className={styles.itemCount}>{(child as any).masteryCriteria?.length || 0} criteria</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {(selectedItem as any).masteryCriteria && (selectedItem as any).masteryCriteria.length > 0 ? (
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
                {(selectedItem as any).masteryCriteria.map((criterion: MasteryCriterion) => (
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
                        <span className={styles.criterionType}>{criterion.type}</span>
                        <span className={styles.criterionDifficulty}>{criterion.difficulty}</span>
                        <span className={styles.criterionTime}>{criterion.estimatedTime}</span>
                      </div>
                    </div>
                    
                    {criterion.description && (
                      <p className={styles.criterionDescription}>{criterion.description}</p>
                    )}
                    
                    <div className={styles.criterionDetails}>
                      <div className={styles.criterionStats}>
                        <span className={styles.criterionPrerequisites}>
                          Prerequisites: {criterion.prerequisites.length > 0 ? criterion.prerequisites.join(', ') : 'None'}
                        </span>
                        <span className={styles.criterionDependencies}>
                          Dependencies: {criterion.dependencies.length > 0 ? criterion.dependencies.join(', ') : 'None'}
                        </span>
                      </div>
                    </div>

                    {/* Prerequisites */}
                    {criterion.prerequisites && criterion.prerequisites.length > 0 && (
                      <div className={styles.prerequisites}>
                        <h5>Prerequisites</h5>
                        <div className={styles.prerequisiteTags}>
                          {criterion.prerequisites.map((prereqId: string) => {
                            const prereq = (selectedItem as any).masteryCriteria?.find((c: any) => c.id === prereqId);
                            return (
                              <span key={prereqId} className={styles.prerequisiteTag}>
                                {prereq?.title || prereqId}
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Dependencies */}
                    {criterion.dependencies && criterion.dependencies.length > 0 && (
                      <div className={styles.dependencies}>
                        <h5>Dependencies</h5>
                        <div className={styles.dependencyTags}>
                          {criterion.dependencies.map((depId: string) => {
                            const dep = (selectedItem as any).masteryCriteria?.find((c: any) => c.id === depId);
                            return (
                              <span key={depId} className={styles.dependencyTag}>
                                {dep?.title || depId}
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Assessment Criteria */}
                    {criterion.assessmentCriteria && criterion.assessmentCriteria.length > 0 && (
                      <div className={styles.assessmentCriteria}>
                        <h5>Assessment Criteria</h5>
                        <ul className={styles.criteriaList}>
                          {criterion.assessmentCriteria.map((criteria, index) => (
                            <li key={index} className={styles.criteriaItem}>
                              {criteria}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Resources */}
                    {criterion.resources && criterion.resources.length > 0 && (
                      <div className={styles.resources}>
                        <h5>Learning Resources</h5>
                        <div className={styles.resourceTags}>
                          {criterion.resources.map((resource, index) => (
                            <span key={index} className={styles.resourceTag}>
                              {resource}
                            </span>
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
              const blueprint = enhancedSidebarData.find(bp => bp.id === e.target.value) as PathwaysItem;
              if (blueprint) {
                setCurrentBlueprint(blueprint);
                setSelectedItem(blueprint);
              }
            }}
          >
            {enhancedSidebarData.map(blueprint => (
              <option key={blueprint.id} value={blueprint.id}>
                {blueprint.title}
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
    type: editData?.type || 'knowledge',
    difficulty: editData?.difficulty || 'Beginner',
    prerequisites: editData?.prerequisites || [],
    dependencies: editData?.dependencies || [],
    assessmentCriteria: editData?.assessmentCriteria || [],
    resources: editData?.resources || [],
    estimatedTime: editData?.estimatedTime || '1 hour'
  });

  useEffect(() => {
    if (editData) {
      setFormData({
        title: editData.title || '',
        description: editData.description || '',
        type: editData.type || 'knowledge',
        difficulty: editData.difficulty || 'Beginner',
        prerequisites: editData.prerequisites || [],
        dependencies: editData.dependencies || [],
        assessmentCriteria: editData.assessmentCriteria || [],
        resources: editData.resources || [],
        estimatedTime: editData.estimatedTime || '1 hour'
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
              <label htmlFor="type">Type</label>
              <select
                id="type"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as 'knowledge' | 'skill' | 'application' })}
              >
                <option value="knowledge">Knowledge</option>
                <option value="skill">Skill</option>
                <option value="application">Application</option>
              </select>
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="difficulty">Difficulty</label>
              <select
                id="difficulty"
                value={formData.difficulty}
                onChange={(e) => setFormData({ ...formData, difficulty: e.target.value as 'Beginner' | 'Intermediate' | 'Advanced' })}
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="estimatedTime">Estimated Time</label>
            <input
              type="text"
              id="estimatedTime"
              value={formData.estimatedTime}
              onChange={(e) => setFormData({ ...formData, estimatedTime: e.target.value })}
              placeholder="e.g., 2 hours, 30 minutes"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="prerequisites">Prerequisites (comma-separated IDs)</label>
            <input
              type="text"
              id="prerequisites"
              value={formData.prerequisites.join(', ')}
              onChange={(e) => setFormData({ ...formData, prerequisites: e.target.value.split(',').map(s => s.trim()).filter(s => s) })}
              placeholder="e.g., mc-1.1.1.1, mc-1.1.1.2"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="dependencies">Dependencies (comma-separated IDs)</label>
            <input
              type="text"
              id="dependencies"
              value={formData.dependencies.join(', ')}
              onChange={(e) => setFormData({ ...formData, dependencies: e.target.value.split(',').map(s => s.trim()).filter(s => s) })}
              placeholder="e.g., mc-1.1.1.1, mc-1.1.1.2"
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

