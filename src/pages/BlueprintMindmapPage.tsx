import { useParams } from 'react-router-dom';
import MindMapView from '../components/mindmap/MindMapView';

export default function BlueprintMindmapPage() {
  const { blueprintId } = useParams();

  if (!blueprintId) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <p>No blueprint ID provided</p>
      </div>
    );
  }

  return (
    <MindMapView 
      blueprintId={blueprintId}
      className="blueprint-mindmap-page"
    />
  );
}


