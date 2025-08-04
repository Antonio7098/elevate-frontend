
import React, { useState } from 'react';
import styles from './AdvancedSettings.module.css';
import { FiFolder, FiBook, FiPlus, FiX } from 'react-icons/fi';
import type { Folder } from '../../types/folder';
import type { QuestionSet } from '../../types/questionSet';

type ContextItem = {
  id: string;
  type: 'folder' | 'questionSet';
  name: string;
};

interface AdvancedSettingsProps {
  isOpen: boolean;
  onClose: () => void;
  folders: Folder[];
  questionSets: QuestionSet[];
  selectedContextItems: ContextItem[];
  onContextItemsChange: (items: ContextItem[]) => void;
}

const AdvancedSettings: React.FC<AdvancedSettingsProps> = ({ 
  isOpen, 
  onClose, 
  folders = [], 
  questionSets = [], 
  selectedContextItems = [],
  onContextItemsChange 
}) => {
  const [selectedFolderId, setSelectedFolderId] = useState('');
  const [selectedQuestionSetId, setSelectedQuestionSetId] = useState('');

  const handleAddFolder = () => {
    if (selectedFolderId) {
      const folder = folders.find(f => f.id === selectedFolderId);
      if (folder && !selectedContextItems.some(item => item.id === selectedFolderId && item.type === 'folder')) {
        const newItem: ContextItem = {
          id: selectedFolderId,
          type: 'folder',
          name: folder.name
        };
        onContextItemsChange([...selectedContextItems, newItem]);
        setSelectedFolderId('');
      }
    }
  };

  const handleAddQuestionSet = () => {
    if (selectedQuestionSetId) {
      const questionSet = questionSets.find(qs => qs.id === selectedQuestionSetId);
      if (questionSet && !selectedContextItems.some(item => item.id === selectedQuestionSetId && item.type === 'questionSet')) {
        const newItem: ContextItem = {
          id: selectedQuestionSetId,
          type: 'questionSet',
          name: questionSet.name
        };
        onContextItemsChange([...selectedContextItems, newItem]);
        setSelectedQuestionSetId('');
      }
    }
  };

  const handleRemoveItem = (id: string) => {
    onContextItemsChange(selectedContextItems.filter(item => item.id !== id));
  };

  return (
    <div className={`${styles.settingsPanel} ${isOpen ? styles.open : ''}`}>
      <div className={styles.header}>
        <h3>Advanced Settings</h3>
        <button onClick={onClose} className={styles.closeButton}>&times;</button>
      </div>
      <div className={styles.content}>
        <div className={styles.section}>
          <h4>Context Selection</h4>
          
          <div className={styles.inputGroup}>
            <label>Folder</label>
            <div className={styles.inputWithButton}>
              <select
                value={selectedFolderId}
                onChange={(e) => setSelectedFolderId(e.target.value)}
              >
                <option value="">Select a Folder</option>
                {folders.map(folder => (
                  <option key={folder.id} value={folder.id}>
                    {folder.name}
                  </option>
                ))}
              </select>
              <button onClick={handleAddFolder} className={styles.addButton}>
                <FiPlus size={16} />
              </button>
            </div>
          </div>
          
          <div className={styles.inputGroup}>
            <label>Question Set</label>
            <div className={styles.inputWithButton}>
              <select
                value={selectedQuestionSetId}
                onChange={(e) => setSelectedQuestionSetId(e.target.value)}
              >
                <option value="">Select a Question Set</option>
                {questionSets.map(qs => (
                  <option key={qs.id} value={qs.id}>
                    {qs.name}
                  </option>
                ))}
              </select>
              <button onClick={handleAddQuestionSet} className={styles.addButton}>
                <FiPlus size={16} />
              </button>
            </div>
          </div>
          
          <div className={styles.selectedItems}>
            <h5>Selected Context Items</h5>
            {selectedContextItems.length === 0 ? (
              <p className={styles.noItems}>No items selected</p>
            ) : (
              <ul className={styles.itemsList}>
                {selectedContextItems.map((item) => (
                  <li key={item.id} className={styles.item}>
                    {item.type === 'folder' ? <FiFolder size={16} /> : <FiBook size={16} />}
                    <span className={styles.itemName}>{item.name}</span>
                    <button 
                      onClick={() => handleRemoveItem(item.id)}
                      className={styles.removeItemButton}
                    >
                      <FiX size={16} />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedSettings;
