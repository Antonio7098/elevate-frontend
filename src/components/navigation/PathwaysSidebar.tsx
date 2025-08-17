import React, { useState, useEffect } from 'react';
import ViewModeToggle from '../common/ViewModeToggle';
import styles from './PathwaysSidebar.module.css';

// Mock data for mastery criteria and pathways
const mockData = {
  items: [
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
  ]
};

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
  prerequisiteFor: string[];
  requiresPrerequisites: string[];
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

interface PathwaysSidebarProps {
  onItemSelect: (item: PathwaysItem) => void;
  onViewModeChange: (mode: 'text' | 'mindmap') => void;
  currentViewMode: 'text' | 'mindmap';
}

const PathwaysSidebar: React.FC<PathwaysSidebarProps> = ({
  onItemSelect,
  onViewModeChange,
  currentViewMode
}) => {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set(['1', '1-1']));
  const [selectedItem, setSelectedItem] = useState<PathwaysItem | null>(null);

  const toggleExpanded = (itemId: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(itemId)) {
      newExpanded.delete(itemId);
    } else {
      newExpanded.add(itemId);
    }
    setExpandedItems(newExpanded);
  };

  const handleItemClick = (item: PathwaysItem) => {
    setSelectedItem(item);
    onItemSelect(item);
  };

  const renderItem = (item: PathwaysItem, depth: number = 0) => {
    const isExpanded = expandedItems.has(item.id);
    const hasChildren = item.children && item.children.length > 0;
    const hasMasteryCriteria = item.masteryCriteria && item.masteryCriteria.length > 0;

    return (
      <div key={item.id} className={styles.sidebarItem}>
        <div
          className={`${styles.itemHeader} ${selectedItem?.id === item.id ? styles.selected : ''}`}
          style={{ paddingLeft: `${16 + depth * 20}px` }}
        >
          {hasChildren && (
            <button
              className={`${styles.expandButton} ${isExpanded ? styles.expanded : ''}`}
              onClick={() => toggleExpanded(item.id)}
              aria-label={isExpanded ? 'Collapse' : 'Expand'}
            >
              {isExpanded ? '▼' : '▶'}
            </button>
          )}
          
          <div
            className={styles.itemContent}
            onClick={() => handleItemClick(item)}
          >
            <div className={styles.itemIcon}>
              {item.type === 'section' && '📚'}
              {item.type === 'blueprint' && '🗺️'}
              {item.type === 'pathway' && '🛤️'}
            </div>
            
            <div className={styles.itemInfo}>
              <div className={styles.itemName}>{item.name}</div>
              {item.description && (
                <div className={styles.itemDescription}>{item.description}</div>
              )}
              <div className={styles.itemMeta}>
                <span className={styles.itemType}>{item.type}</span>
                <span className={styles.itemCount}>
                  {hasMasteryCriteria && item.masteryCriteria ? `${item.masteryCriteria.length} criteria` : `${item.itemCount} items`}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Mastery Criteria */}
        {isExpanded && hasMasteryCriteria && item.masteryCriteria && (
          <div className={styles.masteryCriteriaList}>
            {item.masteryCriteria.map((criterion) => (
              <div key={criterion.id} className={styles.criterionItem}>
                <div
                  className={`${styles.criterionHeader} ${selectedItem?.id === criterion.id ? styles.selected : ''}`}
                  onClick={() => handleItemClick({ 
                    id: criterion.id,
                    name: criterion.title,
                    description: criterion.description,
                    type: 'pathway' as const, 
                    itemCount: criterion.questionInstances.length,
                    masteryCriteria: [criterion]
                  })}
                >
                  <div className={styles.criterionIcon}>🎯</div>
                  <div className={styles.criterionInfo}>
                    <div className={styles.criterionTitle}>{criterion.title}</div>
                    <div className={styles.criterionMeta}>
                      <span className={styles.criterionStage}>{criterion.uueStage}</span>
                      <span className={styles.criterionWeight}>W: {criterion.weight}</span>
                      <span className={styles.criterionComplexity}>C: {criterion.complexityScore}</span>
                    </div>
                  </div>
                </div>
                
                {/* Question Instances */}
                {criterion.questionInstances && criterion.questionInstances.length > 0 && (
                  <div className={styles.questionInstancesList}>
                    {criterion.questionInstances.map((question) => (
                      <div key={question.id} className={styles.questionItem}>
                        <div className={styles.questionIcon}>❓</div>
                        <div className={styles.questionInfo}>
                          <div className={styles.questionText}>{question.questionText}</div>
                          <div className={styles.questionMeta}>
                            <span className={`${styles.questionDifficulty} ${styles[question.difficulty.toLowerCase()]}`}>
                              {question.difficulty}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Children */}
        {isExpanded && hasChildren && item.children && (
          <div className={styles.childrenList}>
            {item.children.map((child) => renderItem(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={styles.pathwaysSidebar}>
      <div className={styles.sidebarHeader}>
        <h3>Learning Pathways</h3>
        <ViewModeToggle
          currentMode={currentViewMode}
          onModeChange={onViewModeChange}
          className={styles.viewModeToggle}
        />
      </div>
      
      <div className={styles.sidebarContent}>
        {mockData.items.map((item) => renderItem(item))}
      </div>
    </div>
  );
};

export default PathwaysSidebar;
