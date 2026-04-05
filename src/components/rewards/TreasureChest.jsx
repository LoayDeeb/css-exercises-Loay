import { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import theme from '../../theme';

const TIER_COLORS = {
  common: '#8B8B8B',
  uncommon: '#2ecc71',
  rare: '#3498db',
  epic: '#9b59b6',
  legendary: '#f39c12',
};

const shake = keyframes`
  0%, 100% { transform: rotate(0deg); }
  25% { transform: rotate(-3deg); }
  75% { transform: rotate(3deg); }
`;

const glow = keyframes`
  0%, 100% { filter: drop-shadow(0 0 10px var(--glow-color)); }
  50% { filter: drop-shadow(0 0 25px var(--glow-color)); }
`;

const sparkle = keyframes`
  0% { transform: translateY(0) scale(1); opacity: 1; }
  100% { transform: translateY(-80px) scale(0); opacity: 0; }
`;

const Overlay = styled(motion.div)`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 1500;
`;

const ChestContainer = styled(motion.div)`
  position: relative;
  cursor: ${({ $opened }) => $opened ? 'default' : 'pointer'};
`;

const Chest = styled.div`
  font-size: ${({ $noReward }) => $noReward ? '80px' : '120px'};
  animation: ${({ $shaking }) => $shaking ? shake : 'none'} 0.3s ease-in-out infinite;
  --glow-color: ${({ $tierColor }) => $tierColor};
  animation: ${({ $shaking, $tierColor }) => $shaking ? shake : glow} ${({ $shaking }) => $shaking ? '0.3s' : '2s'} ease-in-out infinite;
  text-align: center;

  @media (max-width: 768px) {
    font-size: ${({ $noReward }) => $noReward ? '60px' : '90px'};
  }
`;

const ParticleContainer = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  pointer-events: none;
`;

const Particle = styled.div`
  position: absolute;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${({ $color }) => $color};
  animation: ${sparkle} 1s ease-out forwards;
  animation-delay: ${({ $delay }) => $delay}s;
  transform-origin: center;
  left: ${({ $x }) => $x}px;
  box-shadow: 0 0 6px ${({ $color }) => $color};
`;

const Instruction = styled(motion.div)`
  font-family: ${theme.fonts.handwritten};
  font-size: 1.3rem;
  color: ${theme.colors.parchment};
  margin-top: 20px;
  opacity: 0.7;
`;

const TierBanner = styled(motion.div)`
  font-family: ${theme.fonts.display};
  font-size: 1.5rem;
  font-weight: 700;
  color: ${({ $color }) => $color};
  text-transform: uppercase;
  letter-spacing: 4px;
  margin-top: 24px;
  text-shadow: 0 0 10px ${({ $color }) => $color}88;

  @media (max-width: 768px) {
    font-size: 1.1rem;
  }
`;

const RewardName = styled(motion.div)`
  font-family: ${theme.fonts.display};
  font-size: 1.2rem;
  color: ${theme.colors.parchment};
  margin-top: 12px;
  text-align: center;
  max-width: 400px;

  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const NoRewardText = styled(motion.div)`
  font-family: ${theme.fonts.handwritten};
  font-size: 1.2rem;
  color: ${theme.colors.parchment};
  opacity: 0.7;
  margin-top: 16px;
  text-align: center;
  max-width: 350px;
  font-style: italic;
  line-height: 1.5;
`;

const ClaimButton = styled(motion.button)`
  margin-top: 30px;
  padding: 12px 40px;
  font-family: ${theme.fonts.display};
  font-size: 1rem;
  letter-spacing: 2px;
  text-transform: uppercase;
  border-radius: 4px;
  cursor: pointer;
  border: 2px solid ${({ $color }) => $color};
  background: linear-gradient(135deg, ${({ $color }) => $color}44, ${({ $color }) => $color}22);
  color: ${({ $color }) => $color};

  &:hover {
    background: linear-gradient(135deg, ${({ $color }) => $color}66, ${({ $color }) => $color}44);
    box-shadow: 0 0 20px ${({ $color }) => $color}44;
  }
`;

const particles = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  x: (Math.random() - 0.5) * 200,
  delay: Math.random() * 0.5,
}));

export default function TreasureChest({ reward, tier, onClaim }) {
  const [phase, setPhase] = useState('closed'); // closed, shaking, opening, revealed
  const noReward = !reward;
  const tierColor = noReward ? '#8B8B8B' : (TIER_COLORS[tier] || TIER_COLORS.common);

  useEffect(() => {
    if (phase === 'shaking') {
      const timer = setTimeout(() => setPhase('opening'), 1500);
      return () => clearTimeout(timer);
    }
    if (phase === 'opening') {
      const timer = setTimeout(() => setPhase('revealed'), 500);
      return () => clearTimeout(timer);
    }
  }, [phase]);

  const handleClick = () => {
    if (phase === 'closed') setPhase('shaking');
  };

  const chestEmoji = () => {
    if (noReward) return phase === 'closed' ? '📦' : '📦';
    switch (phase) {
      case 'closed':
      case 'shaking':
        return '🎁';
      default:
        return '✨';
    }
  };

  return (
    <AnimatePresence>
      <Overlay
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <ChestContainer
          $opened={phase !== 'closed'}
          onClick={handleClick}
          whileHover={phase === 'closed' ? { scale: 1.05 } : {}}
        >
          <Chest
            $shaking={phase === 'shaking'}
            $tierColor={tierColor}
            $noReward={noReward}
          >
            {chestEmoji()}
          </Chest>

          {phase === 'opening' && (
            <ParticleContainer>
              {particles.map((p) => (
                <Particle key={p.id} $x={p.x} $delay={p.delay} $color={tierColor} />
              ))}
            </ParticleContainer>
          )}
        </ChestContainer>

        {phase === 'closed' && (
          <Instruction
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            transition={{ delay: 0.5 }}
          >
            Click to open your reward...
          </Instruction>
        )}

        {phase === 'revealed' && !noReward && (
          <>
            <TierBanner
              $color={tierColor}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {tier} Reward!
            </TierBanner>
            <RewardName
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              {reward.name}
            </RewardName>
            <ClaimButton
              $color={tierColor}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              onClick={onClaim}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Claim Reward
            </ClaimButton>
          </>
        )}

        {phase === 'revealed' && noReward && (
          <>
            <NoRewardText
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.7 }}
              transition={{ delay: 0.3 }}
            >
              The fates were not generous this time... but your XP is eternal.
            </NoRewardText>
            <ClaimButton
              $color="#8B8B8B"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              onClick={onClaim}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Continue
            </ClaimButton>
          </>
        )}
      </Overlay>
    </AnimatePresence>
  );
}
