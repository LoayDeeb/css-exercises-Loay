import { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import theme from '../../theme';

const FLAVOUR_TEXTS = [
  "The ancient tomes speak of your growing power...",
  "Your legend spreads across the realm!",
  "The stars align in your favour, adventurer.",
  "Even the dragons whisper your name in reverence.",
  "A new chapter begins in your epic saga!",
  "The winds of destiny carry you ever higher.",
  "Your prowess knows no bounds!",
  "The realm trembles at your ascending might.",
  "Fate itself bows before your determination.",
  "A power long dormant stirs within you...",
];

const shimmer = keyframes`
  0% { background-position: -200% center; }
  100% { background-position: 200% center; }
`;

const pulse = keyframes`
  0%, 100% { opacity: 0.6; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.05); }
`;

const sparkle = keyframes`
  0% { transform: translateY(0) rotate(0deg); opacity: 1; }
  100% { transform: translateY(-100px) rotate(180deg); opacity: 0; }
`;

const Overlay = styled(motion.div)`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 2000;
`;

const ParticleField = styled.div`
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
`;

const Particle = styled.div`
  position: absolute;
  width: ${({ $size }) => $size}px;
  height: ${({ $size }) => $size}px;
  background: ${({ $color }) => $color};
  border-radius: 50%;
  left: ${({ $x }) => $x}%;
  bottom: -10px;
  animation: ${sparkle} ${({ $duration }) => $duration}s ease-out infinite;
  animation-delay: ${({ $delay }) => $delay}s;
  box-shadow: 0 0 ${({ $size }) => $size * 2}px ${({ $color }) => $color};
`;

const LevelText = styled(motion.div)`
  font-family: ${theme.fonts.display};
  font-size: 4rem;
  font-weight: 900;
  background: linear-gradient(
    90deg,
    ${theme.colors.gold},
    ${theme.colors.goldBright},
    ${theme.colors.gold},
    ${theme.colors.goldBright}
  );
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: ${shimmer} 2s linear infinite;
  text-shadow: none;
  filter: drop-shadow(0 0 20px rgba(212, 175, 55, 0.5));
  margin-bottom: 10px;

  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const LevelNumber = styled(motion.div)`
  font-family: ${theme.fonts.display};
  font-size: 6rem;
  font-weight: 900;
  color: ${theme.colors.goldBright};
  text-shadow: 0 0 30px rgba(255, 215, 0, 0.6);
  animation: ${pulse} 2s ease-in-out infinite;

  @media (max-width: 768px) {
    font-size: 4rem;
  }
`;

const StatBoost = styled(motion.div)`
  font-family: ${theme.fonts.display};
  font-size: 1rem;
  color: ${theme.colors.gold};
  letter-spacing: 2px;
  margin-top: 16px;
`;

const FlavourText = styled(motion.div)`
  font-family: ${theme.fonts.handwritten};
  font-size: 1.4rem;
  color: ${theme.colors.parchment};
  opacity: 0.8;
  margin-top: 20px;
  text-align: center;
  max-width: 400px;
  font-style: italic;

  @media (max-width: 768px) {
    font-size: 1.1rem;
  }
`;

const ContinueButton = styled(motion.button)`
  margin-top: 40px;
  padding: 12px 40px;
  font-family: ${theme.fonts.display};
  font-size: 1rem;
  color: ${theme.colors.darkBrown};
  background: linear-gradient(135deg, ${theme.colors.gold}, ${theme.colors.goldBright});
  border: 2px solid ${theme.colors.goldBright};
  border-radius: 4px;
  cursor: pointer;
  letter-spacing: 2px;
  text-transform: uppercase;

  &:hover {
    box-shadow: 0 0 20px rgba(255, 215, 0, 0.5);
  }
`;

const particles = Array.from({ length: 30 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  size: 3 + Math.random() * 6,
  duration: 1.5 + Math.random() * 2,
  delay: Math.random() * 2,
  color: ['#ffd700', '#d4af37', '#ffec8b', '#fff8dc'][Math.floor(Math.random() * 4)],
}));

export default function LevelUpOverlay({ level, talentPointGained, onDismiss }) {
  const [flavour] = useState(
    () => FLAVOUR_TEXTS[Math.floor(Math.random() * FLAVOUR_TEXTS.length)]
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      // Auto-dismiss after 10s if user doesn't click
    }, 10000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      <Overlay
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <ParticleField>
          {particles.map((p) => (
            <Particle
              key={p.id}
              $x={p.x}
              $size={p.size}
              $duration={p.duration}
              $delay={p.delay}
              $color={p.color}
            />
          ))}
        </ParticleField>

        <LevelText
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
        >
          LEVEL UP!
        </LevelText>

        <LevelNumber
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.6, type: 'spring', stiffness: 150 }}
        >
          {level}
        </LevelNumber>

        <StatBoost
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
        >
          +1 TO ALL STATS
        </StatBoost>

        {talentPointGained && (
          <StatBoost
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.3 }}
            style={{ color: theme.colors.goldBright }}
          >
            +1 TALENT POINT EARNED!
          </StatBoost>
        )}

        <FlavourText
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.8 }}
          transition={{ delay: 1.5 }}
        >
          {flavour}
        </FlavourText>

        <ContinueButton
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          onClick={onDismiss}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Continue
        </ContinueButton>
      </Overlay>
    </AnimatePresence>
  );
}
