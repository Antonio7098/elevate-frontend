import React, { useState } from 'react';
import { FiFile, FiEdit, FiPlus, FiCheck, FiX, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import styles from './ActionBox.module.css';

export type ActionType = 'create' | 'edit' | 'delete';

interface ActionBoxProps {
  actionType: ActionType;
  title: string;
  description: string;
  fileName?: string;
  changes?: string;
  onAccept: () => void;
  onReject: () => void;
  isExpanded?: boolean;
}

const ActionBox: React.FC<ActionBoxProps> = ({
  actionType,
  title,
  description,
  fileName,
  changes,
  onAccept,
  onReject,
  isExpanded = false
}) => {
  const [expanded, setExpanded] = useState(isExpanded);
  const [status, setStatus] = useState<'pending' | 'accepted' | 'rejected'>('pending');

  const getActionIcon = () => {
    switch (actionType) {
      case 'create':
        return <FiPlus className={styles.actionIcon} />;
      case 'edit':
        return <FiEdit className={styles.actionIcon} />;
      case 'delete':
        return <FiX className={styles.actionIcon} />;
      default:
        return <FiFile className={styles.actionIcon} />;
    }
  };

  const getActionColor = () => {
    switch (actionType) {
      case 'create':
        return 'create';
      case 'edit':
        return 'edit';
      case 'delete':
        return 'delete';
      default:
        return 'edit';
    }
  };

  const handleAccept = () => {
    setStatus('accepted');
    onAccept();
  };

  const handleReject = () => {
    setStatus('rejected');
    onReject();
  };

  return (
    <div className={`${styles.actionBox} ${styles[getActionColor()]} ${styles[status]}`}>
      <div className={styles.header} onClick={() => setExpanded(!expanded)}>
        <div className={styles.headerLeft}>
          {getActionIcon()}
          <div className={styles.headerText}>
            <h4 className={styles.title}>{title}</h4>
            {fileName && <span className={styles.fileName}>{fileName}</span>}
          </div>
        </div>
        <div className={styles.headerRight}>
          {status === 'pending' && (
            <>
              <button 
                className={`${styles.actionButton} ${styles.rejectButton}`}
                onClick={(e) => { e.stopPropagation(); handleReject(); }}
                title="Reject"
              >
                <FiX size={16} />
              </button>
              <button 
                className={`${styles.actionButton} ${styles.acceptButton}`}
                onClick={(e) => { e.stopPropagation(); handleAccept(); }}
                title="Accept"
              >
                <FiCheck size={16} />
              </button>
            </>
          )}
          {status === 'accepted' && (
            <span className={styles.statusBadge}>
              <FiCheck size={14} /> Accepted
            </span>
          )}
          {status === 'rejected' && (
            <span className={styles.statusBadge}>
              <FiX size={14} /> Rejected
            </span>
          )}
          <button className={styles.expandButton}>
            {expanded ? <FiChevronUp size={16} /> : <FiChevronDown size={16} />}
          </button>
        </div>
      </div>
      
      <div className={styles.description}>
        {description}
      </div>

      {expanded && changes && (
        <div className={styles.changes}>
          <h5 className={styles.changesTitle}>Changes:</h5>
          <pre className={styles.changesContent}>{changes}</pre>
        </div>
      )}
    </div>
  );
};

export default ActionBox;
