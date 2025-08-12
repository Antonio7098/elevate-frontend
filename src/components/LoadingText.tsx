import React from 'react';
import TextWaveEffect from './TextWaveEffect';

interface LoadingTextProps {
  text?: string;
  className?: string;
  speed?: number;
  color?: string;
  effect?: 'clip' | 'gradient' | 'blur';
  direction?: 'left-to-right' | 'right-to-left' | 'center-out';
}

export default function LoadingText({ 
  text = 'Loading...',
  className = '',
  speed = 800,
  color = '#007bff',
  effect = 'clip',
  direction = 'left-to-right'
}: LoadingTextProps) {
  return (
    <TextWaveEffect
      text={text}
      className={className}
      speed={speed}
      color={color}
      effect={effect}
      direction={direction}
    />
  );
}
