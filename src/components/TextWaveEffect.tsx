import React, { useRef, useEffect, useState } from 'react';
import styles from './TextWaveEffect.module.css';

interface TextWaveEffectProps {
  text: string;
  className?: string;
  speed?: number; // Animation speed in milliseconds
  color?: string; // Wave color
  effect?: 'clip' | 'gradient' | 'blur'; // Different wave effects
  direction?: 'left-to-right' | 'right-to-left' | 'center-out'; // Wave direction
}

export default function TextWaveEffect({ 
  text, 
  className = '', 
  speed = 800,
  color = '#007bff',
  effect = 'clip',
  direction = 'left-to-right'
}: TextWaveEffectProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [wavePosition, setWavePosition] = useState(0);

  useEffect(() => {
    if (!isHovered) {
      setWavePosition(0);
      return;
    }

    const startTime = Date.now();
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / speed, 1);
      
      setWavePosition(progress);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [isHovered, speed]);

  const getWaveStyle = () => {
    const baseStyle = {
      position: 'absolute' as const,
      top: 0,
      left: 0,
      color: color,
      pointerEvents: 'none' as const,
      willChange: 'clip-path' as const,
    };

    switch (effect) {
      case 'clip':
        return {
          ...baseStyle,
          clipPath: `inset(0 ${100 - (wavePosition * 100)}% 0 0)`,
          transition: 'clip-path 0.1s ease-out',
        };
      
      case 'gradient':
        return {
          ...baseStyle,
          background: `linear-gradient(90deg, transparent 0%, ${color} 50%, transparent 100%)`,
          backgroundSize: '200% 100%',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundPosition: `${-200 + (wavePosition * 400)}% 0`,
          transition: 'background-position 0.1s ease-out',
        };
      
      case 'blur':
        return {
          ...baseStyle,
          filter: `blur(${wavePosition * 2}px)`,
          transform: `scale(${1 + wavePosition * 0.02})`,
          transition: 'all 0.1s ease-out',
        };
      
      default:
        return baseStyle;
    }
  };

  return (
    <div
      ref={containerRef}
      className={`${styles['text-wave-container']} ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        '--wave-color': color,
      } as React.CSSProperties}
    >
      {/* Original text */}
      <span className={styles['text-original']}>
        {text}
      </span>
      
      {/* Wave overlay */}
      <span 
        className={`${styles['text-wave']} ${effect === 'gradient' ? styles['text-wave-gradient'] : ''}`}
        style={getWaveStyle()}
      >
        {text}
      </span>
    </div>
  );
}
