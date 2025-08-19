import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useParams } from 'react-router-dom';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  type Connection,
  type EdgeChange,
  type NodeChange,
  type Node,
  type Edge,
  Handle,
  Position,
  useReactFlow,
  ReactFlowProvider,
  Panel
} from 'reactflow';
import type { ReactFlowInstance } from 'reactflow';
import 'reactflow/dist/style.css';
import { FiEye, FiMap, FiX, FiMaximize2, FiMinimize2, FiZoomIn, FiPlus, FiEdit3, FiTrash2, FiSave, FiTag, FiGrid, FiLayers } from 'react-icons/fi';
import Dagre from '@dagrejs/dagre';
import styles from './MindMapView.module.css';
import MasteryReviewModal from '../mastery/MasteryReviewModal';

// Dagre.js layout algorithm for automatic node positioning
const getLayoutedElements = (nodes: Node[], edges: Edge[], direction: 'TB' | 'LR' = 'TB') => {
  const dagreGraph = new Dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));
  
  // Set graph direction (TB = top to bottom, LR = left to right)
  dagreGraph.setGraph({ rankdir: direction });
  
  // Add nodes to the graph
  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { 
      width: 200,  // Default width for nodes
      height: 100  // Default height for nodes
    });
  });
  
  // Add edges to the graph
  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });
  
  // Calculate the layout
  Dagre.layout(dagreGraph);
  
  // Apply the calculated positions to nodes
  const layoutedNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    
    // Adjust positions to match ReactFlow's coordinate system
    const position = {
      x: nodeWithPosition.x - (nodeWithPosition.width / 2),
      y: nodeWithPosition.y - (nodeWithPosition.height / 2)
    };
    
    return {
      ...node,
      position,
      // Set handle positions based on layout direction
      targetPosition: direction === 'LR' ? Position.Left : Position.Top,
      sourcePosition: direction === 'LR' ? Position.Right : Position.Bottom
    };
  });
  
  return { nodes: layoutedNodes, edges };
};

// Context Menu Component
const ContextMenu: React.FC<{
  x: number;
  y: number;
  onClose: () => void;
  onAddMasteryCriterion: (parentId?: string) => void;
  onAddPathway: (parentId?: string) => void;
  onAddSection: (parentId?: string) => void;
  parentNode?: Node;
}> = ({ x, y, onClose, onAddMasteryCriterion, onAddPathway, onAddSection, parentNode }) => {
  const handleAddMasteryCriterion = () => {
    onAddMasteryCriterion(parentNode?.id);
    onClose();
  };

  const handleAddPathway = () => {
    onAddPathway(parentNode?.id);
    onClose();
  };

  const handleAddSection = () => {
    onAddSection(parentNode?.id);
    onClose();
  };

  return (
    <div 
      className={styles.contextMenu}
      style={{ left: x, top: y }}
      onContextMenu={(e) => e.preventDefault()}
    >
      <div className={styles.contextMenuHeader}>
        <span>Add New</span>
        <button className={styles.contextMenuClose} onClick={onClose}>
          <FiX />
        </button>
      </div>
      
      <div className={styles.contextMenuItem} onClick={handleAddMasteryCriterion}>
        <FiPlus />
        <span>Add Mastery Criterion</span>
      </div>
      
      <div className={styles.contextMenuItem} onClick={handleAddPathway}>
        <FiPlus />
        <span>Add Pathway</span>
      </div>
      
      <div className={styles.contextMenuItem} onClick={handleAddSection}>
        <FiPlus />
        <span>Add Section</span>
      </div>
    </div>
  );
};

// Node Toolbar Component
const NodeToolbar: React.FC<{
  node: Node;
  onEdit: (nodeId: string) => void;
  onDelete: (nodeId: string) => void;
  onAddChild: (nodeId: string) => void;
}> = ({ node, onEdit, onDelete, onAddChild }) => {
  return (
    <div className={styles.nodeToolbar}>
      <button 
        className={styles.toolbarButton}
        onClick={() => onAddChild(node.id)}
        title="Add Child"
      >
        <FiPlus />
      </button>
      <button 
        className={styles.toolbarButton}
        onClick={() => onEdit(node.id)}
        title="Edit"
      >
        <FiEdit3 />
      </button>
      <button 
        className={styles.toolbarButton}
        onClick={() => onDelete(node.id)}
        title="Delete"
      >
        <FiTrash2 />
      </button>
    </div>
  );
};

// Mastery Criterion Modal Component
const MasteryCriterionModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSave: (criterionData: any) => void;
  parentNode?: Node;
  editMode?: boolean;
  editData?: any;
}> = ({ isOpen, onClose, onSave, parentNode, editMode = false, editData }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    weight: 1,
    uueStage: 'UNDERSTAND' as 'UNDERSTAND' | 'USE' | 'EXPLORE',
    complexityScore: 3,
    assessmentType: 'QUESTION_BASED',
    masteryThreshold: 0.8,
    timeLimit: 30,
    attemptsAllowed: 3,
    prerequisiteFor: [] as string[],
    requiresPrerequisites: [] as string[]
  });

  // Populate form with edit data when in edit mode
  useEffect(() => {
    if (editMode && editData) {
      setFormData({
        title: editData.title || editData.label || '',
        description: editData.description || '',
        weight: editData.weight || 1,
        uueStage: editData.uueStage || 'UNDERSTAND',
        complexityScore: editData.complexityScore || 3,
        assessmentType: editData.assessmentType || 'QUESTION_BASED',
        masteryThreshold: editData.masteryThreshold || 0.8,
        timeLimit: editData.timeLimit || 30,
        attemptsAllowed: editData.attemptsAllowed || 3,
        prerequisiteFor: editData.prerequisiteFor || [],
        requiresPrerequisites: editData.requiresPrerequisites || []
      });
    }
  }, [editMode, editData]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const criterionData = {
      ...formData,
      type: 'criterion',
      itemCount: 0,
      isExpanded: false,
      questionInstances: []
    };
    
    onSave(criterionData);
    onClose();
    
    // Reset form
    setFormData({
      title: '',
      description: '',
      weight: 1,
      uueStage: 'UNDERSTAND' as 'UNDERSTAND' | 'USE' | 'EXPLORE',
      complexityScore: 3,
      assessmentType: 'QUESTION_BASED',
      masteryThreshold: 0.8,
      timeLimit: 30,
      attemptsAllowed: 3,
      prerequisiteFor: [],
      requiresPrerequisites: []
    });
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>{editMode ? 'Edit Mastery Criterion' : 'Create New Mastery Criterion'}</h2>
          <button className={styles.modalClose} onClick={onClose}>
            <FiX />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className={styles.modalForm}>
          <div className={styles.formGroup}>
            <label htmlFor="title">Title *</label>
            <input
              id="title"
              type="text"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="Enter criterion title"
              required
            />
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Describe this mastery criterion"
              rows={3}
            />
          </div>
          
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="weight">Weight</label>
              <select
                id="weight"
                value={formData.weight}
                onChange={(e) => handleInputChange('weight', parseInt(e.target.value))}
              >
                <option value={1}>1 - Low</option>
                <option value={2}>2 - Medium</option>
                <option value={3}>3 - High</option>
                <option value={4}>4 - Critical</option>
                <option value={5}>5 - Essential</option>
              </select>
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="uueStage">UUE Stage</label>
              <select
                id="uueStage"
                value={formData.uueStage}
                onChange={(e) => handleInputChange('uueStage', e.target.value)}
              >
                <option value="UNDERSTAND">UNDERSTAND</option>
                <option value="USE">USE</option>
                <option value="EXPLORE">EXPLORE</option>
              </select>
            </div>
          </div>
          
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="assessmentType">Assessment Type</label>
              <select
                id="assessmentType"
                value={formData.assessmentType}
                onChange={(e) => handleInputChange('assessmentType', e.target.value)}
              >
                <option value="QUESTION_BASED">Question Based</option>
                <option value="EXPLANATION_BASED">Explanation Based</option>
                <option value="PROJECT_BASED">Project Based</option>
                <option value="PRACTICAL_BASED">Practical Based</option>
              </select>
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="complexityScore">Complexity Score (1-10)</label>
              <input
                id="complexityScore"
                type="number"
                min="1"
                max="10"
                value={formData.complexityScore}
                onChange={(e) => handleInputChange('complexityScore', parseInt(e.target.value) || 3)}
              />
            </div>
          </div>
          
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="masteryThreshold">Mastery Threshold (%)</label>
              <input
                id="masteryThreshold"
                type="number"
                min="50"
                max="100"
                value={Math.round(formData.masteryThreshold * 100)}
                onChange={(e) => handleInputChange('masteryThreshold', parseInt(e.target.value) / 100)}
              />
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="timeLimit">Time Limit (minutes)</label>
              <input
                id="timeLimit"
                type="number"
                min="5"
                max="120"
                value={formData.timeLimit}
                onChange={(e) => handleInputChange('timeLimit', parseInt(e.target.value) || 30)}
              />
            </div>
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="attemptsAllowed">Attempts Allowed</label>
            <input
              id="attemptsAllowed"
              type="number"
              min="1"
              max="10"
              value={formData.attemptsAllowed}
              onChange={(e) => handleInputChange('attemptsAllowed', parseInt(e.target.value) || 3)}
            />
          </div>
          

          
          <div className={styles.modalActions}>
            <button type="button" className={styles.cancelButton} onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className={styles.saveButton}>
              <FiSave />
              {editMode ? 'Update Mastery Criterion' : 'Create Mastery Criterion'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Custom node component for better display
const CustomNode: React.FC<{ 
  id: string;
  data: any;
  onEdit?: (nodeId: string) => void;
  onDelete?: (nodeId: string) => void;
  onAddChild?: (nodeId: string) => void;
  onReview?: (nodeId: string) => void;
}> = ({ id, data, onEdit, onDelete, onAddChild, onReview }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  
  // Use expandable node for mastery criteria
  if (data.type === 'criterion') {
    // Debug: Log the mastery status
    console.log('🔍 [CustomNode] Criterion node:', {
      id,
      label: data.label,
      isMastered: data.isMastered,
      masteryScore: data.masteryScore
    });
    // Determine if this criterion has any linked questions
    const hasQuestions = Array.isArray(data.questionInstances) && data.questionInstances.length > 0;
    
    // For mastery criterion nodes, we need to get the expanded state from the parent
    // This will be handled by the main component's state
    return (
      <div 
        className={`${styles.expandableCriterionNode} ${data.isMastered ? styles.mastered : styles.notMastered}`}
        data-type="criterion"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        style={{ 
          cursor: 'pointer',
          background: 'white !important',
          border: `2px solid ${data.isMastered ? '#dc2626' : '#6b7280'} !important`,
          boxShadow: `${data.isMastered 
            ? '0 4px 12px rgba(220, 38, 38, 0.2)' 
            : '0 4px 12px rgba(107, 114, 128, 0.2)'} !important`
        }}
      >
        {/* Node Toolbar */}
        {onEdit && onDelete && onAddChild && (
          <NodeToolbar
            node={{ id: id, position: { x: 0, y: 0 } } as Node}
            onEdit={onEdit}
            onDelete={onDelete}
            onAddChild={onAddChild}
          />
        )}

        <Handle type="target" position={Position.Top} />
        
        <div className={styles.nodeContent}>
          <div className={styles.nodeLabel}>{data.label}</div>
          <div className={styles.masteryInfo}>
            <div className={styles.masteryBadge}>
              {data.isMastered ? '✓' : '○'}
            </div>
            {data.masteryScore !== undefined && (
              <div className={styles.masteryScore}>
                {Math.round(data.masteryScore * 100)}%
              </div>
            )}
          </div>
          <div className={styles.expandIndicator}>
            {data.isExpanded ? '−' : '+'}
          </div>
        </div>

        {/* Expanded details */}
        {data.isExpanded && (
          <div className={styles.expandedDetails}>
            <div className={styles.detailSection}>
              <h4 className={styles.detailTitle}>Description</h4>
              <p className={styles.detailText}>{data.description || 'No description available'}</p>
            </div>
            
            {data.weight && (
              <div className={styles.detailSection}>
                <h4 className={styles.detailTitle}>Weight</h4>
                <span className={styles.detailTag}>{data.weight}</span>
              </div>
            )}
            
            {data.uueStage && (
              <div className={styles.detailSection}>
                <h4 className={styles.detailTitle}>UUE Stage</h4>
                <span className={`${styles.detailTag} ${styles[`stage-${data.uueStage.toLowerCase()}`]}`}>
                  {data.uueStage}
                </span>
              </div>
            )}
            
            {data.complexityScore && (
              <div className={styles.detailSection}>
                <h4 className={styles.detailTitle}>Complexity</h4>
                <span className={styles.detailText}>{data.complexityScore}/10</span>
              </div>
            )}
            
            {data.assessmentType && (
              <div className={styles.detailSection}>
                <h4 className={styles.detailTitle}>Assessment Type</h4>
                <span className={styles.detailTag}>{data.assessmentType}</span>
              </div>
            )}
            
            {data.masteryThreshold && (
              <div className={styles.detailSection}>
                <h4 className={styles.detailTitle}>Mastery Threshold</h4>
                <span className={styles.detailText}>{Math.round(data.masteryThreshold * 100)}%</span>
              </div>
            )}
            
            {data.questionInstances && data.questionInstances.length > 0 && (
              <div className={styles.detailSection}>
                <h4 className={styles.detailTitle}>Question Instances</h4>
                <div className={styles.questionInstancesList}>
                  {data.questionInstances.map((question: any) => (
                    <div key={question.id} className={styles.questionItem}>
                      <div className={styles.questionHeader}>
                        <strong>{question.questionText}</strong>
                        <span className={`${styles.questionDifficulty} ${styles[question.difficulty.toLowerCase()]}`}>
                          {question.difficulty}
                        </span>
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
            
            {/* Actions: Review and Edit */}
            <div className={styles.editSection}>
              <button
                className={styles.editButton}
                disabled={!hasQuestions}
                onClick={(e) => {
                  e.stopPropagation();
                  if (!hasQuestions) return;
                  console.log('🧪 [CustomNode] Review clicked', { nodeId: id, hasQuestions, qCount: (data.questionInstances || []).length });
                  if (onReview) onReview(id);
                }}
                title={hasQuestions ? 'Review questions for this criterion' : 'No questions to review'}
              >
                <FiEye />
                Review
              </button>
              <button
                className={styles.editButton}
                onClick={(e) => {
                  e.stopPropagation();
                  if (onEdit) onEdit(id);
                }}
                title="Edit this mastery criterion"
                style={{ marginLeft: 8 }}
              >
                <FiEdit3 />
                Edit
              </button>
            </div>
          </div>
        )}
        
        <Handle type="source" position={Position.Bottom} />
        
        {showTooltip && !data.isExpanded && (
          <div className={styles.nodeTooltip}>
            <div className={styles.tooltipTitle}>{data.label}</div>
            <div className={styles.tooltipDescription}>{data.description}</div>
            <div className={styles.tooltipType}>Type: {data.type}</div>
            <div className={styles.tooltipHint}>Click to expand details</div>
          </div>
        )}
      </div>
    );
  }

  // Use expandable node for primitives
  if (data.type === 'primitive') {
    return (
      <div 
        className={styles.expandablePrimitiveNode}
        data-type="primitive"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        style={{ cursor: 'pointer' }}
      >
        {/* Node Toolbar */}
        {onEdit && onDelete && onAddChild && (
          <NodeToolbar
            node={{ id: id, position: { x: 0, y: 0 } } as Node}
            onEdit={onEdit}
            onDelete={onDelete}
            onAddChild={onAddChild}
          />
        )}

        <Handle type="target" position={Position.Top} />
        
        <div className={styles.nodeContent}>
          <div className={styles.nodeLabel}>{data.label}</div>
          <div className={styles.expandIndicator}>
            {data.isExpanded ? '−' : '+'}
          </div>
        </div>

        {/* Expanded details */}
        {data.isExpanded && (
          <div className={styles.expandedDetails}>
            <div className={styles.detailSection}>
              <h4 className={styles.detailTitle}>Description</h4>
              <p className={styles.detailText}>{data.description || 'No description available'}</p>
            </div>
            
            {data.primitiveType && (
              <div className={styles.detailSection}>
                <h4 className={styles.detailTitle}>Type</h4>
                <span className={styles.detailTag}>{data.primitiveType}</span>
              </div>
            )}
            
            {data.difficultyLevel && (
              <div className={styles.detailSection}>
                <h4 className={styles.detailTitle}>Difficulty</h4>
                <span className={`${styles.detailTag} ${styles[`difficulty-${data.difficultyLevel.toLowerCase()}`]}`}>
                  {data.difficultyLevel}
                </span>
              </div>
            )}
            
            {data.estimatedTimeMinutes && (
              <div className={styles.detailSection}>
                <h4 className={styles.detailTitle}>Estimated Time</h4>
                <span className={styles.detailText}>{data.estimatedTimeMinutes} minutes</span>
              </div>
            )}
            
            {data.complexityScore && (
              <div className={styles.detailSection}>
                <h4 className={styles.detailTitle}>Complexity</h4>
                <span className={styles.detailText}>{data.complexityScore}/10</span>
              </div>
            )}
            
            {data.conceptTags && data.conceptTags.length > 0 && (
              <div className={styles.detailSection}>
                <h4 className={styles.detailTitle}>Concept Tags</h4>
                <div className={styles.conceptTags}>
                  {data.conceptTags.map((tag: string) => (
                    <span key={tag} className={styles.conceptTag}>{tag}</span>
                  ))}
                </div>
              </div>
            )}
            
            {data.masteryCriteria && data.masteryCriteria.length > 0 && (
              <div className={styles.detailSection}>
                <h4 className={styles.detailTitle}>Mastery Criteria</h4>
                <div className={styles.masteryCriteriaList}>
                  {data.masteryCriteria.map((criterion: any) => (
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
              </div>
            )}
          </div>
        )}
        
        <Handle type="source" position={Position.Bottom} />
        
        {showTooltip && !data.isExpanded && (
          <div className={styles.nodeTooltip}>
            <div className={styles.tooltipTitle}>{data.label}</div>
            <div className={styles.tooltipDescription}>{data.description}</div>
            <div className={styles.tooltipType}>Type: {data.type}</div>
            <div className={styles.tooltipHint}>Click to expand details</div>
          </div>
        )}
      </div>
    );
  }
  
  return (
    <div 
      className={styles.customNode}
      data-type={data.type}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      {/* Node Toolbar */}
      {onEdit && onDelete && onAddChild && (
        <NodeToolbar
          node={{ id: data.id || 'temp', position: { x: 0, y: 0 } } as Node}
          onEdit={onEdit}
          onDelete={onDelete}
          onAddChild={onAddChild}
        />
      )}

      <Handle type="target" position={Position.Top} />
      <div className={styles.nodeContent}>
        <div className={styles.nodeLabel}>{data.label}</div>
        {data.itemCount > 0 && (
          <div className={styles.nodeCount}>{data.itemCount}</div>
        )}
      </div>
      <Handle type="source" position={Position.Bottom} />
      
      {showTooltip && data.description && (
        <div className={styles.nodeTooltip}>
          <div className={styles.tooltipTitle}>{data.label}</div>
          <div className={styles.tooltipDescription}>{data.description}</div>
          <div className={styles.tooltipType}>Type: {data.type}</div>
        </div>
      )}
    </div>
  );
};

// Define nodeTypes outside the component to prevent infinite re-renders
const createNodeTypes = (
  onEdit: (nodeId: string) => void,
  onDelete: (nodeId: string) => void,
  onAddChild: (nodeId: string) => void,
  onReview: (nodeId: string) => void
) => ({
  custom: (props: any) => (
    <CustomNode 
      {...props} 
      onEdit={onEdit}
      onDelete={onDelete}
      onAddChild={onAddChild}
      onReview={onReview}
    />
  )
});

// Create a stable nodeTypes object that will be updated via callback
const createStableNodeTypes = () => {
  let currentHandlers = {
    onEdit: (nodeId: string) => {},
    onDelete: (nodeId: string) => {},
    onAddChild: (nodeId: string) => {},
    onReview: (nodeId: string) => {}
  };
  
  const nodeTypes = createNodeTypes(
    (nodeId: string) => currentHandlers.onEdit(nodeId),
    (nodeId: string) => currentHandlers.onDelete(nodeId),
    (nodeId: string) => currentHandlers.onAddChild(nodeId),
    (nodeId: string) => currentHandlers.onReview(nodeId)
  );
  
  const updateHandlers = (newHandlers: typeof currentHandlers) => {
    currentHandlers = newHandlers;
  };
  
  return { nodeTypes, updateHandlers };
};

interface MindMapViewProps {
  blueprintId: string;
  sectionId?: string;
  className?: string;
  selectedItem: any;
  pageType?: 'ideaspace' | 'pathways'; // Add page type to distinguish between pages
  onClose?: () => void;
  isFullscreen?: boolean;
  onToggleFullscreen?: () => void;
}

const MindMapView: React.FC<MindMapViewProps> = ({
  blueprintId,
  sectionId,
  className,
  selectedItem,
  pageType,
  onClose,
  isFullscreen = false,
  onToggleFullscreen
}) => {
  // Debug logging for props
  console.log('🧠 [MindMapView] Component rendered with props:', {
    blueprintId,
    sectionId,
    pageType,
    selectedItemName: selectedItem?.name || selectedItem?.title,
    selectedItemType: selectedItem?.type,
    hasPrimitives: selectedItem?.primitives?.length > 0,
    hasMasteryCriteria: selectedItem?.masteryCriteria?.length > 0
  });

  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    parentNode?: Node;
  } | null>(null);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [masteryCriterionModal, setMasteryCriterionModal] = useState<{
    isOpen: boolean;
    parentId?: string;
    editMode?: boolean;
    editNodeId?: string;
    editData?: any;
  }>({ isOpen: false });
  const [reviewModal, setReviewModal] = useState<{
    isOpen: boolean;
    criterion?: any;
    questions?: any[];
    masteryTracking?: any;
  }>({ isOpen: false });
  const reactFlowInstance = useRef<ReactFlowInstance | null>(null);

  // Create handlers directly in the nodeTypes useMemo to avoid stale closures

  // Debug modal state changes
  useEffect(() => {
    console.log('masteryCriterionModal state changed:', masteryCriterionModal);
      }, [masteryCriterionModal]);

  // Debug review modal state changes
  useEffect(() => {
    console.log('🧪 [MindMapView] reviewModal state changed:', reviewModal);
  }, [reviewModal]);

  // Debug nodes state changes
  useEffect(() => {
    console.log('Nodes state changed:', nodes);
    console.log('Nodes count:', nodes.length);
  }, [nodes]);

  // Helper function to get node by ID
  const getNode = useCallback((nodeId: string) => {
    return nodes.find(n => n.id === nodeId);
  }, [nodes]);

  // Generate mind map data from the selected item
  const generateMindMapData = useCallback((item: any) => {
    if (!item) return { nodes: [], edges: [] };

    // Auto-detect page type if not specified
    const detectedPageType = pageType || (item.primitives ? 'ideaspace' : item.masteryCriteria ? 'pathways' : 'ideaspace');

    // Debug logging
    console.log('🧠 [MindMapView] generateMindMapData called:', {
      itemName: item?.name || item?.title,
      itemType: item?.type,
      pageType,
      detectedPageType,
      hasPrimitives: item?.primitives?.length > 0,
      hasMasteryCriteria: item?.masteryCriteria?.length > 0,
      itemKeys: Object.keys(item || {}),
      finalPageType: pageType || detectedPageType,
      selectedItemTitle: selectedItem?.title || selectedItem?.name
    });

    // Use the explicitly passed pageType if available, otherwise fall back to auto-detection
    const finalPageType = pageType || detectedPageType;

    const nodes: Node[] = [];
    const edges: Edge[] = [];
    let nodeId = 0;

    // Helper function to add a node
    const addNode = (itemData: any, type: string): string => {
      const id = `node-${nodeId++}`;
      // Handle both 'name' (for sections/blueprints/ideaspaces) and 'title' (for primitives)
      const label = itemData.name || itemData.title || 'Unknown';
      const description = itemData.description || '';
      
      // Calculate item count based on node type
      let itemCount = itemData.itemCount || 0;
      if (type === 'criterion') {
        itemCount = itemData.questionInstances ? itemData.questionInstances.length : 0;
      } else if (itemData.masteryCriteria) {
        itemCount = itemData.masteryCriteria.length;
      } else if (itemData.primitives) {
        itemCount = itemData.primitives.length;
      }
      
      // For mastery criterion nodes, include all the detailed data
      const nodeData: any = {
        label,
        description,
        // Normalize to the explicit type we are adding for consistency in rendering
        // This ensures mastery criterion nodes are recognized as 'criterion'
        type: type,
        itemCount,
        isExpanded: false, // Initialize as not expanded
        originalId: itemData.id // Store the original ID for prerequisite matching
      };
      
      // Add mastery criterion-specific data if this is a criterion
      if (type === 'criterion') {
        nodeData.weight = itemData.weight;
        nodeData.uueStage = itemData.uueStage;
        nodeData.complexityScore = itemData.complexityScore;
        nodeData.assessmentType = itemData.assessmentType;
        nodeData.masteryThreshold = itemData.masteryThreshold;
        nodeData.timeLimit = itemData.timeLimit;
        nodeData.attemptsAllowed = itemData.attemptsAllowed;
        // Enhance mock data when questionInstances is not provided (undefined/null)
        nodeData.questionInstances = Array.isArray(itemData.questionInstances)
          ? itemData.questionInstances
          : [
              {
                id: `${id}-q1`,
                questionText: `What is the key idea behind "${label}"?`,
                answer: 'It depends on the specific criterion context',
                explanation: 'This is a sample short-answer question for demonstration.',
                difficulty: 'MEDIUM',
                questionType: 'short_answer'
              },
              {
                id: `${id}-q2`,
                questionText: `Select the correct statement about "${label}".`,
                answer: 'Option B',
                explanation: 'Option B reflects the expected behaviour for this criterion.',
                difficulty: 'EASY',
                questionType: 'multiple_choice',
                options: [
                  { id: `${id}-q2-o1`, text: 'Option A' },
                  { id: `${id}-q2-o2`, text: 'Option B' },
                  { id: `${id}-q2-o3`, text: 'Option C' }
                ]
              }
            ];
        nodeData.prerequisiteFor = itemData.prerequisiteFor;
        nodeData.requiresPrerequisites = itemData.requiresPrerequisites;
        // Preserve mastery status data
        nodeData.isMastered = itemData.isMastered;
        nodeData.masteryScore = itemData.masteryScore;
        nodeData.difficulty = itemData.difficulty;
        nodeData.criterionType = itemData.type;
      }
      
      // Add primitive-specific data if this is a primitive
      if (type === 'primitive') {
        nodeData.primitiveType = itemData.primitiveType;
        nodeData.difficultyLevel = itemData.difficultyLevel;
        nodeData.estimatedTimeMinutes = itemData.estimatedTimeMinutes;
        nodeData.conceptTags = itemData.conceptTags;
        nodeData.complexityScore = itemData.complexityScore;
        // Note: Primitives don't have mastery criteria in IdeaspacePage
        // Mastery criteria are only shown in PathwaysPage
      }
      
      nodes.push({
        id,
        type: 'custom',
        position: { x: 0, y: 0 }, // Will be calculated by Dagre.js
        data: nodeData
      });
      return id;
    };

    // Add the selected item as the root node (only for non-pathways pages)
    let rootId: string;
    if (finalPageType === 'pathways') {
      // For pathways, we don't want a root node
      rootId = 'virtual-root';
    } else {
      rootId = addNode(item, item.type);
    }

    // Recursive function to add all nested content
    const addNestedContent = (parentId: string, parentItem: any, level: number = 0) => {
      console.log(`🧠 [MindMapView] addNestedContent level ${level}:`, {
        parentId,
        parentName: parentItem?.name,
        parentType: parentItem?.type,
        hasChildren: parentItem?.children?.length > 0,
        hasPrimitives: parentItem?.primitives?.length > 0,
        hasMasteryCriteria: parentItem?.masteryCriteria?.length > 0,
        finalPageType
      });

      // Add children if they exist
      if (parentItem.children && parentItem.children.length > 0) {
        parentItem.children.forEach((child: any) => {
                // For pathways page, skip adding section and blueprint nodes
      if (finalPageType === 'pathways' && (child.type === 'section' || child.type === 'blueprint')) {
        // Skip adding the node, but still process its children recursively
        // Pass the current parentId so mastery criteria connect to the right parent
        addNestedContent(parentId, child, level + 1);
        return;
      }
          
          const childId = addNode(child, child.type);
          
          // Add edge from parent to child
          edges.push({
            id: `edge-${parentId}-${childId}`,
            source: parentId,
            target: childId,
            type: 'default',
            style: { 
              stroke: level === 0 ? 'var(--color-primary)' : 'var(--color-secondary)',
              strokeWidth: level === 0 ? 3 : 2 
            }
          });

          // Recursively add nested content
          addNestedContent(childId, child, level + 1);
        });
      }

      // Add primitives if they exist (for IdeaspacePage)
      if (finalPageType === 'ideaspace' && parentItem.primitives && parentItem.primitives.length > 0) {
        console.log(`🧠 [MindMapView] Adding ${parentItem.primitives.length} primitives for ideaspace page`);
        parentItem.primitives.forEach((primitive: any, index: number) => {
          const primitiveId = addNode(primitive, 'primitive');
          
          // Add edge from parent to primitive
          const edgeId = `edge-${parentId}-${primitiveId}`;
          const edge = {
            id: edgeId,
            source: parentId,
            target: primitiveId,
            type: 'default', // Use default edge type for reliability
            style: { 
              stroke: '#6b7280', // Explicit color for primitives
              strokeWidth: 2,
              strokeOpacity: 0.8
            },
            animated: false,
            zIndex: 1
          };
          edges.push(edge);
        });
      }

      // Add mastery criteria if they exist (for PathwaysPage)
      if (finalPageType === 'pathways' && parentItem.masteryCriteria && parentItem.masteryCriteria.length > 0) {
        console.log(`🧠 [MindMapView] Adding ${parentItem.masteryCriteria.length} mastery criteria for pathways page`);
        parentItem.masteryCriteria.forEach((criterion: any) => {
          const criterionId = addNode(criterion, 'criterion');
          
          // Add edge from parent to criterion
          edges.push({
            id: `edge-${parentId}-${criterionId}`,
            source: parentId,
            target: criterionId,
            type: 'default',
            style: { 
              stroke: 'var(--color-text-muted)',
              strokeWidth: 1.5 
            }
          });

          // Add question instances if they exist
          if (criterion.questionInstances && criterion.questionInstances.length > 0) {
            criterion.questionInstances.forEach((question: any) => {
              const questionId = addNode(question, 'question');
              
              // Add edge from criterion to question
              edges.push({
                id: `edge-${criterionId}-${questionId}`,
                source: criterionId,
                target: questionId,
                type: 'default',
                style: { 
                  stroke: 'var(--color-success)',
                  strokeWidth: 1 
                }
              });
            });
          }
        });

        // Add prerequisite edges between mastery criteria
        if (parentItem.masteryCriteria && parentItem.masteryCriteria.length > 0) {
          parentItem.masteryCriteria.forEach((criterion: any) => {
            if (criterion.prerequisites && criterion.prerequisites.length > 0) {
              criterion.prerequisites.forEach((prereqId: string) => {
                // Find the prerequisite criterion node by matching the original criterion ID
                const prereqNode = nodes.find(n => n.data.originalId === prereqId || n.data.id === prereqId);
                // Find the current criterion node by matching the original criterion ID
                const currentNode = nodes.find(n => n.data.originalId === criterion.id || n.data.id === criterion.id);
                
                if (prereqNode && currentNode) {
                  console.log('🔗 [MindMapView] Creating prerequisite edge:', {
                    from: prereqNode.data.label,
                    to: currentNode.data.label,
                    prereqId,
                    criterionId: criterion.id
                  });
                  
                  edges.push({
                    id: `prereq-${prereqId}-${criterion.id}`,
                    source: prereqNode.id,
                    target: currentNode.id,
                    type: 'default',
                    animated: true,
                    style: {
                      stroke: '#ff6b6b',
                      strokeWidth: 2,
                      strokeDasharray: '5,5',
                      zIndex: 2
                    },
                    data: {
                      type: 'prerequisite',
                      label: 'Prerequisite'
                    }
                  });
                } else {
                  console.log('❌ [MindMapView] Could not find nodes for prerequisite edge:', {
                    prereqId,
                    criterionId: criterion.id,
                    availableNodes: nodes.map(n => ({ id: n.id, originalId: n.data.originalId, label: n.data.label }))
                  });
                }
              });
            }
          });
        }
      }
    };

    // For pathways page, create a mastery criteria hierarchy without root node
    if (finalPageType === 'pathways') {
      // Find all mastery criteria from the selected item and its children
      const allCriteria: any[] = [];
      const collectCriteria = (item: any) => {
        if (item.masteryCriteria) {
          allCriteria.push(...item.masteryCriteria);
        }
        if (item.children) {
          item.children.forEach(collectCriteria);
        }
      };
      collectCriteria(item);
      
      if (allCriteria.length > 0) {
        console.log(`🧠 [MindMapView] Creating mastery criteria hierarchy with ${allCriteria.length} criteria`);
        
        // Create nodes for all criteria
        const criterionNodes = new Map<string, string>(); // originalId -> nodeId
        allCriteria.forEach((criterion: any) => {
          console.log('🧠 [MindMapView] Creating criterion node:', {
            id: criterion.id,
            title: criterion.title,
            isMastered: criterion.isMastered,
            masteryScore: criterion.masteryScore
          });
          const nodeId = addNode(criterion, 'criterion');
          criterionNodes.set(criterion.id, nodeId);
        });
        
        // Create prerequisite edges to show learning progression with mastery-based colors
        allCriteria.forEach((criterion: any) => {
          if (criterion.prerequisites && criterion.prerequisites.length > 0) {
            criterion.prerequisites.forEach((prereqId: string) => {
              const prereqNodeId = criterionNodes.get(prereqId);
              const currentNodeId = criterionNodes.get(criterion.id);
              
              if (prereqNodeId && currentNodeId) {
                const prereqCriterion = allCriteria.find(c => c.id === prereqId);
                const isPrereqMastered = prereqCriterion?.isMastered || false;
                
                console.log('🔗 [MindMapView] Creating prerequisite edge:', {
                  from: prereqCriterion?.title,
                  to: criterion.title,
                  isPrereqMastered
                });
                
                // Different colors based on mastery status
                let edgeColor = '#ff6b6b'; // Default red for unmastered
                let edgeStyle = '5,5'; // Dashed
                
                console.log('🎨 [MindMapView] Prerequisite mastery check:', {
                  prereqId,
                  prereqCriterion: prereqCriterion?.title,
                  isPrereqMastered,
                  masteryScore: prereqCriterion?.masteryScore
                });
                
                if (isPrereqMastered) {
                  edgeColor = '#51cf66'; // Green for mastered
                  edgeStyle = 'none'; // Solid line
                  console.log('✅ [MindMapView] Using GREEN line for mastered prerequisite');
                } else {
                  console.log('❌ [MindMapView] Using RED line for unmastered prerequisite');
                }
                
                edges.push({
                  id: `prereq-${prereqId}-${criterion.id}`,
                  source: prereqNodeId,
                  target: currentNodeId,
                  type: 'default',
                  animated: !isPrereqMastered, // Only animate unmastered prerequisites
                  style: {
                    stroke: edgeColor,
                    strokeWidth: 2,
                    strokeDasharray: edgeStyle,
                    zIndex: 2
                  },
                  data: {
                    type: 'prerequisite',
                    label: 'Prerequisite',
                    isPrereqMastered
                  }
                });
              }
            });
          }
        });
        
        // Add question instances if they exist
        allCriteria.forEach((criterion: any) => {
          if (criterion.questionInstances && criterion.questionInstances.length > 0) {
            const criterionNodeId = criterionNodes.get(criterion.id);
            if (criterionNodeId) {
              criterion.questionInstances.forEach((question: any) => {
                console.log('❓ [MindMapView] Adding question instance:', {
                  questionText: question.questionText,
                  explanation: question.explanation
                });
                
                const questionId = addNode({
                  ...question,
                  title: question.questionText, // Use title for consistency
                  description: question.explanation,
                  type: 'question'
                }, 'question');
                
                edges.push({
                  id: `edge-${criterionNodeId}-${questionId}`,
                  source: criterionNodeId,
                  target: questionId,
                  type: 'default',
                  style: { 
                    stroke: 'var(--color-success)',
                    strokeWidth: 1 
                  }
                });
              });
            }
          }
        });
      }
    } else {
      // For non-pathways pages, use the original recursive approach
      addNestedContent(rootId, item, 0);
    }

    // Apply Dagre.js layout to get clean positioning
    return getLayoutedElements(nodes, edges, 'TB'); // Top to bottom layout
  }, []);

  // Layout control function
  const onLayout = useCallback((direction: 'TB' | 'LR') => {
    if (nodes.length === 0) return;
    
    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(nodes, edges, direction);
    
    setNodes([...layoutedNodes]);
    setEdges([...layoutedEdges]);
    
    // Fit view after layout change
    setTimeout(() => {
      reactFlowInstance.current?.fitView();
    }, 100);
  }, [nodes, edges]);

  // Create stable nodeTypes that won't cause infinite re-renders
  const { nodeTypes, updateHandlers } = useMemo(() => createStableNodeTypes(), []);
  
  // Update handlers when nodes change
  useEffect(() => {
    const handleEditNode = (nodeId: string) => {
      // Open the primitive modal in edit mode
      const node = nodes.find(n => n.id === nodeId);
      
      if (node && node.data.type === 'criterion') {
        const newModalState = {
          isOpen: true,
          parentId: undefined, // No parent for editing
          editMode: true,
          editNodeId: nodeId,
          editData: node.data
        };
        setMasteryCriterionModal(newModalState);
      }
    };
    
    const handleDeleteNode = (nodeId: string) => {
      setNodes(prevNodes => prevNodes.filter(n => n.id !== nodeId));
      setEdges(prevEdges => prevEdges.filter(e => e.source !== nodeId && e.target !== nodeId));
    };
    
    const handleAddChild = (nodeId: string) => {
      const node = nodes.find(n => n.id === nodeId);
      if (node) {
        setContextMenu({
          x: 100,
          y: 100,
          parentNode: node
        });
      }
    };

    const handleReview = (nodeId: string) => {
      console.log('👁️ [MindMapView] handleReview clicked for node:', nodeId);
      const node = nodes.find(n => n.id === nodeId);
      if (!node || node.data.type !== 'criterion') return;

      const data = node.data || {};
      const rawQuestions: any[] = Array.isArray(data.questionInstances) ? data.questionInstances : [];

      const questions = rawQuestions.map((q: any, idx: number) => {
        const qId = q.id || `temp-${Date.now()}-${idx}`;
        const correctAnswer = q.correctAnswer ?? q.answer;
        const options = Array.isArray(q.options)
          ? q.options.map((opt: any, i: number) => {
              const text = typeof opt === 'string' ? opt : (opt.text ?? String(opt));
              const isCorrect = Array.isArray(correctAnswer)
                ? correctAnswer.includes(text)
                : (typeof correctAnswer === 'string' ? correctAnswer === text : false);
              return {
                id: opt.id || `opt-${qId}-${i}`,
                text,
                isCorrect,
                explanation: opt.explanation || undefined,
                questionInstanceId: qId
              };
            })
          : undefined;

        const questionType = q.questionType
          || (options ? 'multiple_choice' : (typeof correctAnswer === 'boolean' ? 'true_false' : 'short_answer'));

        const difficulty = (q.difficulty || 'medium').toString().toLowerCase();

        return {
          id: qId,
          question: q.question || q.questionText || '',
          answer: q.answer,
          questionType,
          difficulty,
          status: 'active',
          masteryCriterionId: data.originalId || data.id || nodeId,
          blueprintSectionId: (selectedItem && (selectedItem.id || selectedItem.blueprintSectionId)) || 'unknown',
          userId: selectedItem?.userId || 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          options,
          correctAnswer,
          explanation: q.explanation,
          hints: q.hints || [],
          tags: q.tags || [],
          userQuestionAttempts: [],
          masteryCriterion: {},
          successRate: undefined,
          averageTimeSpent: undefined,
          isActive: true
        };
      });

      const masteryTracking = {
        id: (data.originalId || nodeId) + '-tracking',
        userId: selectedItem?.userId || 0,
        blueprintSectionId: (selectedItem && (selectedItem.id || selectedItem.blueprintSectionId)) || 'unknown',
        masteryCriterionId: data.originalId || nodeId,
        currentLevel: typeof data.masteryScore === 'number' ? Math.max(0, Math.min(5, Math.round((data.masteryScore || 0) * 5))) : 0,
        targetLevel: 5,
        totalAttempts: 0,
        successfulAttempts: 0,
        consecutiveSuccesses: 0,
        consecutiveFailures: 0,
        lastAttemptAt: new Date().toISOString(),
        nextReviewAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        successRate: 0,
        progressPercentage: typeof data.masteryScore === 'number' ? Math.round((data.masteryScore || 0) * 100) : 0,
        isMastered: !!data.isMastered,
        isDue: true,
        daysUntilNextReview: 0
      };

      const criterion = {
        id: data.originalId || nodeId,
        title: data.label || 'Criterion',
        description: data.description || '',
        weight: data.weight || 1,
        uueStage: data.uueStage || 'UNDERSTAND',
        complexityScore: data.complexityScore || 3,
        knowledgePrimitiveId: data.knowledgePrimitiveId || 'unknown',
        blueprintSectionId: (selectedItem && (selectedItem.id || selectedItem.blueprintSectionId)) || 'unknown',
        userId: selectedItem?.userId || 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        questionInstances: [],
        userCriterionMasteries: [],
        masteryProgress: undefined,
        nextReviewAt: undefined,
        isDue: undefined
      };

      const nextState = { isOpen: true, criterion, questions, masteryTracking };
      console.log('👁️ [MindMapView] Opening review modal with:', nextState);
      setReviewModal(nextState);
    };
    
    updateHandlers({
      onEdit: handleEditNode,
      onDelete: handleDeleteNode,
      onAddChild: handleAddChild,
      onReview: handleReview
    });
  }, [nodes, setNodes, setEdges, setContextMenu, setMasteryCriterionModal, updateHandlers]);

  // Handle node clicks for expansion
  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    
    if (node.data.type === 'criterion' || node.data.type === 'primitive') {
      // Update the node data to include expansion state
      setNodes(prevNodes => 
        prevNodes.map(n => 
          n.id === node.id 
            ? { 
                ...n, 
                data: { 
                  ...n.data, 
                  isExpanded: !n.data.isExpanded 
                } 
              }
            : n
        )
      );
      
      // Also update our expanded nodes set for tracking
      setExpandedNodes(prev => {
        const newSet = new Set(prev);
        if (newSet.has(node.id)) {
          newSet.delete(node.id);
        } else {
          newSet.add(node.id);
        }
        return newSet;
      });
    }
    
    setSelectedNode(node);
  }, []);

  // Handle pane right-click for context menu
  const onPaneContextMenu = useCallback((event: React.MouseEvent) => {
    event.preventDefault();
    setContextMenu({
      x: event.clientX,
      y: event.clientY
    });
  }, []);

  // Handle node right-click for context menu
  const onNodeContextMenu = useCallback((event: React.MouseEvent, node: Node) => {
    event.preventDefault();
    setContextMenu({
      x: event.clientX,
      y: event.clientY,
      parentNode: node
    });
  }, []);

  // Close context menu when clicking elsewhere
  const onPaneClick = useCallback(() => {
    setContextMenu(null);
    setSelectedNode(null);
  }, []);

  // Add new mastery criterion
  const handleAddMasteryCriterion = useCallback((parentId?: string) => {
    setMasteryCriterionModal({ isOpen: true, parentId });
  }, []);

  // Add new section
  const handleAddSection = useCallback((parentId?: string) => {
    const newNodeId = `node-${Date.now()}`;
    const parentNode = parentId ? getNode(parentId) : null;
    
    let position = { x: 0, y: 0 };
    if (parentNode) {
      position = {
        x: parentNode.position.x + 200,
        y: parentNode.position.y + 100
      };
    }

    const newNode: Node = {
      id: newNodeId,
      type: 'custom',
      position,
      data: {
        label: 'New Section',
        description: 'Description of the new section',
        type: 'section',
        itemCount: 0,
        children: []
      }
    };

    setNodes(prev => [...prev, newNode]);

    // Add edge if there's a parent
    if (parentId) {
      const newEdge: Edge = {
        id: `edge-${parentId}-${newNodeId}`,
        source: parentId,
        target: newNodeId,
        type: 'smoothstep',
        style: { 
          stroke: 'var(--color-secondary)',
          strokeWidth: 2 
        }
      };
      setEdges(prev => [...prev, newEdge]);
    }
  }, [getNode]);

  // Add new pathway
  const handleAddPathway = useCallback((parentId?: string) => {
    const newNodeId = `node-${Date.now()}`;
    const parentNode = parentId ? getNode(parentId) : null;
    
    let position = { x: 0, y: 0 };
    if (parentNode) {
      position = {
        x: parentNode.position.x + 200,
        y: parentNode.position.y + 100
      };
    }

    const newNode: Node = {
      id: newNodeId,
      type: 'custom',
      position,
      data: {
        label: 'New Pathway',
        description: 'Description of the new pathway',
        type: 'pathway',
        itemCount: 0,
        masteryCriteria: []
      }
    };

    setNodes(prev => [...prev, newNode]);

    // Add edge if there's a parent
    if (parentId) {
      const newEdge: Edge = {
        id: `edge-${parentId}-${newNodeId}`,
        source: parentId,
        target: newNodeId,
        type: 'smoothstep',
        style: { 
          stroke: 'var(--color-primary)',
          strokeWidth: 2 
        }
      };
      setEdges(prev => [...prev, newEdge]);
    }
  }, [getNode]);

  useEffect(() => {
    const loadMindMapData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Generate mind map data from the selected item
        const mindMapData = generateMindMapData(selectedItem);
        
        // Simulate loading delay for better UX
        setTimeout(() => {
          setNodes(mindMapData.nodes);
          setEdges(mindMapData.edges);
          setIsLoading(false);
        }, 300);

      } catch (err) {
        console.error('Error loading mind map:', err);
        setError(err instanceof Error ? err.message : 'Failed to load mind map');
        setIsLoading(false);
      }
    };

    if (selectedItem) {
      loadMindMapData();
    } else {
      // If no selected item, set empty data and stop loading
      setNodes([]);
      setEdges([]);
      setIsLoading(false);
    }
  }, [selectedItem, generateMindMapData]);

  useEffect(() => {
    if (nodes.length > 0 && reactFlowInstance.current) {
      reactFlowInstance.current.fitView();
    }
  }, [nodes]);

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  const onConnect = useCallback(
    (connection: Connection) => setEdges((eds) => addEdge(connection, eds)),
    []
  );

  if (isLoading) {
    return (
      <div className={`${styles.mindMapView} ${className}`}>
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Loading mind map...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`${styles.mindMapView} ${className}`}>
        <div className={styles.error}>
          <p>Error loading mind map: {error}</p>
          <button onClick={() => window.location.reload()}>Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className={`${styles.mindMapView} ${className} ${isFullscreen ? styles.fullscreen : ''}`}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <FiMap className={styles.headerIcon} />
          <h3 className={styles.headerTitle}>
            {selectedItem ? `${selectedItem.title || selectedItem.name} - Mind Map` : 'Mind Map View'}
          </h3>
        </div>
        
        <div className={styles.headerActions}>
          <button
            className={styles.actionButton}
            onClick={() => reactFlowInstance.current?.fitView()}
            title="Fit View"
          >
            <FiZoomIn />
          </button>
          
          {onToggleFullscreen && (
            <button
              className={styles.actionButton}
              onClick={onToggleFullscreen}
              title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            >
              {isFullscreen ? <FiMinimize2 /> : <FiMaximize2 />}
            </button>
          )}
          
          {onClose && (
            <button
              className={styles.actionButton}
              onClick={onClose}
              title="Close Mind Map"
            >
              <FiX />
            </button>
          )}
        </div>
      </div>

      {/* React Flow Canvas */}
      <div className={styles.flowContainer}>
        <ReactFlow
          key={`${selectedItem?.id || selectedItem?.title || 'default'}-${pageType}-${nodes.length}`}
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          fitView
          attributionPosition="bottom-left"
          proOptions={{ hideAttribution: true }}
          nodeTypes={nodeTypes}
          onInit={(reactFlow) => (reactFlowInstance.current = reactFlow)}
          onNodeClick={onNodeClick}
          onPaneContextMenu={onPaneContextMenu}
          onNodeContextMenu={onNodeContextMenu}
          onClick={onPaneClick}
        >
          <Background color="var(--color-surface-hover)" gap={20} />
          <Controls />
          <MiniMap />
          
          {/* Layout Control Panel */}
          <Panel position="top-right" className={styles.layoutPanel}>
            <div className={styles.layoutControls}>
              <button
                className={styles.layoutButton}
                onClick={() => onLayout('TB')}
                title="Vertical Layout (Top to Bottom)"
              >
                <FiLayers />
                <span>Vertical</span>
              </button>
              <button
                className={styles.layoutButton}
                onClick={() => onLayout('LR')}
                title="Horizontal Layout (Left to Right)"
              >
                <FiGrid />
                <span>Horizontal</span>
              </button>
            </div>
          </Panel>
          
          {/* Debug Modal State */}
          <Panel position="top-left" className={styles.layoutPanel}>
            <div style={{ fontSize: '12px', color: 'red' }}>
                      Modal State: {masteryCriterionModal.isOpen ? 'OPEN' : 'CLOSED'}
        {masteryCriterionModal.editMode && ' (EDIT MODE)'}
            </div>
          </Panel>
        </ReactFlow>
      </div>

      {/* Legend */}
      <div className={styles.legend}>
        <div className={styles.legendItem}>
          <div className={`${styles.legendColor} ${styles.blueprint}`}></div>
          <span>Blueprint</span>
        </div>
        <div className={styles.legendItem}>
          <div className={`${styles.legendColor} ${styles.section}`}></div>
          <span>Section</span>
        </div>
        <div className={styles.legendItem}>
          <div className={`${styles.legendColor} ${styles.ideaspace}`}></div>
          <span>Ideaspace</span>
        </div>
        <div className={styles.legendItem}>
          <div className={`${styles.legendColor} ${styles.primitive}`}></div>
          <span>Knowledge Primitive</span>
        </div>
        <div className={styles.legendItem}>
          <div className={`${styles.legendColor} ${styles.criterion}`}></div>
          <span>Mastery Criterion</span>
        </div>
        
        <div className={styles.legendItem}>
          <div className={styles.legendColor} style={{ backgroundColor: 'white', border: '2px solid #dc2626' }}></div>
          <span>Mastered Criterion</span>
        </div>
        
        <div className={styles.legendItem}>
          <div className={styles.legendColor} style={{ backgroundColor: 'white', border: '2px solid #6b7280' }}></div>
          <span>Unmastered Criterion</span>
        </div>
        <div className={styles.legendItem}>
          <div className={`${styles.legendColor} ${styles.question}`}></div>
          <span>Question</span>
        </div>
        <div className={styles.legendItem}>
          <div className={styles.legendColor} style={{ backgroundColor: '#51cf66' }}></div>
          <span>Mastered Prerequisites</span>
        </div>
        <div className={styles.legendItem}>
          <div className={styles.legendColor} style={{ backgroundColor: '#ff6b6b' }}></div>
          <span>Unmastered Prerequisites</span>
        </div>
      </div>

      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          onClose={() => setContextMenu(null)}
                  onAddMasteryCriterion={handleAddMasteryCriterion}
        onAddPathway={handleAddPathway}
        onAddSection={handleAddSection}
          parentNode={contextMenu.parentNode}
        />
      )}

              {/* Mastery Criterion Creation/Edit Modal */}
        {masteryCriterionModal.isOpen && (
        <MasteryCriterionModal
                      isOpen={masteryCriterionModal.isOpen}
            onClose={() => setMasteryCriterionModal({ ...masteryCriterionModal, isOpen: false })}
                      onSave={(criterionData) => {
                          if (masteryCriterionModal.editMode && masteryCriterionModal.editNodeId) {
              // Update existing node
              setNodes(prevNodes => 
                prevNodes.map(node => 
                                      node.id === masteryCriterionModal.editNodeId 
                    ? { ...node, data: { ...node.data, ...criterionData } }
                    : node
                )
              );
            } else {
              // Create new node
              const newNodeId = `node-${Date.now()}`;
              const newNode = {
                id: newNodeId,
                type: 'custom',
                position: { x: 100, y: 100 },
                data: {
                  ...criterionData,
                  id: newNodeId,
                                      type: 'criterion'
                }
              };
              
              // Add new node
              setNodes(prevNodes => [...prevNodes, newNode]);
              
              // Add edge if there's a parent
                              if (masteryCriterionModal.parentId) {
                const newEdge = {
                                      id: `edge-${masteryCriterionModal.parentId}-${newNodeId}`,
                    source: masteryCriterionModal.parentId,
                  target: newNodeId,
                  type: 'smoothstep'
                };
                setEdges(prevEdges => [...prevEdges, newEdge]);
              }
            }
            
            // Close modal
                            setMasteryCriterionModal({ ...masteryCriterionModal, isOpen: false });
          }}
                      parentNode={masteryCriterionModal.parentId ? nodes.find(n => n.id === masteryCriterionModal.parentId) : undefined}
            editMode={masteryCriterionModal.editMode}
            editData={masteryCriterionModal.editData}
        />
      )}

      {/* Quick Review Modal */}
      {reviewModal.isOpen && reviewModal.criterion && reviewModal.questions && reviewModal.masteryTracking && (
        <MasteryReviewModal
          isOpen={reviewModal.isOpen}
          onClose={() => setReviewModal({ isOpen: false })}
          onComplete={(trackingId, wasCorrect, performance) => {
            // TODO: integrate with mastery tracking update service
            console.debug('[MindMapView] Review complete:', { trackingId, wasCorrect, performance });
            setReviewModal({ isOpen: false });
          }}
          masteryTracking={reviewModal.masteryTracking}
          criterion={reviewModal.criterion}
          questions={reviewModal.questions}
        />
      )}
    </div>
  );
};

// Wrapper component to provide ReactFlow context
const MindMapViewWithProvider: React.FC<MindMapViewProps> = (props) => {
  return (
    <ReactFlowProvider>
      <MindMapView {...props} />
    </ReactFlowProvider>
  );
};

export default MindMapViewWithProvider;









