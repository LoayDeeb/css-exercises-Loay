import React, { useMemo } from 'react';
import styled, { keyframes } from 'styled-components';
import theme from '../../theme';

const floatUp = keyframes`
  0% {
    transform: translateY(0) translateX(0) scale(1);
    opacity: 0;
  }
  10% {
    opacity: var(--particle-opacity);
  }
  90% {
    opacity: var(--particle-opacity);
  }
  100% {
    transform: translateY(-100vh) translateX(var(--drift-x)) scale(0.5);
    opacity: 0;
  }
`;

const shimmer = keyframes`
  0%, 100% {
    opacity: var(--particle-opacity);
  }
  50% {
    opacity: calc(var(--particle-opacity) * 0.5);
  }
`;

const ParticlesContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
  pointer-events: none;
  z-index: 1;
`;

const Particle = styled.div`
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
  will-change: transform, opacity;
  width: var(--particle-size);
  height: var(--particle-size);
  left: var(--particle-left);
  top: var(--particle-top);
  background: var(--particle-color);
  --particle-opacity: ${({ $opacity }) => $opacity};
  --drift-x: ${({ $driftX }) => $driftX}px;
  animation:
    ${floatUp} var(--particle-duration) linear infinite,
    ${shimmer} var(--shimmer-duration) ease-in-out infinite;
  animation-delay: var(--particle-delay);
  box-shadow: 0 0 var(--particle-glow) var(--particle-color);
`;

const PARTICLE_COLORS = [
  theme.colors.gold,
  theme.colors.goldBright,
  'rgba(212, 175, 55, 0.8)',
  'rgba(255, 215, 0, 0.7)',
  'rgba(244, 228, 188, 0.6)',
  'rgba(232, 213, 163, 0.5)',
];

const FloatingParticles = ({ count = 25 }) => {
  const particles = useMemo(() => {
    return Array.from({ length: count }, (_, i) => {
      const size = 2 + Math.random() * 4;
      const opacity = 0.1 + Math.random() * 0.3;
      const duration = 12 + Math.random() * 20;
      const shimmerDuration = 3 + Math.random() * 4;
      const delay = -(Math.random() * duration);
      const left = Math.random() * 100;
      const top = Math.random() * 100;
      const driftX = -40 + Math.random() * 80;
      const color = PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)];
      const glow = size * 1.5;

      return {
        id: i,
        style: {
          '--particle-size': `${size}px`,
          '--particle-left': `${left}%`,
          '--particle-top': `${top}%`,
          '--particle-color': color,
          '--particle-duration': `${duration}s`,
          '--shimmer-duration': `${shimmerDuration}s`,
          '--particle-delay': `${delay}s`,
          '--particle-glow': `${glow}px`,
        },
        opacity,
        driftX,
      };
    });
  }, [count]);

  return (
    <ParticlesContainer aria-hidden="true">
      {particles.map((p) => (
        <Particle
          key={p.id}
          style={p.style}
          $opacity={p.opacity}
          $driftX={p.driftX}
        />
      ))}
    </ParticlesContainer>
  );
};

export default FloatingParticles;
