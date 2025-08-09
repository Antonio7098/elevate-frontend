import React from 'react';
import type { InsightCatalyst } from '../../types/insightCatalyst.types';
import styles from './InsightCatalystDisplay.module.css';
import { RiSparkling2Fill, RiQuestionLine, RiLightbulbFlashLine, RiNodeTree, RiTodoLine } from 'react-icons/ri'; // Common icons, RiReflectFill replaced

interface InsightCatalystDisplayProps {
  catalyst: InsightCatalyst;
  onClick?: (catalystId: string) => void; // Optional click handler
}

const CatalystIcon: React.FC<{ type: InsightCatalyst['type'] }> = ({ type }) => {
  switch (type) {
    case 'question':
      return <RiQuestionLine className={styles.icon} />;
    case 'reflection':
      return <RiLightbulbFlashLine className={styles.icon} />; // Replaced RiReflectFill
    case 'connection':
      return <RiNodeTree className={styles.icon} />;
    case 'action':
      return <RiTodoLine className={styles.icon} />;
    case 'insight':
    default:
      return <RiSparkling2Fill className={styles.icon} />;
  }
};

const InsightCatalystDisplay: React.FC<InsightCatalystDisplayProps> = ({ catalyst, onClick }) => {
  const handleClick = () => {
    if (onClick) {
      onClick(catalyst.id);
    }
  };

  // Safely get text content with fallback
  const textContent = catalyst.text || 'No content available';
  const truncatedText = textContent.length > 50 ? textContent.substring(0, 50) + '...' : textContent;

  return (
    <div 
      className={`${styles.catalystDisplay} ${onClick ? styles.clickable : ''}`}
      onClick={handleClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => { if (e.key === 'Enter' || e.key === ' ') handleClick(); } : undefined}
      aria-label={`Insight Catalyst: ${catalyst.type} - ${truncatedText}`}
    >
      <CatalystIcon type={catalyst.type} />
      <div className={styles.content}>
        <span className={styles.typeLabel}>{catalyst.type.charAt(0).toUpperCase() + catalyst.type.slice(1)}:</span>
        <p className={styles.text}>{textContent}</p>
      </div>
    </div>
  );
};

export default InsightCatalystDisplay;
