import React, { useState, useEffect } from 'react';
import ViewModeToggle from '../common/ViewModeToggle';
import styles from './PathwaysSidebar.module.css';

// Mock data for mastery criteria and pathways
const mockData = {
  items: [
    {
      id: '1',
      title: 'Mathematics',
      description: 'Core mathematical concepts and problem-solving',
      type: 'section' as const,
      children: [
        {
          id: '1-1',
          title: 'Calculus Fundamentals',
          description: 'Derivatives, integrals, and applications',
          type: 'blueprint' as const,
          children: [
            {
              id: '1-1-1',
              title: 'Derivatives Pathway',
              description: 'Understanding and applying derivatives',
              type: 'pathway' as const,
              masteryCriteria: [
                {
                  id: 'mc-1',
                  title: 'What is a derivative?',
                  description: 'Understand the basic concept of derivatives',
                  type: 'knowledge' as const,
                  difficulty: 'Beginner' as const,
                  prerequisites: [],
                  dependencies: [],
                  assessmentCriteria: [
                    'Can explain the geometric meaning of derivatives',
                    'Understands rate of change concepts',
                    'Can identify when derivatives are useful'
                  ],
                  resources: ['Calculus Textbook', 'Derivative Tutorial'],
                  estimatedTime: '2 hours',
                  isMastered: true,
                  masteryScore: 0.95
                },
                {
                  id: 'mc-2',
                  title: 'Calculate basic derivatives',
                  description: 'Apply derivative rules to simple functions',
                  type: 'skill' as const,
                  difficulty: 'Intermediate' as const,
                  prerequisites: ['mc-1'],
                  dependencies: [],
                  assessmentCriteria: [
                    'Can apply power rule to simple functions',
                    'Understands product and chain rules',
                    'Can solve basic derivative problems'
                  ],
                  resources: ['Derivative Rules Guide', 'Practice Problems'],
                  estimatedTime: '3 hours',
                  isMastered: true,
                  masteryScore: 0.87,
                  questionInstances: [
                    {
                      id: 'q-2-1',
                      questionText: 'What is the derivative of x²?',
                      answer: '2x',
                      explanation: 'Using the power rule: d/dx(x^n) = n*x^(n-1)',
                      difficulty: 'MEDIUM'
                    },
                    {
                      id: 'q-2-2',
                      questionText: 'Find the derivative of 3x³ + 2x',
                      answer: '9x² + 2',
                      explanation: 'Apply power rule to each term separately'
                    }
                  ]
                },
                {
                  id: 'mc-3',
                  title: 'Solve optimization problems',
                  description: 'Apply derivatives to real-world problems',
                  type: 'application' as const,
                  difficulty: 'Advanced' as const,
                  prerequisites: ['mc-1', 'mc-2'],
                  dependencies: [],
                  assessmentCriteria: [
                    'Can solve optimization problems using derivatives',
                    'Understands real-world applications',
                    'Can analyze critical points and extrema'
                  ],
                  resources: ['Optimization Problems', 'Real-World Applications'],
                  estimatedTime: '4 hours',
                  isMastered: false,
                  masteryScore: 0.45,
                  questionInstances: [
                    {
                      id: 'q-3-1',
                      questionText: 'Find the maximum area of a rectangle with perimeter 20',
                      answer: '25 square units',
                      explanation: 'Use A = x(10-x) and find critical points'
                    }
                  ]
                }
              ]
            },
            {
              id: '1-1-2',
              title: 'Integration Pathway',
              description: 'Learning integration techniques and applications',
              type: 'pathway' as const,
              masteryCriteria: [
                {
                  id: 'mc-4',
                  title: 'Understand antiderivatives',
                  description: 'Grasp the relationship between derivatives and antiderivatives',
                  type: 'knowledge' as const,
                  difficulty: 'Intermediate' as const,
                  prerequisites: ['mc-1'],
                  dependencies: [],
                  assessmentCriteria: [
                    'Can explain the relationship between derivatives and antiderivatives',
                    'Understands the constant of integration',
                    'Can identify basic antiderivatives'
                  ],
                  resources: ['Integration Guide', 'Antiderivative Tutorial'],
                  estimatedTime: '2.5 hours',
                  isMastered: false,
                  masteryScore: 0.32,
                  questionInstances: [
                    {
                      id: 'q-4-1',
                      questionText: 'What is the antiderivative of 2x?',
                      answer: 'x² + C',
                      explanation: 'The antiderivative of 2x is x² plus a constant'
                    }
                  ]
                }
              ]
            }
          ]
        },
        {
          id: '1-2',
          title: 'Linear Algebra',
          description: 'Vectors, matrices, and linear transformations',
          type: 'blueprint' as const,
          children: [
            {
              id: '1-2-1',
              title: 'Vector Operations',
              description: 'Understanding vector addition, multiplication, and applications',
              type: 'pathway' as const,
              masteryCriteria: [
                {
                  id: 'mc-5',
                  title: 'Vector addition and subtraction',
                  description: 'Perform basic vector operations',
                  type: 'skill' as const,
                  difficulty: 'Beginner' as const,
                  prerequisites: [],
                  dependencies: [],
                  assessmentCriteria: [
                    'Can add and subtract vectors component-wise',
                    'Understands vector magnitude and direction',
                    'Can visualize vector operations'
                  ],
                  resources: ['Vector Operations Guide', 'Interactive Vector Tool'],
                  estimatedTime: '2 hours'
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: '2',
      title: 'Computer Science',
      description: 'Programming, algorithms, and data structures',
      type: 'section' as const,
      children: [
        {
          id: '2-1',
          title: 'Data Structures',
          description: 'Understanding fundamental data structures',
          type: 'blueprint' as const,
          children: [
            {
              id: '2-1-1',
              title: 'Arrays and Lists',
              description: 'Linear data structures and their operations',
              type: 'pathway' as const,
              masteryCriteria: [
                {
                  id: 'mc-6',
                  title: 'Array fundamentals',
                  description: 'Understand basic array operations and memory layout',
                  type: 'knowledge' as const,
                  difficulty: 'Beginner' as const,
                  prerequisites: [],
                  dependencies: [],
                  assessmentCriteria: [
                    'Can explain array memory layout',
                    'Understands time complexity of array operations',
                    'Can identify when to use arrays vs lists'
                  ],
                  resources: ['Data Structures Guide', 'Memory Layout Tutorial'],
                  estimatedTime: '2.5 hours'
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
  description: string;
  type: 'knowledge' | 'skill' | 'application';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  prerequisites: string[];
  dependencies: string[];
  assessmentCriteria: string[];
  resources: string[];
  estimatedTime: string;
  isMastered: boolean;
  masteryScore: number;
  questionInstances?: QuestionInstance[];
}

interface QuestionInstance {
  id: string;
  questionText: string;
  answer: string;
  explanation: string;
  difficulty?: 'EASY' | 'MEDIUM' | 'HARD';
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
              <div className={styles.itemName}>{item.title}</div>
              {item.description && (
                <div className={styles.itemDescription}>{item.description}</div>
              )}
              <div className={styles.itemMeta}>
                <span className={styles.itemType}>{item.type}</span>
                <span className={styles.itemCount}>
                  {hasMasteryCriteria && item.masteryCriteria ? `${item.masteryCriteria.length} criteria` : `${item.children?.length || 0} items`}
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
