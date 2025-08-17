import React, { useMemo, useCallback, useEffect, useState } from 'react';
import { ReactFlow, Controls, Background, useNodesState, useEdgesState } from 'reactflow';
import type { Node, Edge } from 'reactflow';
import 'reactflow/dist/style.css';
import { useLearningPathwaysData } from '../../hooks/useBlueprintData';
import { mockLearningPathways } from '../../data/mockData';
import styles from './LearningPathwaysPage.module.css';

const LearningPathwaysPage: React.FC = () => {
  const { learningPathways, isLoadingPathways, pathwayError } = useLearningPathwaysData();
  const [isFlowReady, setIsFlowReady] = useState(false);
  const [useSimpleView, setUseSimpleView] = useState(false);
  
  // Use mock data if no real data
  const pathways = learningPathways.length > 0 ? learningPathways : mockLearningPathways;

  // Generate nodes and edges from learning pathways - simplified and robust
  const { nodes, edges } = useMemo(() => {
    try {
      const flowNodes: Node[] = [];
      const flowEdges: Edge[] = [];

      if (!pathways || pathways.length === 0) {
        return { nodes: [], edges: [] };
      }

      pathways.forEach((pathway, pathwayIndex) => {
        if (!pathway.sections || pathway.sections.length === 0) {
          return; // Skip pathways without sections
        }

        // Create nodes for each section in the pathway
        pathway.sections.forEach((section, sectionIndex) => {
          if (!section) {
            return; // Skip undefined sections
          }
          
          const isCompleted = Math.random() > 0.5; // Mock completion status
          
          const node: Node = {
            id: `pathway-${pathwayIndex}-section-${sectionIndex}`,
            type: 'default',
            position: {
              x: pathwayIndex * 300 + sectionIndex * 150,
              y: sectionIndex * 120 + pathwayIndex * 100
            },
            data: {
              label: section.title || `Section ${sectionIndex + 1}`,
              description: section.description || '',
              difficulty: section.difficulty || 'beginner',
              isCompleted,
              masteryLevel: Math.floor(Math.random() * 100)
            },
            style: {
              width: 180,
              height: 80,
              borderRadius: 8,
              border: isCompleted ? '2px solid #10b981' : '2px solid #6b7280',
              backgroundColor: isCompleted ? '#ecfdf5' : '#f9fafb',
              color: isCompleted ? '#065f46' : '#374151',
              fontSize: '12px',
              fontWeight: isCompleted ? '600' : '400',
              boxShadow: isCompleted ? '0 4px 6px -1px rgba(16, 185, 129, 0.1)' : '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
            }
          };

          flowNodes.push(node);

          // Create simple sequential edges (simplified to prevent complexity)
          if (sectionIndex > 0) {
            const edge: Edge = {
              id: `edge-${pathwayIndex}-${sectionIndex}`,
              source: `pathway-${pathwayIndex}-section-${sectionIndex - 1}`,
              target: node.id,
              type: 'smoothstep',
              animated: isCompleted,
              style: {
                stroke: isCompleted ? '#10b981' : '#9ca3af',
                strokeWidth: isCompleted ? 3 : 2,
                strokeDasharray: isCompleted ? 'none' : '5,5'
              }
            };
            flowEdges.push(edge);
          }
        });
      });

      return { nodes: flowNodes, edges: flowEdges };
    } catch (error) {
      console.error('Error generating flow data:', error);
      return { nodes: [], edges: [] };
    }
  }, [pathways]);

  const [reactFlowNodes, setNodes, onNodesChange] = useNodesState([]);
  const [reactFlowEdges, setEdges, onEdgesChange] = useEdgesState([]);

  // Update nodes and edges when data changes - with proper dependency management
  useEffect(() => {
    if (nodes.length > 0) {
      setNodes(nodes);
      setEdges(edges);
      setIsFlowReady(true);
    }
  }, [nodes, edges, setNodes, setEdges]);

  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    console.log('Clicked node:', node);
  }, []);

  // Show loading state
  if (isLoadingPathways) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Loading learning pathways...</div>
      </div>
    );
  }

  // Show error state
  if (pathwayError) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>Error loading learning pathways: {pathwayError}</div>
      </div>
    );
  }

  // Show empty state if no data
  if (!pathways || pathways.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>No learning pathways available</div>
      </div>
    );
  }

  // Simple view fallback
  if (useSimpleView) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <h1>Learning Pathways (Simple View)</h1>
          <p>Basic pathway information without React Flow</p>
          <button 
            onClick={() => setUseSimpleView(false)}
            style={{ padding: '8px 16px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            Try React Flow View
          </button>
        </div>

        <div className={styles.stats}>
          <div className={styles.statCard}>
            <h3>Total Pathways</h3>
            <p>{pathways.length}</p>
          </div>
          <div className={styles.statCard}>
            <h3>Total Sections</h3>
            <p>{pathways.reduce((total, pathway) => total + (pathway.sections?.length || 0), 0)}</p>
          </div>
        </div>

        {pathways.map((pathway, index) => (
          <div key={pathway.id || index} style={{ 
            background: 'white', 
            padding: '20px', 
            margin: '20px 0', 
            borderRadius: '8px', 
            border: '1px solid #e5e7eb',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <h3>{pathway.title || `Pathway ${index + 1}`}</h3>
            <p>{pathway.description || 'No description available'}</p>
            <p><strong>Difficulty:</strong> {pathway.difficulty || 'Unknown'}</p>
            <p><strong>Sections:</strong> {pathway.sections?.length || 0}</p>
            
            {pathway.sections && pathway.sections.length > 0 && (
              <div style={{ marginTop: '15px' }}>
                <h4>Sections:</h4>
                {pathway.sections.map((section, sectionIndex) => (
                  <div key={section.id || sectionIndex} style={{ 
                    margin: '10px 0', 
                    padding: '10px', 
                    background: '#f9fafb', 
                    borderRadius: '4px',
                    border: '1px solid #e5e7eb'
                  }}>
                    <strong>{section.title || `Section ${sectionIndex + 1}`}</strong>
                    <p>{section.description || 'No description'}</p>
                    <small>Difficulty: {section.difficulty || 'Unknown'}</small>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Learning Pathways</h1>
        <p>Visual learning flow from basic concepts to complex ideas</p>
        <button 
          onClick={() => setUseSimpleView(true)}
          style={{ padding: '8px 16px', background: '#6b7280', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginTop: '10px' }}
        >
          Switch to Simple View
        </button>
      </div>

      <div className={styles.legend}>
        <div className={styles.legendItem}>
          <div className={`${styles.legendDot} ${styles.basic}`}></div>
          <span>Basic Concepts</span>
        </div>
        <div className={styles.legendItem}>
          <div className={`${styles.legendDot} ${styles.intermediate}`}></div>
          <span>Intermediate</span>
        </div>
        <div className={styles.legendItem}>
          <div className={`${styles.legendDot} ${styles.advanced}`}></div>
          <span>Advanced</span>
        </div>
        <div className={styles.legendItem}>
          <div className={`${styles.legendDot} ${styles.completed}`}></div>
          <span>Completed</span>
        </div>
      </div>

      <div className={styles.flowContainer}>
        {isFlowReady && reactFlowNodes.length > 0 ? (
          <ReactFlow
            nodes={reactFlowNodes}
            edges={reactFlowEdges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onNodeClick={onNodeClick}
            fitView
            attributionPosition="bottom-left"
            proOptions={{ hideAttribution: true }}
          >
            <Controls />
            <Background color="#f8fafc" gap={20} />
          </ReactFlow>
        ) : (
          <div className={styles.loading}>
            Preparing learning flow... 
            <br />
            Nodes: {reactFlowNodes.length}, Edges: {reactFlowEdges.length}
            <br />
            Flow Ready: {isFlowReady ? 'Yes' : 'No'}
            <br />
            <button 
              onClick={() => setUseSimpleView(true)}
              style={{ padding: '8px 16px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginTop: '10px' }}
            >
              Use Simple View Instead
            </button>
          </div>
        )}
      </div>

      <div className={styles.stats}>
        <div className={styles.statCard}>
          <h3>Total Concepts</h3>
          <p>{reactFlowNodes.length}</p>
        </div>
        <div className={styles.statCard}>
          <h3>Completed</h3>
          <p>{reactFlowNodes.filter(n => n.data?.isCompleted).length}</p>
        </div>
        <div className={styles.statCard}>
          <h3>In Progress</h3>
          <p>{reactFlowNodes.filter(n => !n.data?.isCompleted).length}</p>
        </div>
        <div className={styles.statCard}>
          <h3>Pathways</h3>
          <p>{pathways.length}</p>
        </div>
      </div>
    </div>
  );
};

export default LearningPathwaysPage;


