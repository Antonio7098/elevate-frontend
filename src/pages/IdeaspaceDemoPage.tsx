import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import IdeaspaceSidebar from '../components/navigation/IdeaspaceSidebar';
import MindMapView from '../components/mindmap/MindMapView';
import ViewModeToggle from '../components/common/ViewModeToggle';
import styles from './IdeaspaceDemoPage.module.css';

// Define ViewMode type locally to avoid export issues
type ViewMode = 'text' | 'mindmap';

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
  masteryCriteria: MasteryCriterion[];
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

const IdeaspaceDemoPage: React.FC = () => {
  const { blueprintId: urlBlueprintId, sectionId: urlSectionId } = useParams();
  const [viewMode, setViewMode] = useState<ViewMode>('text');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedItem, setSelectedItem] = useState<IdeaspaceItem | null>(null);
  const [currentBlueprint, setCurrentBlueprint] = useState<IdeaspaceItem | null>(null);

  // Use URL parameters or fall back to demo defaults
  const blueprintId = urlBlueprintId || 'demo-blueprint-001';
  const sectionId = urlSectionId || 'demo-section-001';

  // Sample data for demonstration
  const sampleData: IdeaspaceItem = {
    id: 'demo-blueprint-001',
    name: 'Photosynthesis Fundamentals',
    description: 'A comprehensive guide to understanding the basics of photosynthesis',
    type: 'blueprint',
    itemCount: 3,
    children: [
      {
        id: 'demo-ideaspace-001',
        name: 'Light Reactions',
        description: 'Understanding how light energy is converted to chemical energy',
        type: 'ideaspace',
        itemCount: 4,
        primitives: [
          {
            id: 'primitive-001',
            title: 'Chlorophyll Absorption',
            description: 'Chlorophyll molecules absorb light energy, particularly in the blue and red wavelengths, while reflecting green light.',
            primitiveType: 'concept',
            difficultyLevel: 'beginner',
            estimatedTimeMinutes: 15,
            conceptTags: ['light', 'absorption', 'chlorophyll', 'wavelengths'],
            complexityScore: 3,
            masteryCriteria: [
              {
                id: 'criterion-001',
                title: 'Identify Light Wavelengths',
                description: 'Recognize which wavelengths of light are most effectively absorbed by chlorophyll',
                weight: 1,
                uueStage: 'UNDERSTAND',
                complexityScore: 2,
                assessmentType: 'multiple-choice',
                masteryThreshold: 0.8
              },
              {
                id: 'criterion-002',
                title: 'Explain Absorption Process',
                description: 'Describe how chlorophyll molecules capture and convert light energy',
                weight: 2,
                uueStage: 'USE',
                complexityScore: 4,
                assessmentType: 'short-answer',
                masteryThreshold: 0.7
              }
            ]
          },
          {
            id: 'primitive-002',
            title: 'Electron Transport Chain',
            description: 'A series of protein complexes that transfer electrons from one molecule to another, creating a proton gradient.',
            primitiveType: 'process',
            difficultyLevel: 'intermediate',
            estimatedTimeMinutes: 25,
            conceptTags: ['electrons', 'proteins', 'gradient', 'energy'],
            complexityScore: 6,
            masteryCriteria: [
              {
                id: 'criterion-003',
                title: 'Trace Electron Flow',
                description: 'Follow the path of electrons through the transport chain',
                weight: 2,
                uueStage: 'UNDERSTAND',
                complexityScore: 5,
                assessmentType: 'diagram-labeling',
                masteryThreshold: 0.8
              },
              {
                id: 'criterion-004',
                title: 'Explain Proton Gradient',
                description: 'Describe how the electron transport creates a proton gradient and its significance',
                weight: 3,
                uueStage: 'EXPLORE',
                complexityScore: 7,
                assessmentType: 'essay',
                masteryThreshold: 0.75
              }
            ]
          },
          {
            id: 'primitive-003',
            title: 'ATP Synthesis',
            description: 'The process of creating ATP molecules using the energy from the proton gradient.',
            primitiveType: 'mechanism',
            difficultyLevel: 'intermediate',
            estimatedTimeMinutes: 20,
            conceptTags: ['ATP', 'energy', 'synthesis', 'gradient'],
            complexityScore: 5,
            masteryCriteria: [
              {
                id: 'criterion-005',
                title: 'Describe ATP Structure',
                description: 'Explain the structure and energy storage of ATP molecules',
                weight: 1,
                uueStage: 'UNDERSTAND',
                complexityScore: 3,
                assessmentType: 'multiple-choice',
                masteryThreshold: 0.8
              }
            ]
          },
          {
            id: 'primitive-004',
            title: 'NADPH Formation',
            description: 'The reduction of NADP+ to NADPH, providing reducing power for the Calvin cycle.',
            primitiveType: 'concept',
            difficultyLevel: 'advanced',
            estimatedTimeMinutes: 18,
            conceptTags: ['NADPH', 'reduction', 'Calvin cycle', 'energy'],
            complexityScore: 7,
            masteryCriteria: [
              {
                id: 'criterion-006',
                title: 'Explain Reduction Process',
                description: 'Describe how NADP+ is reduced to NADPH and its role in photosynthesis',
                weight: 2,
                uueStage: 'EXPLORE',
                complexityScore: 6,
                assessmentType: 'short-answer',
                masteryThreshold: 0.7
              }
            ]
          }
        ]
      },
      {
        id: 'demo-ideaspace-002',
        name: 'Calvin Cycle',
        description: 'The carbon fixation process that converts CO2 into organic compounds',
        type: 'ideaspace',
        itemCount: 3,
        primitives: [
          {
            id: 'primitive-005',
            title: 'Carbon Fixation',
            description: 'The initial step where CO2 is incorporated into organic molecules.',
            primitiveType: 'concept',
            difficultyLevel: 'beginner',
            estimatedTimeMinutes: 12,
            conceptTags: ['CO2', 'fixation', 'organic', 'molecules'],
            complexityScore: 2,
            masteryCriteria: [
              {
                id: 'criterion-007',
                title: 'Define Carbon Fixation',
                description: 'Explain what carbon fixation means in the context of photosynthesis',
                weight: 1,
                uueStage: 'UNDERSTAND',
                complexityScore: 2,
                assessmentType: 'definition',
                masteryThreshold: 0.8
              }
            ]
          }
        ]
      }
    ]
  };

  // Debug logging
  console.log('IdeaspaceDemoPage - blueprintId:', blueprintId, 'sectionId:', sectionId);
  console.log('IdeaspaceDemoPage - selectedItem:', selectedItem);
  console.log('IdeaspaceDemoPage - currentBlueprint:', currentBlueprint);

  // Auto-select the sample data when component loads
  useEffect(() => {
    if (!selectedItem && !currentBlueprint) {
      setSelectedItem(sampleData);
      setCurrentBlueprint(sampleData);
    }
  }, [selectedItem, currentBlueprint]);

  const handleViewModeChange = (mode: ViewMode) => {
    console.log('Switching to view mode:', mode);
    setViewMode(mode);
  };

  const handleItemSelect = (item: IdeaspaceItem) => {
    console.log('Item selected:', item);
    setSelectedItem(item);
    
    // If the selected item is a blueprint, set it as the current blueprint
    if (item.type === 'blueprint') {
      setCurrentBlueprint(item);
    } else if (item.type === 'section' && item.children) {
      // If it's a section, find the first blueprint child
      const firstBlueprint = item.children.find(child => child.type === 'blueprint');
      if (firstBlueprint) {
        setCurrentBlueprint(firstBlueprint);
      }
    } else if (item.type === 'ideaspace' && item.children) {
      // If it's an ideaspace, find the parent blueprint
      // This would need to be implemented based on the data structure
    }
  };

  // Auto-select first item when component loads
  useEffect(() => {
    if (!selectedItem && !currentBlueprint) {
      // This would need to be implemented to get the first available item
      // For now, we'll let the user select manually
      console.log('No item selected, waiting for user selection');
    }
  }, [selectedItem, currentBlueprint]);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const renderContentView = () => {
    if (viewMode === 'mindmap') {
      // Check if we have a blueprint to display
      if (!currentBlueprint) {
        return (
          <div className={styles.textContent}>
            <div className={styles.contentHeader}>
              <h1>Mind Map View</h1>
              <p>No blueprint selected</p>
            </div>
            <div className={styles.contentSections}>
              <section className={styles.contentSection}>
                <h2>Select a Blueprint</h2>
                <p>To view the mind map, please select a blueprint from the sidebar.</p>
                <p>You can select a section, blueprint, or ideaspace to see its structure visualized.</p>
              </section>
            </div>
          </div>
        );
      }

      return (
        <MindMapView
          blueprintId={currentBlueprint.id}
          sectionId={sectionId}
          className={styles.mindMapContainer}
          selectedItem={currentBlueprint}
        />
      );
    }

    // Text mode content based on selected item
    if (!selectedItem) {
      return (
        <div className={styles.textContent}>
          <div className={styles.contentHeader}>
            <h1>Welcome to Ideaspace Demo</h1>
            <p>Select an item from the sidebar to view its details</p>
          </div>
          
          <div className={styles.contentSections}>
            <section className={styles.contentSection}>
              <h2>Getting Started</h2>
              <p>Use the sidebar navigation to explore different learning sections, blueprints, and ideaspaces. Click on any item to view its detailed information.</p>
            </section>
          </div>
        </div>
      );
    }

    return (
      <div className={styles.textContent}>
        <div className={styles.contentHeader}>
          <h1>{selectedItem.name}</h1>
          <p>{selectedItem.description || `Details for ${selectedItem.type}`}</p>
          <div className={styles.itemMeta}>
            <span className={styles.itemType}>{selectedItem.type}</span>
            <span className={styles.itemCount}>{selectedItem.itemCount} {selectedItem.type === 'ideaspace' ? 'primitives' : 'items'}</span>
          </div>
        </div>
        
        <div className={styles.contentSections}>
          {selectedItem.type === 'section' && (
            <>
              <section className={styles.contentSection}>
                <h2>Section Overview</h2>
                <p>This section contains {selectedItem.itemCount} learning blueprints that cover various topics and concepts.</p>
                {selectedItem.children && selectedItem.children.length > 0 && (
                  <div className={styles.childrenList}>
                    <h3>Included Blueprints:</h3>
                    <ul>
                      {selectedItem.children.map(child => (
                        <li key={child.id}>
                          <strong>{child.name}</strong> - {child.description}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </section>
              
              <section className={styles.contentSection}>
                <h2>Learning Path</h2>
                <p>Follow the structured learning path through this section to build a comprehensive understanding of the subject matter.</p>
              </section>
            </>
          )}

          {selectedItem.type === 'blueprint' && (
            <>
              <section className={styles.contentSection}>
                <h2>Blueprint Details</h2>
                <p>This blueprint outlines the learning objectives and structure for mastering the topic.</p>
                {selectedItem.children && selectedItem.children.length > 0 && (
                  <div className={styles.childrenList}>
                    <h3>Ideaspaces:</h3>
                    <ul>
                      {selectedItem.children.map(child => (
                        <li key={child.id}>
                          <strong>{child.name}</strong> - {child.description}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </section>
              
              <section className={styles.contentSection}>
                <h2>Learning Objectives</h2>
                <p>By completing this blueprint, you will gain comprehensive knowledge and practical skills in the subject area.</p>
              </section>
            </>
          )}

          {selectedItem.type === 'ideaspace' && (
            <>
              <section className={styles.contentSection}>
                <h2>Ideaspace Content</h2>
                <p>This ideaspace contains {selectedItem.itemCount} knowledge primitives that form the foundation of understanding.</p>
              </section>
              
              {selectedItem.primitives && selectedItem.primitives.length > 0 ? (
                <section className={styles.contentSection}>
                  <h2>Knowledge Primitives</h2>
                  <p>Core concepts and fundamental building blocks of knowledge that form the foundation of this learning area.</p>
                  <div className={styles.primitivesList}>
                    {selectedItem.primitives.map((primitive) => (
                      <div key={primitive.id} className={styles.primitiveCard}>
                        <div className={styles.primitiveHeader}>
                          <h4>{primitive.title}</h4>
                          <div className={styles.primitiveMeta}>
                            <span className={styles.primitiveType}>{primitive.primitiveType}</span>
                            <span className={styles.primitiveDifficulty}>{primitive.difficultyLevel}</span>
                            <span className={styles.primitiveTime}>{primitive.estimatedTimeMinutes} min</span>
                            <span className={styles.primitiveComplexity}>Complexity: {primitive.complexityScore}</span>
                          </div>
                        </div>
                        
                        <p className={styles.primitiveDescription}>{primitive.description}</p>
                        
                        {primitive.conceptTags && primitive.conceptTags.length > 0 && (
                          <div className={styles.primitiveTags}>
                            {primitive.conceptTags.map((tag) => (
                              <span key={tag} className={styles.tag}>{tag}</span>
                            ))}
                          </div>
                        )}

                        {primitive.masteryCriteria && primitive.masteryCriteria.length > 0 && (
                          <div className={styles.masteryCriteria}>
                            <h5>Mastery Criteria</h5>
                            {primitive.masteryCriteria.map((criterion) => (
                              <div key={criterion.id} className={styles.criterionItem}>
                                <div className={styles.criterionHeader}>
                                  <strong>{criterion.title}</strong>
                                  <span className={styles.criterionWeight}>Weight: {criterion.weight}</span>
                                </div>
                                <p>{criterion.description}</p>
                                <div className={styles.criterionMeta}>
                                  <span className={styles.criterionStage}>{criterion.uueStage}</span>
                                  <span className={styles.criterionType}>{criterion.assessmentType}</span>
                                  <span className={styles.criterionThreshold}>Threshold: {criterion.masteryThreshold * 100}%</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              ) : (
                <section className={styles.contentSection}>
                  <h2>Knowledge Primitives</h2>
                  <p>Core concepts and fundamental building blocks of knowledge that form the foundation of this learning area.</p>
                  <div className={styles.masteryGrid}>
                    <div className={styles.masteryItem}>
                      <h4>Concept 1: Basic Understanding</h4>
                      <p>Fundamental principles and definitions</p>
                    </div>
                    <div className={styles.masteryItem}>
                      <h4>Concept 2: Intermediate Application</h4>
                      <p>Practical application and problem-solving</p>
                    </div>
                    <div className={styles.masteryItem}>
                      <h4>Concept 3: Advanced Synthesis</h4>
                      <p>Complex integration and analysis</p>
                    </div>
                  </div>
                </section>
              )}
              
              <section className={styles.contentSection}>
                <h2>Mastery Criteria</h2>
                <p>Specific criteria and assessments used to measure learning progress and mastery of the content.</p>
                <div className={styles.masteryGrid}>
                  <div className={styles.masteryItem}>
                    <h4>Understanding</h4>
                    <p>Demonstrate comprehension of core concepts</p>
                  </div>
                  <div className={styles.masteryItem}>
                    <h4>Application</h4>
                    <p>Apply knowledge to solve problems</p>
                  </div>
                  <div className={styles.masteryItem}>
                    <h4>Analysis</h4>
                    <p>Break down complex information</p>
                  </div>
                </div>
              </section>
            </>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className={styles.ideaspaceDemoPage}>
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
          <h1 className={styles.pageTitle}>Ideaspace Demo</h1>
        </div>
        
        <div className={styles.headerRight}>
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
          <IdeaspaceSidebar
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
    </div>
  );
};

export default IdeaspaceDemoPage;








