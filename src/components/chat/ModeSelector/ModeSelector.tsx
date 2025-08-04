
import React, { useState, useRef, useEffect } from 'react';
import styles from './ModeSelector.module.css';

export type Mode = 'quiz' | 'test' | 'walkthrough';

interface ModeSelectorProps {
  onModeChange: (mode: Mode) => void;
  initialMode?: Mode;
}

const ModeSelector: React.FC<ModeSelectorProps> = ({ onModeChange, initialMode = 'quiz' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedMode, setSelectedMode] = useState<Mode>(initialMode);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [wrapperRef]);

  const handleModeSelect = (mode: Mode) => {
    setSelectedMode(mode);
    onModeChange(mode);
    setIsOpen(false);
  };

  const modeOptions: { key: Mode, label: string, letter: string }[] = [
    { key: 'quiz', label: 'Quiz', letter: 'Q' },
    { key: 'test', label: 'Test', letter: 'T' },
    { key: 'walkthrough', label: 'Walkthrough', letter: 'W' },
  ];

  const currentMode = modeOptions.find(option => option.key === selectedMode);

  return (
    <div className={styles.modeSelector} ref={wrapperRef}>
      <button className={styles.modeButton} onClick={() => setIsOpen(!isOpen)}>
        <span className={styles.modeText}>{currentMode?.label}</span>
        <span className={styles.arrow}>{isOpen ? '▲' : '▼'}</span>
      </button>
      {isOpen && (
        <div className={styles.popup}>
          {modeOptions.map((option) => (
            <div
              key={option.key}
              className={`${styles.option} ${selectedMode === option.key ? styles.selected : ''}`}
              onClick={() => handleModeSelect(option.key)}
            >
              <span className={styles.optionLabel}>{option.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ModeSelector;

