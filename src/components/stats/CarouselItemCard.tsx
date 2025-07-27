import React from 'react';
import CircularProgress from './CircularProgress';
import { UUESegmentedProgressBar } from './SegmentedProgressBar';
import styles from './CarouselItemCard.module.css';

interface CarouselItemCardProps {
  name: string;
  masteryScore: number;
  understandScore: number;
  useScore: number;
  exploreScore: number;
  onClick: () => void;
}

const CarouselItemCard: React.FC<CarouselItemCardProps> = ({
  name,
  masteryScore,
  understandScore,
  useScore,
  exploreScore,
  onClick,
}) => {
  return (
    <div className="card" onClick={onClick} role="button" tabIndex={0}>
      <div className={styles.header}>
        <h3 className={styles.title}>{name}</h3>
        <CircularProgress
          percentage={masteryScore}
          size={60}
          strokeWidth={4}
        />
      </div>
      <div className={styles.scores}>
        <UUESegmentedProgressBar
          understandScore={understandScore}
          useScore={useScore}
          exploreScore={exploreScore}
          height={6}
          showLabels={true}
          showValues={false}
        />
      </div>
    </div>
  );
};

export default CarouselItemCard; 