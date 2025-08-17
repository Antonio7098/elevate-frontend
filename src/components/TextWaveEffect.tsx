import React, { useRef, useEffect, useState } from 'react';
import styles from './TextWaveEffect.module.css';

interface TextWaveEffectProps {
  text: string;
  className?: string;
  speed?: number; // Animation speed in milliseconds
  color?: string; // Wave color
  effect?: 'clip' | 'gradient' | 'blur'; // Different wave effects
  direction?: 'left-to-right' | 'right-to-left' | 'center-out'; // Wave direction
  barWidth?: number; // Width of the moving color bar (in percentage)
}

export default function TextWaveEffect({ 
  text, 
  className = '', 
  speed = 2000, // Increased from 800 to slow down the animation
  color = '#C0C0C0', // Changed from #007bff to silver
  effect = 'clip',
  direction = 'left-to-right',
  barWidth = 20 // Default bar width of 20%
}: TextWaveEffectProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [wavePosition, setWavePosition] = useState(0);

  // Debug logging
  console.log('TextWaveEffect rendering with:', { text, color, effect, speed });

  useEffect(() => {
    // Always animate, not just on hover
    const startTime = Date.now();
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = (elapsed % speed) / speed; // Use modulo to create infinite loop
      
      setWavePosition(progress);
      requestAnimationFrame(animate); // Always continue animating
    };

    requestAnimationFrame(animate);
  }, [speed]);

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
        // Create a moving bar effect - a rectangle that moves across the text
        const barStart = wavePosition * (100 + barWidth) - barWidth;
        const barEnd = wavePosition * (100 + barWidth);
        
        return {
          ...baseStyle,
          clipPath: `inset(0 ${100 - barEnd}% 0 ${100 - barStart}%)`,
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
      style={{
        '--wave-color': color,
        border: '3px solid red', // Very obvious debug border
        padding: '8px',
        display: 'inline-block',
        backgroundColor: 'lightblue', // Debug background
        position: 'relative', // Ensure positioning works
        minHeight: '1.5em' // Ensure minimum height
      } as React.CSSProperties}
    >
      {/* Original text */}
      <span className={styles['text-original']} style={{ color: 'black', zIndex: 1 }}>
        {text}
      </span>
      
      {/* Wave overlay */}
      <span 
        className={`${styles['text-wave']} ${effect === 'gradient' ? styles['text-wave-gradient'] : ''}`}
        style={{
          ...getWaveStyle(),
          color: color,
          zIndex: 2
        }}
      >
        {text}
      </span>
    </div>
  );
}
