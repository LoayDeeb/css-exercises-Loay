import React from 'react';
import styled, { css, keyframes } from 'styled-components';
import { motion } from 'framer-motion';
import theme from '../../theme';

const flicker = keyframes`
  0%, 100% { transform: scale(1); opacity: 1; }
  25% { transform: scale(1.05) rotate(-2deg); opacity: 0.9; }
  50% { transform: scale(0.97) rotate(1deg); opacity: 1; }
  75% { transform: scale(1.03) rotate(-1deg); opacity: 0.95; }
`;

const pulse = keyframes`
  0%, 100% { text-shadow: 0 0 4px rgba(255, 100, 0, 0.4); }
  50% { text-shadow: 0 0 12px rgba(255, 100, 0, 0.7), 0 0 20px rgba(255, 50, 0, 0.3); }
`;

const sparkle = keyframes`
  0% { transform: translateY(0) scale(1); opacity: 0.8; }
  50% { transform: translateY(-8px) scale(0.6); opacity: 0; }
  100% { transform: translateY(-12px) scale(0.3); opacity: 0; }
`;

const BadgeContainer = styled.div`
  display: inline-flex;
  align-items: center;
  gap: ${theme.spacing.xs};
  padding: 4px 12px;
  border-radius: ${theme.borderRadius.medium};
  background:
    linear-gradient(
      135deg,
      rgba(45, 27, 14, 0.9) 0%,
      rgba(74, 55, 40, 0.85) 100%
    );
  border: 1px solid rgba(212, 175, 55, 0.35);
  position: relative;
  overflow: visible;

  ${({ $intensity }) =>
    $intensity >= 2 &&
    css`
      border-color: rgba(255, 165, 0, 0.5);
      box-shadow: 0 0 8px rgba(255, 100, 0, 0.2);
    `}

  ${({ $intensity }) =>
    $intensity >= 3 &&
    css`
      border-color: rgba(255, 200, 50, 0.6);
      box-shadow:
        0 0 12px rgba(255, 100, 0, 0.3),
        0 0 24px rgba(255, 50, 0, 0.15);
    `}
`;

const FireEmoji = styled.span`
  font-size: ${({ $intensity }) => {
    if ($intensity >= 3) return '1.6em';
    if ($intensity >= 2) return '1.35em';
    return '1.1em';
  }};
  display: inline-block;
  animation: ${flicker} ${({ $intensity }) => ($intensity >= 2 ? '0.8s' : '1.2s')} ease-in-out infinite;
  line-height: 1;
  filter: ${({ $intensity }) =>
    $intensity >= 3
      ? 'saturate(1.3) brightness(1.2)'
      : $intensity >= 2
        ? 'saturate(1.1) brightness(1.1)'
        : 'none'};
`;

const DayCount = styled.span`
  font-family: ${theme.fonts.handwritten};
  font-size: 1.2em;
  font-weight: 700;
  color: ${({ $intensity }) => {
    if ($intensity >= 3) return theme.colors.goldBright;
    if ($intensity >= 2) return theme.colors.gold;
    return theme.colors.parchment;
  }};
  animation: ${({ $intensity }) =>
    $intensity >= 2
      ? css`${pulse} 2s ease-in-out infinite`
      : 'none'};
  line-height: 1;
`;

const DayLabel = styled.span`
  font-family: ${theme.fonts.display};
  font-size: 0.65em;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: ${theme.colors.parchmentDark};
  opacity: 0.8;
  line-height: 1;
`;

const ParticleContainer = styled.div`
  position: absolute;
  top: 0;
  left: 8px;
  width: 20px;
  height: 20px;
  pointer-events: none;
`;

const SparkParticle = styled.div`
  position: absolute;
  width: 3px;
  height: 3px;
  border-radius: 50%;
  background: ${({ $color }) => $color};
  animation: ${sparkle} ${({ $duration }) => $duration}s ease-out infinite;
  animation-delay: ${({ $delay }) => $delay}s;
  left: ${({ $left }) => $left}px;
  top: ${({ $top }) => $top}px;
  opacity: 0;
`;

const SPARK_COLORS = [
  'rgba(255, 200, 50, 0.9)',
  'rgba(255, 140, 0, 0.8)',
  'rgba(255, 80, 0, 0.7)',
  'rgba(255, 220, 100, 0.85)',
];

const StreakBadge = ({ days = 0 }) => {
  // intensity: 1 = normal, 2 = 7+ days, 3 = 30+ days
  const intensity = days >= 30 ? 3 : days >= 7 ? 2 : 1;

  const sparks = intensity >= 3
    ? Array.from({ length: 6 }, (_, i) => ({
        id: i,
        color: SPARK_COLORS[i % SPARK_COLORS.length],
        duration: 1 + Math.random() * 0.8,
        delay: Math.random() * 1.5,
        left: Math.random() * 16,
        top: Math.random() * 8,
      }))
    : [];

  return (
    <BadgeContainer $intensity={intensity}>
      {intensity >= 3 && (
        <ParticleContainer>
          {sparks.map((s) => (
            <SparkParticle
              key={s.id}
              $color={s.color}
              $duration={s.duration}
              $delay={s.delay}
              $left={s.left}
              $top={s.top}
            />
          ))}
        </ParticleContainer>
      )}
      <FireEmoji $intensity={intensity} role="img" aria-label="fire">
        🔥
      </FireEmoji>
      <DayLabel>Day</DayLabel>
      <DayCount $intensity={intensity}>{days}</DayCount>
    </BadgeContainer>
  );
};

export default StreakBadge;
