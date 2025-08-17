import React from 'react';
import { FiEye, FiMap } from 'react-icons/fi';
import styles from './ViewModeToggle.module.css';

export type ViewMode = 'text' | 'mindmap';

interface ViewModeToggleProps {
  currentMode: ViewMode;
  onModeChange: (mode: ViewMode) => void;
  className?: string;
  disabled?: boolean;
  showLabels?: boolean;
}

const ViewModeToggle: React.FC<ViewModeToggleProps> = ({
  currentMode,
  onModeChange,
  className = '',
  disabled = false,
  showLabels = true
}) => {
  const handleModeChange = (mode: ViewMode) => {
    if (!disabled && mode !== currentMode) {
      onModeChange(mode);
    }
  };

  return (
    <div className={`${styles.viewModeToggle} ${className}`}>
      <button
        className={`${styles.toggleButton} ${currentMode === 'text' ? styles.active : ''} ${disabled ? styles.disabled : ''}`}
        onClick={() => handleModeChange('text')}
        disabled={disabled}
        title="Text View"
        aria-label="Switch to text view"
      >
        <FiEye className={styles.buttonIcon} />
        {showLabels && <span className={styles.buttonLabel}>Text</span>}
      </button>
      
      <button
        className={`${styles.toggleButton} ${currentMode === 'mindmap' ? styles.active : ''} ${disabled ? styles.disabled : ''}`}
        onClick={() => handleModeChange('mindmap')}
        disabled={disabled}
        title="Mind Map View"
        aria-label="Switch to mind map view"
      >
        <FiMap className={styles.buttonIcon} />
        {showLabels && <span className={styles.buttonLabel}>Mind Map</span>}
      </button>
    </div>
  );
};

export default ViewModeToggle;









