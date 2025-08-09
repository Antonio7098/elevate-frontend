import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDebouncedCallback } from 'use-debounce';
import blueprintService from '../services/blueprintService';
import type { MindmapEdge, MindmapNode, MindmapPayload } from '../types/blueprint.types';

// Lazy import React Flow to avoid adding to initial bundle if not used elsewhere
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge
} from 'reactflow';
import type { Connection, EdgeChange, NodeChange } from 'reactflow';
import 'reactflow/dist/style.css';

export default function BlueprintMindmapPage() {
  const { blueprintId } = useParams();
  const [nodes, setNodes] = useState<MindmapNode[]>([]);
  const [edges, setEdges] = useState<MindmapEdge[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);
  const isDirtyRef = useRef(false);

  useEffect(() => {
    if (!blueprintId) return;
    let mounted = true;
    blueprintService
      .getBlueprintMindmap(blueprintId)
      .then((payload: MindmapPayload) => {
        if (!mounted) return;
        setNodes(payload.nodes);
        setEdges(payload.edges);
        setLoaded(true);
      })
      .catch((err) => {
        console.error('Failed to load mindmap', err);
        setLoaded(true);
      });
    return () => {
      mounted = false;
    };
  }, [blueprintId]);

  const onNodesChange = useCallback((changes: NodeChange[]) => {
    isDirtyRef.current = true;
    setNodes((nds) => applyNodeChanges(changes as any, nds as any) as any);
  }, []);

  const onEdgesChange = useCallback((changes: EdgeChange[]) => {
    isDirtyRef.current = true;
    setEdges((eds) => applyEdgeChanges(changes as any, eds as any) as any);
  }, []);

  const onConnect = useCallback((connection: Connection) => {
    isDirtyRef.current = true;
    setEdges((eds) => addEdge({ ...connection, type: 'default' } as any, eds as any) as any);
  }, []);

  const doSave = useCallback(async () => {
    if (!blueprintId || !isDirtyRef.current) return;
    setIsSaving(true);
    setSaveError(null);
    try {
      await blueprintService.updateBlueprintMindmap(blueprintId, {
        version: 1,
        nodes,
        edges,
      });
      isDirtyRef.current = false;
    } catch (e: any) {
      setSaveError(e?.message || 'Failed to save');
    } finally {
      setIsSaving(false);
    }
  }, [blueprintId, nodes, edges]);

  const debouncedSave = useDebouncedCallback(doSave, 1200);

  useEffect(() => {
    if (loaded) {
      debouncedSave();
    }
  }, [nodes, edges, loaded, debouncedSave]);

  const savingIndicator = useMemo(() => {
    if (isSaving) return 'Saving…';
    if (saveError) return `Save failed: ${saveError}`;
    if (isDirtyRef.current) return 'Unsaved changes';
    return 'All changes saved';
  }, [isSaving, saveError]);

  return (
    <div style={{ height: '100vh', width: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: 8, display: 'flex', gap: 8, alignItems: 'center', flexShrink: 0 }}>
        <strong>Blueprint Mind Map</strong>
        <span style={{ color: saveError ? 'crimson' : '#666' }}>{savingIndicator}</span>
        <div style={{ marginLeft: 'auto' }}>
          <button 
            onClick={doSave} 
            disabled={isSaving || !isDirtyRef.current}
            style={{
              padding: '8px 16px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              background: isSaving || !isDirtyRef.current ? '#f5f5f5' : '#007bff',
              color: isSaving || !isDirtyRef.current ? '#666' : 'white',
              cursor: isSaving || !isDirtyRef.current ? 'not-allowed' : 'pointer'
            }}
          >
            Save
          </button>
        </div>
      </div>

      <div style={{ flex: 1, width: '100%', height: '100%', position: 'relative' }}>
        {!loaded ? (
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            height: '100%',
            fontSize: '16px',
            color: '#666'
          }}>
            Loading mindmap...
          </div>
        ) : (
          <ReactFlow
            nodes={nodes as any}
            edges={edges as any}
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
        )}
      </div>
    </div>
  );
}


