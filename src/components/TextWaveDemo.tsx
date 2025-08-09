import React from 'react';
import TextWaveEffect from './TextWaveEffect';

export default function TextWaveDemo() {
  return (
    <div style={{ padding: '2rem', fontFamily: 'system-ui, sans-serif' }}>
      <h1 style={{ marginBottom: '2rem', color: '#333' }}>
        Text Wave Effect Demo
      </h1>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {/* Clip Effect */}
        <section>
          <h2>Clip Effect (Default)</h2>
          <p style={{ fontSize: '1.2rem', lineHeight: 1.6 }}>
            This is a <TextWaveEffect text="beautiful wave effect" color="#007bff" /> 
            that reveals text with a smooth animation. Hover over the text to see the magic!
          </p>
        </section>

        {/* Gradient Effect */}
        <section>
          <h2>Gradient Effect</h2>
          <p style={{ fontSize: '1.2rem', lineHeight: 1.6 }}>
            Try this <TextWaveEffect 
              text="gradient wave effect" 
              effect="gradient" 
              color="#ff6b6b" 
              speed={600}
            /> 
            with a different color and speed!
          </p>
        </section>

        {/* Blur Effect */}
        <section>
          <h2>Blur Effect</h2>
          <p style={{ fontSize: '1.2rem', lineHeight: 1.6 }}>
            This <TextWaveEffect 
              text="blur wave effect" 
              effect="blur" 
              color="#4ecdc4" 
              speed={1000}
            /> 
            creates a dreamy, blurred animation.
          </p>
        </section>

        {/* Different Colors */}
        <section>
          <h2>Color Variations</h2>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <TextWaveEffect text="Red" color="#ff4757" />
            <TextWaveEffect text="Green" color="#2ed573" />
            <TextWaveEffect text="Blue" color="#3742fa" />
            <TextWaveEffect text="Purple" color="#5f27cd" />
            <TextWaveEffect text="Orange" color="#ff9f43" />
          </div>
        </section>

        {/* Large Text */}
        <section>
          <h2>Large Text</h2>
          <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>
            <TextWaveEffect 
              text="BIG WAVE EFFECT" 
              color="#ff6b6b" 
              speed={1200}
            />
          </div>
        </section>

        {/* Interactive Elements */}
        <section>
          <h2>Interactive Elements</h2>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <button style={{ 
              padding: '0.5rem 1rem', 
              border: 'none', 
              borderRadius: '4px',
              background: '#f8f9fa',
              cursor: 'pointer'
            }}>
              <TextWaveEffect text="Button" color="#007bff" />
            </button>
            
            <a href="#" style={{ 
              textDecoration: 'none', 
              color: '#333',
              padding: '0.5rem 1rem',
              border: '1px solid #ddd',
              borderRadius: '4px'
            }}>
              <TextWaveEffect text="Link" color="#28a745" />
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}

