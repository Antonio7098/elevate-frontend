import React, { useState, useEffect } from 'react';
import ViewModeToggle from '../common/ViewModeToggle';
import styles from './IdeaspaceSidebar.module.css';

// Mock data to replace the service temporarily
const mockData = {
  items: [
    {
      id: '1',
      name: 'Computer Science',
      description: 'Core computer science concepts and fundamentals',
      type: 'section' as const,
      itemCount: 4,
      children: [
        {
          id: '1-1',
          name: 'Programming Fundamentals',
          description: 'Basic programming concepts and principles',
          type: 'section' as const,
          itemCount: 3,
          children: [
            {
              id: '1-1-1',
              name: 'Data Structures',
              description: 'Fundamental data structures and algorithms',
              type: 'blueprint' as const,
              itemCount: 2,
              children: [
                {
                  id: '1-1-1-1',
                  name: 'Linear Structures',
                  description: 'Arrays, lists, and sequential data organization',
                  type: 'ideaspace' as const,
                  itemCount: 4,
                  primitives: [
                    {
                      id: 'prim-1',
                      title: 'Array Fundamentals',
                      description: 'Basic array operations and memory layout',
                      primitiveType: 'proposition',
                      difficultyLevel: 'beginner',
                      estimatedTimeMinutes: 15,
                      conceptTags: ['arrays', 'memory', 'indexing'],
                      complexityScore: 2.5
                    },
                    {
                      id: 'prim-2',
                      title: 'Array Operations',
                      description: 'Common array operations: access, insert, delete',
                      primitiveType: 'process',
                      difficultyLevel: 'beginner',
                      estimatedTimeMinutes: 20,
                      conceptTags: ['operations', 'algorithms', 'complexity'],
                      complexityScore: 3.0
                    },
                    {
                      id: 'prim-3',
                      title: 'Linked Lists',
                      description: 'Dynamic data structure with nodes and pointers',
                      primitiveType: 'entity',
                      difficultyLevel: 'intermediate',
                      estimatedTimeMinutes: 25,
                      conceptTags: ['linked-lists', 'pointers', 'dynamic'],
                      complexityScore: 4.0
                    },
                    {
                      id: 'prim-4',
                      title: 'List Traversal',
                      description: 'Methods for navigating through linked structures',
                      primitiveType: 'process',
                      difficultyLevel: 'intermediate',
                      estimatedTimeMinutes: 20,
                      conceptTags: ['traversal', 'iteration', 'pointers'],
                      complexityScore: 3.5
                    }
                  ]
                },
                {
                  id: '1-1-1-2',
                  name: 'Non-Linear Structures',
                  description: 'Trees, graphs, and hierarchical data organization',
                  type: 'ideaspace' as const,
                  itemCount: 5,
                  primitives: [
                    {
                      id: 'prim-5',
                      title: 'Tree Structure',
                      description: 'Hierarchical data organization with nodes and edges',
                      primitiveType: 'entity',
                      difficultyLevel: 'intermediate',
                      estimatedTimeMinutes: 25,
                      conceptTags: ['trees', 'hierarchy', 'nodes'],
                      complexityScore: 4.0
                    },
                    {
                      id: 'prim-6',
                      title: 'Binary Trees',
                      description: 'Specialized tree structure with at most two children per node',
                      primitiveType: 'entity',
                      difficultyLevel: 'intermediate',
                      estimatedTimeMinutes: 30,
                      conceptTags: ['binary-trees', 'specialization', 'children'],
                      complexityScore: 4.5
                    },
                    {
                      id: 'prim-7',
                      title: 'Graph Theory',
                      description: 'Mathematical structures for modeling relationships',
                      primitiveType: 'concept',
                      difficultyLevel: 'advanced',
                      estimatedTimeMinutes: 35,
                      conceptTags: ['graphs', 'vertices', 'edges', 'relationships'],
                      complexityScore: 6.0
                    },
                    {
                      id: 'prim-8',
                      title: 'Tree Traversal',
                      description: 'Systematic methods for visiting tree nodes',
                      primitiveType: 'process',
                      difficultyLevel: 'intermediate',
                      estimatedTimeMinutes: 25,
                      conceptTags: ['traversal', 'in-order', 'pre-order', 'post-order'],
                      complexityScore: 4.0
                    },
                    {
                      id: 'prim-9',
                      title: 'Graph Algorithms',
                      description: 'Algorithms for graph traversal and analysis',
                      primitiveType: 'process',
                      difficultyLevel: 'advanced',
                      estimatedTimeMinutes: 40,
                      conceptTags: ['algorithms', 'BFS', 'DFS', 'shortest-path'],
                      complexityScore: 6.5
                    }
                  ]
                }
              ]
            },
            {
              id: '1-1-2',
              name: 'Algorithms',
              description: 'Problem-solving strategies and algorithm design',
              type: 'blueprint' as const,
              itemCount: 2,
              children: [
                {
                  id: '1-1-2-1',
                  name: 'Sorting & Searching',
                  description: 'Fundamental sorting and searching algorithms',
                  type: 'ideaspace' as const,
                  itemCount: 6,
                  primitives: [
                    {
                      id: 'prim-10',
                      title: 'Bubble Sort',
                      description: 'Simple comparison-based sorting algorithm',
                      primitiveType: 'process',
                      difficultyLevel: 'beginner',
                      estimatedTimeMinutes: 20,
                      conceptTags: ['sorting', 'comparison', 'O(n²)'],
                      complexityScore: 3.0
                    },
                    {
                      id: 'prim-11',
                      title: 'Quick Sort',
                      description: 'Efficient divide-and-conquer sorting algorithm',
                      primitiveType: 'process',
                      difficultyLevel: 'intermediate',
                      estimatedTimeMinutes: 30,
                      conceptTags: ['sorting', 'divide-conquer', 'pivot', 'O(n log n)'],
                      complexityScore: 5.0
                    },
                    {
                      id: 'prim-12',
                      title: 'Binary Search',
                      description: 'Efficient search algorithm for sorted data',
                      primitiveType: 'process',
                      difficultyLevel: 'intermediate',
                      estimatedTimeMinutes: 25,
                      conceptTags: ['searching', 'binary', 'sorted', 'O(log n)'],
                      complexityScore: 4.0
                    },
                    {
                      id: 'prim-13',
                      title: 'Linear Search',
                      description: 'Simple sequential search through data',
                      primitiveType: 'process',
                      difficultyLevel: 'beginner',
                      estimatedTimeMinutes: 15,
                      conceptTags: ['searching', 'linear', 'sequential', 'O(n)'],
                      complexityScore: 2.0
                    },
                    {
                      id: 'prim-14',
                      title: 'Merge Sort',
                      description: 'Stable divide-and-conquer sorting algorithm',
                      primitiveType: 'process',
                      difficultyLevel: 'intermediate',
                      estimatedTimeMinutes: 35,
                      conceptTags: ['sorting', 'divide-conquer', 'stable', 'O(n log n)'],
                      complexityScore: 5.5
                    },
                    {
                      id: 'prim-15',
                      title: 'Heap Sort',
                      description: 'Comparison-based sorting using heap data structure',
                      primitiveType: 'process',
                      difficultyLevel: 'advanced',
                      estimatedTimeMinutes: 40,
                      conceptTags: ['sorting', 'heap', 'comparison', 'O(n log n)'],
                      complexityScore: 6.0
                    }
                  ]
                },
                {
                  id: '1-1-2-2',
                  name: 'Dynamic Programming',
                  description: 'Optimization technique for complex problems',
                  type: 'ideaspace' as const,
                  itemCount: 4,
                  primitives: [
                    {
                      id: 'prim-16',
                      title: 'Memoization',
                      description: 'Technique of storing results of expensive function calls',
                      primitiveType: 'technique',
                      difficultyLevel: 'intermediate',
                      estimatedTimeMinutes: 25,
                      conceptTags: ['memoization', 'caching', 'optimization'],
                      complexityScore: 4.5
                    },
                    {
                      id: 'prim-17',
                      title: 'Tabulation',
                      description: 'Bottom-up approach to dynamic programming',
                      primitiveType: 'technique',
                      difficultyLevel: 'intermediate',
                      estimatedTimeMinutes: 30,
                      conceptTags: ['tabulation', 'bottom-up', 'iterative'],
                      complexityScore: 5.0
                    },
                    {
                      id: 'prim-18',
                      title: 'Optimal Substructure',
                      description: 'Property that optimal solution contains optimal subsolutions',
                      primitiveType: 'concept',
                      difficultyLevel: 'advanced',
                      estimatedTimeMinutes: 35,
                      conceptTags: ['optimal-substructure', 'recursion', 'decomposition'],
                      complexityScore: 6.5
                    },
                    {
                      id: 'prim-19',
                      title: 'State Transition',
                      description: 'How problem state changes during solution process',
                      primitiveType: 'concept',
                      difficultyLevel: 'advanced',
                      estimatedTimeMinutes: 30,
                      conceptTags: ['state-transition', 'recursion', 'problem-solving'],
                      complexityScore: 6.0
                    }
                  ]
                }
              ]
            },
            {
              id: '1-1-3',
              name: 'Software Design',
              description: 'Principles and patterns for building software systems',
              type: 'blueprint' as const,
              itemCount: 1,
              children: [
                {
                  id: '1-1-3-1',
                  name: 'Design Patterns',
                  description: 'Reusable solutions to common software design problems',
                  type: 'ideaspace' as const,
                  itemCount: 3,
                  primitives: [
                    {
                      id: 'prim-20',
                      title: 'Singleton Pattern',
                      description: 'Ensures a class has only one instance',
                      primitiveType: 'pattern',
                      difficultyLevel: 'intermediate',
                      estimatedTimeMinutes: 20,
                      conceptTags: ['singleton', 'instance', 'global-access'],
                      complexityScore: 3.5
                    },
                    {
                      id: 'prim-21',
                      title: 'Factory Pattern',
                      description: 'Creates objects without specifying exact classes',
                      primitiveType: 'pattern',
                      difficultyLevel: 'intermediate',
                      estimatedTimeMinutes: 25,
                      conceptTags: ['factory', 'object-creation', 'abstraction'],
                      complexityScore: 4.0
                    },
                    {
                      id: 'prim-22',
                      title: 'Observer Pattern',
                      description: 'Defines one-to-many dependency between objects',
                      primitiveType: 'pattern',
                      difficultyLevel: 'intermediate',
                      estimatedTimeMinutes: 30,
                      conceptTags: ['observer', 'publisher-subscriber', 'loose-coupling'],
                      complexityScore: 4.5
                    }
                  ]
                }
              ]
            }
          ]
        },
        {
          id: '1-2',
          name: 'Systems & Architecture',
          description: 'Computer systems, networks, and architecture',
          type: 'section' as const,
          itemCount: 2,
          children: [
            {
              id: '1-2-1',
              name: 'Operating Systems',
              description: 'Core concepts of operating system design',
              type: 'blueprint' as const,
              itemCount: 1,
              children: [
                {
                  id: '1-2-1-1',
                  name: 'Process Management',
                  description: 'Managing processes, threads, and scheduling',
                  type: 'ideaspace' as const,
                  itemCount: 4,
                  primitives: [
                    {
                      id: 'prim-23',
                      title: 'Process vs Thread',
                      description: 'Understanding the difference between processes and threads',
                      primitiveType: 'concept',
                      difficultyLevel: 'intermediate',
                      estimatedTimeMinutes: 25,
                      conceptTags: ['process', 'thread', 'concurrency', 'parallelism'],
                      complexityScore: 4.5
                    },
                    {
                      id: 'prim-24',
                      title: 'CPU Scheduling',
                      description: 'Algorithms for determining which process runs next',
                      primitiveType: 'process',
                      difficultyLevel: 'intermediate',
                      estimatedTimeMinutes: 30,
                      conceptTags: ['scheduling', 'CPU', 'algorithms', 'fairness'],
                      complexityScore: 5.0
                    },
                    {
                      id: 'prim-25',
                      title: 'Memory Management',
                      description: 'Allocation and deallocation of memory resources',
                      primitiveType: 'process',
                      difficultyLevel: 'advanced',
                      estimatedTimeMinutes: 35,
                      conceptTags: ['memory', 'allocation', 'fragmentation', 'virtual-memory'],
                      complexityScore: 6.0
                    },
                    {
                      id: 'prim-26',
                      title: 'Inter-Process Communication',
                      description: 'Methods for processes to communicate and synchronize',
                      primitiveType: 'mechanism',
                      difficultyLevel: 'advanced',
                      estimatedTimeMinutes: 40,
                      conceptTags: ['IPC', 'communication', 'synchronization', 'shared-memory'],
                      complexityScore: 6.5
                    }
                  ]
                }
              ]
            },
            {
              id: '1-2-2',
              name: 'Computer Networks',
              description: 'Network protocols and communication systems',
              type: 'blueprint' as const,
              itemCount: 1,
              children: [
                {
                  id: '1-2-2-1',
                  name: 'Network Protocols',
                  description: 'Standards and protocols for network communication',
                  type: 'ideaspace' as const,
                  itemCount: 3,
                  primitives: [
                    {
                      id: 'prim-27',
                      title: 'TCP/IP Model',
                      description: 'Four-layer model for network communication',
                      primitiveType: 'model',
                      difficultyLevel: 'intermediate',
                      estimatedTimeMinutes: 30,
                      conceptTags: ['TCP/IP', 'layers', 'protocols', 'networking'],
                      complexityScore: 5.0
                    },
                    {
                      id: 'prim-28',
                      title: 'HTTP Protocol',
                      description: 'Application layer protocol for web communication',
                      primitiveType: 'protocol',
                      difficultyLevel: 'intermediate',
                      estimatedTimeMinutes: 25,
                      conceptTags: ['HTTP', 'web', 'request-response', 'stateless'],
                      complexityScore: 4.0
                    },
                    {
                      id: 'prim-29',
                      title: 'DNS Resolution',
                      description: 'Process of converting domain names to IP addresses',
                      primitiveType: 'process',
                      difficultyLevel: 'intermediate',
                      estimatedTimeMinutes: 20,
                      conceptTags: ['DNS', 'domain-names', 'IP-addresses', 'resolution'],
                      complexityScore: 3.5
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: '2',
      name: 'Mathematics',
      description: 'Mathematical foundations and advanced concepts',
      type: 'section' as const,
      itemCount: 3,
      children: [
        {
          id: '2-1',
          name: 'Calculus',
          description: 'Differential and integral calculus fundamentals',
          type: 'section' as const,
          itemCount: 2,
          children: [
            {
              id: '2-1-1',
              name: 'Differential Calculus',
              description: 'Study of rates of change and slopes',
              type: 'blueprint' as const,
              itemCount: 1,
              children: [
                {
                  id: '2-1-1-1',
                  name: 'Derivatives',
                  description: 'Rate of change and differentiation concepts',
                  type: 'ideaspace' as const,
                  itemCount: 4,
                  primitives: [
                    {
                      id: 'prim-30',
                      title: 'Limit Definition',
                      description: 'Understanding limits as the foundation of derivatives',
                      primitiveType: 'proposition',
                      difficultyLevel: 'intermediate',
                      estimatedTimeMinutes: 30,
                      conceptTags: ['limits', 'derivatives', 'foundation'],
                      complexityScore: 4.5
                    },
                    {
                      id: 'prim-31',
                      title: 'Power Rule',
                      description: 'Derivative rule for power functions',
                      primitiveType: 'rule',
                      difficultyLevel: 'intermediate',
                      estimatedTimeMinutes: 20,
                      conceptTags: ['power-rule', 'derivatives', 'functions'],
                      complexityScore: 3.5
                    },
                    {
                      id: 'prim-32',
                      title: 'Chain Rule',
                      description: 'Derivative rule for composite functions',
                      primitiveType: 'rule',
                      difficultyLevel: 'advanced',
                      estimatedTimeMinutes: 35,
                      conceptTags: ['chain-rule', 'composite-functions', 'derivatives'],
                      complexityScore: 5.5
                    },
                    {
                      id: 'prim-33',
                      title: 'Product Rule',
                      description: 'Derivative rule for product of functions',
                      primitiveType: 'rule',
                      difficultyLevel: 'intermediate',
                      estimatedTimeMinutes: 25,
                      conceptTags: ['product-rule', 'derivatives', 'functions'],
                      complexityScore: 4.0
                    }
                  ]
                }
              ]
            },
            {
              id: '2-1-2',
              name: 'Integral Calculus',
              description: 'Study of accumulation and area under curves',
              type: 'blueprint' as const,
              itemCount: 1,
              children: [
                {
                  id: '2-1-2-1',
                  name: 'Antiderivatives',
                  description: 'Reverse process of differentiation',
                  type: 'ideaspace' as const,
                  itemCount: 3,
                  primitives: [
                    {
                      id: 'prim-34',
                      title: 'Indefinite Integrals',
                      description: 'Finding antiderivatives with constant of integration',
                      primitiveType: 'concept',
                      difficultyLevel: 'intermediate',
                      estimatedTimeMinutes: 30,
                      conceptTags: ['indefinite-integrals', 'antiderivatives', 'constants'],
                      complexityScore: 4.5
                    },
                    {
                      id: 'prim-35',
                      title: 'Definite Integrals',
                      description: 'Calculating area under curves between limits',
                      primitiveType: 'concept',
                      difficultyLevel: 'intermediate',
                      estimatedTimeMinutes: 35,
                      conceptTags: ['definite-integrals', 'area', 'limits', 'evaluation'],
                      complexityScore: 5.0
                    },
                    {
                      id: 'prim-36',
                      title: 'Integration Techniques',
                      description: 'Methods for solving complex integrals',
                      primitiveType: 'technique',
                      difficultyLevel: 'advanced',
                      estimatedTimeMinutes: 40,
                      conceptTags: ['integration', 'substitution', 'parts', 'techniques'],
                      complexityScore: 6.0
                    }
                  ]
                }
              ]
            }
          ]
        },
        {
          id: '2-2',
          name: 'Linear Algebra',
          description: 'Vectors, matrices, and linear transformations',
          type: 'section' as const,
          itemCount: 1,
          children: [
            {
              id: '2-2-1',
              name: 'Vector Spaces',
              description: 'Abstract algebraic structures for vectors',
              type: 'blueprint' as const,
              itemCount: 1,
              children: [
                {
                  id: '2-2-1-1',
                  name: 'Vector Operations',
                  description: 'Basic operations on vectors and vector spaces',
                  type: 'ideaspace' as const,
                  itemCount: 4,
                  primitives: [
                    {
                      id: 'prim-37',
                      title: 'Vector Addition',
                      description: 'Component-wise addition of vectors',
                      primitiveType: 'operation',
                      difficultyLevel: 'beginner',
                      estimatedTimeMinutes: 20,
                      conceptTags: ['vectors', 'addition', 'components'],
                      complexityScore: 3.0
                    },
                    {
                      id: 'prim-38',
                      title: 'Dot Product',
                      description: 'Scalar product of two vectors',
                      primitiveType: 'operation',
                      difficultyLevel: 'intermediate',
                      estimatedTimeMinutes: 25,
                      conceptTags: ['dot-product', 'scalar', 'vectors', 'projection'],
                      complexityScore: 4.0
                    },
                    {
                      id: 'prim-39',
                      title: 'Cross Product',
                      description: 'Vector product producing perpendicular vector',
                      primitiveType: 'operation',
                      difficultyLevel: 'intermediate',
                      estimatedTimeMinutes: 30,
                      conceptTags: ['cross-product', 'perpendicular', '3D', 'determinant'],
                      complexityScore: 4.5
                    },
                    {
                      id: 'prim-40',
                      title: 'Vector Spaces',
                      description: 'Abstract algebraic structures for vector operations',
                      primitiveType: 'concept',
                      difficultyLevel: 'advanced',
                      estimatedTimeMinutes: 40,
                      conceptTags: ['vector-spaces', 'axioms', 'algebraic-structures'],
                      complexityScore: 6.5
                    }
                  ]
                }
              ]
            }
          ]
        },
        {
          id: '2-3',
          name: 'Statistics & Probability',
          description: 'Data analysis and probability theory',
          type: 'section' as const,
          itemCount: 1,
          children: [
            {
              id: '2-3-1',
              name: 'Probability Theory',
              description: 'Fundamental concepts of probability',
              type: 'blueprint' as const,
              itemCount: 1,
              children: [
                {
                  id: '2-3-1-1',
                  name: 'Basic Probability',
                  description: 'Fundamental probability concepts and calculations',
                  type: 'ideaspace' as const,
                  itemCount: 3,
                  primitives: [
                    {
                      id: 'prim-41',
                      title: 'Probability Axioms',
                      description: 'Mathematical foundation of probability theory',
                      primitiveType: 'axiom',
                      difficultyLevel: 'intermediate',
                      estimatedTimeMinutes: 30,
                      conceptTags: ['probability', 'axioms', 'mathematical-foundation'],
                      complexityScore: 4.5
                    },
                    {
                      id: 'prim-42',
                      title: 'Conditional Probability',
                      description: 'Probability of events given other events',
                      primitiveType: 'concept',
                      difficultyLevel: 'intermediate',
                      estimatedTimeMinutes: 35,
                      conceptTags: ['conditional-probability', 'events', 'dependence'],
                      complexityScore: 5.0
                    },
                    {
                      id: 'prim-43',
                      title: 'Bayes Theorem',
                      description: 'Formula for updating probabilities with new information',
                      primitiveType: 'theorem',
                      difficultyLevel: 'advanced',
                      estimatedTimeMinutes: 40,
                      conceptTags: ['bayes-theorem', 'probability-updating', 'inference'],
                      complexityScore: 6.0
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    }
  ]
};

interface MasteryCriterion {
  id: string;
  title: string;
  description: string;
  weight: number;
  uueStage: 'UNDERSTAND' | 'USE' | 'EXPLORE';
  complexityScore: number;
  assessmentType: string;
  masteryThreshold: number;
}

interface KnowledgePrimitive {
  id: string;
  title: string;
  description: string;
  primitiveType: string;
  difficultyLevel: string;
  estimatedTimeMinutes: number;
  conceptTags: string[];
  complexityScore: number;
  masteryCriteria?: MasteryCriterion[]; // Optional - only used in PathwaysPage
}

interface IdeaspaceItem {
  id: string;
  name: string;
  description?: string;
  type: 'section' | 'blueprint' | 'ideaspace';
  itemCount: number;
  children?: IdeaspaceItem[];
  primitives?: KnowledgePrimitive[];
  depth?: number;
  orderIndex?: number;
  difficulty?: string;
}

interface IdeaspaceSidebarProps {
  onItemSelect?: (item: IdeaspaceItem) => void;
  onViewModeChange?: (mode: 'text' | 'mindmap') => void;
  currentViewMode?: 'text' | 'mindmap';
}

const IdeaspaceSidebar: React.FC<IdeaspaceSidebarProps> = ({
  onItemSelect,
  onViewModeChange,
  currentViewMode = 'text'
}) => {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [data, setData] = useState<IdeaspaceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simulate loading with mock data
    const loadData = async () => {
      try {
        setLoading(true);
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        setData(mockData.items);
        setLoading(false);
      } catch (err) {
        setError('Failed to load ideaspace data');
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleItemClick = (item: IdeaspaceItem) => {
    // Toggle expansion if item has children
    if (item.children && item.children.length > 0) {
      const newExpanded = new Set(expandedItems);
      if (newExpanded.has(item.id)) {
        newExpanded.delete(item.id);
      } else {
        newExpanded.add(item.id);
      }
      setExpandedItems(newExpanded);
    }
    
    // Set as selected
    setSelectedItem(item.id);
    
    // Call callback if provided
    if (onItemSelect) {
      onItemSelect(item);
    }
  };

  const renderItem = (item: IdeaspaceItem, depth: number = 0) => {
    const isExpanded = expandedItems.has(item.id);
    const hasChildren = item.children && item.children.length > 0;
    const isSelected = selectedItem === item.id;

    return (
      <div key={item.id} className={styles.itemContainer}>
        <div
          className={`${styles.item} ${styles[`depth${depth}`]} ${isSelected ? styles.selected : ''}`}
          onClick={() => handleItemClick(item)}
        >
          <div className={styles.itemContent}>
            <div className={styles.itemName}>{item.name}</div>
            {item.description && (
              <div className={styles.itemDescription}>{item.description}</div>
            )}
            <div className={styles.itemMeta}>
              {item.itemCount} {item.type === 'ideaspace' ? 'primitives' : 'items'}
            </div>
          </div>
        </div>
        {hasChildren && isExpanded && (
          <div className={styles.children}>
            {item.children!.map(child => renderItem(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className={styles.sidebar}>
        <div className={styles.header}>
          <h3>Ideaspace Navigation</h3>
        </div>
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Loading ideaspaces...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.sidebar}>
        <div className={styles.header}>
          <h3>Ideaspace Navigation</h3>
        </div>
        <div className={styles.error}>
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.sidebar}>
      <div className={styles.header}>
        <h3>Ideaspace Navigation</h3>
        {onViewModeChange && (
          <ViewModeToggle
            currentMode={currentViewMode}
            onModeChange={onViewModeChange}
            className={styles.compactToggle}
          />
        )}
      </div>
      <div className={styles.navigationTree}>
        {data.map(item => renderItem(item))}
      </div>
    </div>
  );
};

export default IdeaspaceSidebar;

