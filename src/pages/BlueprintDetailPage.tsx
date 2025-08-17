import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getLearningBlueprintById } from '../services/learningBlueprintService';
import type { LearningBlueprint } from '../types/questionSet';
import { FiLoader, FiAlertCircle, FiArrowLeft, FiSave } from 'react-icons/fi';
import TextWaveEffect from '../components/TextWaveEffect';
import styles from './BlueprintDetailPage.module.css';

// React Flow imports
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  type Node,
  type Edge,
  type Connection,
  type NodeChange,
  type EdgeChange
} from 'reactflow';
import 'reactflow/dist/style.css';

type BlueprintNode = Node & {
  data: {
    label: string;
    description?: string;
    type: 'section' | 'primitive' | 'process' | 'entity' | 'relationship';
    difficulty?: string;
    timeEstimate?: number;
    content?: string;
  };
}

type BlueprintEdge = Edge & {
  data?: {
    label?: string;
    relationshipType?: string;
  };
}

const BlueprintDetailPage: React.FC = () => {
  const { blueprintId } = useParams<{ blueprintId: string }>();
  const navigate = useNavigate();
  const [blueprint, setBlueprint] = useState<LearningBlueprint | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [nodes, setNodes] = useState<BlueprintNode[]>([]);
  const [edges, setEdges] = useState<BlueprintEdge[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Transform blueprint data to React Flow nodes and edges
  const transformBlueprintToFlow = useCallback((bp: LearningBlueprint) => {
    const newNodes: BlueprintNode[] = [];
    const newEdges: BlueprintEdge[] = [];
    let nodeId = 0;

    try {
      const blueprintData = bp.blueprintJson as any;
      
      // Add main blueprint node
      newNodes.push({
        id: `blueprint-${nodeId++}`,
        type: 'default',
        position: { x: 400, y: 50 },
        data: {
          label: bp.title || 'Blueprint',
          description: bp.description || 'Learning Blueprint',
          type: 'section',
          content: bp.sourceText.substring(0, 100) + '...'
        },
        style: {
          background: '#1a73e8',
          color: 'white',
          border: '2px solid #0d47a1',
          borderRadius: '8px',
          padding: '10px',
          fontSize: '16px',
          fontWeight: 'bold'
        }
      });

      // Add section nodes
      if (blueprintData.sections) {
        blueprintData.sections.forEach((section: any, index: number) => {
          const x = 200 + (index % 3) * 300;
          const y = 150 + Math.floor(index / 3) * 200;
          
          newNodes.push({
            id: `section-${nodeId++}`,
            type: 'default',
            position: { x, y },
            data: {
              label: section.section_name || section.sectionName || 'Section',
              description: section.description || '',
              type: 'section',
              difficulty: section.difficulty || 'BEGINNER',
              timeEstimate: section.estimated_time_minutes || section.estimatedTimeMinutes || 15
            },
            style: {
              background: '#34a853',
              color: 'white',
              border: '2px solid #2e7d32',
              borderRadius: '8px',
              padding: '8px',
              fontSize: '14px',
              fontWeight: '600'
            }
          });

          // Connect to main blueprint
          newEdges.push({
            id: `edge-${nodeId++}`,
            source: 'blueprint-0',
            target: `section-${nodeId - 1}`,
            type: 'smoothstep',
            style: { stroke: '#666', strokeWidth: 2 }
          } as BlueprintEdge);
        });
      }

      // Add knowledge primitive nodes
      if (blueprintData.knowledge_primitives) {
        const primitives = blueprintData.knowledge_primitives;
        
        // Key propositions
        if (primitives.key_propositions_and_facts) {
          primitives.key_propositions_and_facts.forEach((prop: any, index: number) => {
            const x = 50 + (index % 2) * 400;
            const y = 400 + Math.floor(index / 2) * 150;
            
            newNodes.push({
              id: `prop-${nodeId++}`,
              type: 'default',
              position: { x, y },
              data: {
                label: prop.statement?.substring(0, 50) + '...' || 'Proposition',
                description: prop.statement || '',
                type: 'primitive',
                difficulty: prop.difficulty || 'INTERMEDIATE',
                timeEstimate: prop.estimated_time_minutes || 10
              },
              style: {
                background: '#fbbc04',
                color: 'black',
                border: '2px solid #f57c00',
                borderRadius: '8px',
                padding: '8px',
                fontSize: '12px',
                maxWidth: '200px'
              }
            });
          });
        }

        // Entities and definitions
        if (primitives.key_entities_and_definitions) {
          primitives.key_entities_and_definitions.forEach((entity: any, index: number) => {
            const x = 600 + (index % 2) * 300;
            const y = 400 + Math.floor(index / 2) * 150;
            
            newNodes.push({
              id: `entity-${nodeId++}`,
              type: 'default',
              position: { x, y },
              data: {
                label: entity.entity || 'Entity',
                description: entity.definition || '',
                type: 'entity',
                difficulty: entity.difficulty || 'BEGINNER',
                timeEstimate: entity.estimated_time_minutes || 5
              },
              style: {
                background: '#ea4335',
                color: 'white',
                border: '2px solid #c62828',
                borderRadius: '8px',
                padding: '8px',
                fontSize: '12px',
                maxWidth: '200px'
              }
            });
          });
        }

        // Processes
        if (primitives.described_processes_and_steps) {
          primitives.described_processes_and_steps.forEach((process: any, index: number) => {
            const x = 100 + (index % 2) * 500;
            const y = 600 + Math.floor(index / 2) * 200;
            
            newNodes.push({
              id: `process-${nodeId++}`,
              type: 'default',
              position: { x, y },
              data: {
                label: process.process_name || 'Process',
                description: process.steps?.join(', ') || '',
                type: 'process',
                difficulty: process.difficulty || 'INTERMEDIATE',
                timeEstimate: process.estimated_time_minutes || 20
              },
              style: {
                background: '#9c27b0',
                color: 'white',
                border: '2px solid #7b1fa2',
                borderRadius: '8px',
                padding: '8px',
                fontSize: '12px',
                maxWidth: '250px'
              }
            });
          });
        }
      }

      // Add relationships
      if (blueprintData.knowledge_primitives?.identified_relationships) {
        blueprintData.knowledge_primitives.identified_relationships.forEach((rel: any) => {
          const sourceNode = newNodes.find(n => n.id.includes(rel.source_primitive_id?.split('_')[1] || ''));
          const targetNode = newNodes.find(n => n.id.includes(rel.target_primitive_id?.split('_')[1] || ''));
          
          if (sourceNode && targetNode) {
            newEdges.push({
              id: `rel-${nodeId++}`,
              source: sourceNode.id,
              target: targetNode.id,
              type: 'smoothstep',
              label: rel.relationship_type || 'Related',
              style: { 
                stroke: '#666', 
                strokeWidth: 2,
                strokeDasharray: '5,5'
              },
              data: {
                label: rel.description || '',
                relationshipType: rel.relationship_type || 'Related'
              }
            } as BlueprintEdge);
          }
        });
      }

    } catch (err) {
      console.error('Error transforming blueprint to flow:', err);
    }

    return { nodes: newNodes, edges: newEdges };
  }, []);

  // Load blueprint data
  useEffect(() => {
    const fetchBlueprint = async () => {
      if (!blueprintId) {
        setError('Blueprint ID is missing.');
        setIsLoading(false);
        return;
      }
      try {
        setIsLoading(true);
        const data = await getLearningBlueprintById(blueprintId);
        setBlueprint(data);
        
        // Transform to React Flow format
        const { nodes: flowNodes, edges: flowEdges } = transformBlueprintToFlow(data);
        setNodes(flowNodes);
        setEdges(flowEdges);
      } catch (err) {
        setError('Failed to load learning blueprint.');
        console.error('Error loading blueprint:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchBlueprint();
  }, [blueprintId, transformBlueprintToFlow]);

  // React Flow event handlers
  const onNodesChange = useCallback((changes: NodeChange[]) => {
    setNodes((nds) => applyNodeChanges(changes, nds) as BlueprintNode[]);
  }, []);

  const onEdgesChange = useCallback((changes: EdgeChange[]) => {
    setEdges((eds) => applyEdgeChanges(changes, eds) as BlueprintEdge[]);
  }, []);

  const onConnect = useCallback((connection: Connection) => {
    setEdges((eds) => addEdge(connection, eds) as BlueprintEdge[]);
  }, []);

  const handleSave = useCallback(async () => {
    setIsSaving(true);
    setSaveError(null);
    
    try {
      // Simulate save operation
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Blueprint visualization saved');
    } catch (err) {
      setSaveError('Failed to save changes');
    } finally {
      setIsSaving(false);
    }
  }, []);

  if (isLoading) {
    return (
      <div className={styles.centeredMessage}>
        <FiLoader className={styles.spinner} /> 
        <TextWaveEffect text="Loading blueprint..." color="#007bff" effect="gradient" />
      </div>
    );
  }

  if (error) {
    return <div className={`${styles.centeredMessage} ${styles.error}`}><FiAlertCircle /> {error}</div>;
  }

  if (!blueprint) {
    return <div className={styles.centeredMessage}>Blueprint not found.</div>;
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <button onClick={() => navigate('/blueprints')} className={styles.backButton}>
          <FiArrowLeft /> Back to Blueprints
        </button>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>{blueprint.title || 'Blueprint Visualization'}</h1>
          {blueprint.description && (
            <p className={styles.subtitle}>{blueprint.description}</p>
          )}
        </div>
        <button 
          onClick={handleSave} 
          disabled={isSaving}
          className={styles.saveButton}
        >
          <FiSave />
          {isSaving ? 'Saving...' : 'Save'}
        </button>
      </div>

      {/* Save status */}
      {saveError && (
        <div className={styles.saveError}>
          <FiAlertCircle />
          {saveError}
        </div>
      )}

      {/* React Flow Canvas */}
      <div className={styles.flowContainer}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          fitView
          style={{ width: '100%', height: '100%' }}
        >
          <MiniMap />
          <Controls />
          <Background />
        </ReactFlow>
      </div>

      {/* Blueprint Info Panel */}
      <div className={styles.infoPanel}>
        <h3>Blueprint Information</h3>
        <div className={styles.infoGrid}>
          <div className={styles.infoItem}>
            <strong>ID:</strong> {blueprint.id}
          </div>
          <div className={styles.infoItem}>
            <strong>Created:</strong> {new Date(blueprint.createdAt).toLocaleDateString()}
          </div>
          <div className={styles.infoItem}>
            <strong>Updated:</strong> {new Date(blueprint.updatedAt).toLocaleDateString()}
          </div>
          <div className={styles.infoItem}>
            <strong>Total Nodes:</strong> {nodes.length}
          </div>
          <div className={styles.infoItem}>
            <strong>Total Connections:</strong> {edges.length}
          </div>
        </div>
        
        <h4>Source Text Preview</h4>
        <div className={styles.sourcePreview}>
          {blueprint.sourceText.substring(0, 200)}...
        </div>
      </div>
    </div>
  );
};

export default BlueprintDetailPage;
