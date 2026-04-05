import styled, { keyframes } from 'styled-components';
import theme from '../../theme';

const pulseGlow = keyframes`
  0%, 100% { box-shadow: 0 0 8px rgba(139, 37, 0, 0.3); }
  50% { box-shadow: 0 0 16px rgba(139, 37, 0, 0.5); }
`;

const CATEGORY_COLORS = {
  health: '#8b2500',
  intelligence: '#1a1a3e',
  money: '#b8860b',
  relationships: '#6b3a6b',
};

const CATEGORY_ICONS = {
  health: '❤️',
  intelligence: '📖',
  money: '💰',
  relationships: '💍',
};

const SealWrapper = styled.div`
  width: ${({ $size }) => $size || 40}px;
  height: ${({ $size }) => $size || 40}px;
  border-radius: 50%;
  background: ${({ $color }) => `radial-gradient(circle at 35% 35%, ${$color}ee, ${$color})`};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${({ $size }) => ($size || 40) * 0.4}px;
  box-shadow:
    0 2px 4px rgba(0, 0, 0, 0.3),
    inset 0 -2px 4px rgba(0, 0, 0, 0.2),
    inset 0 2px 4px rgba(255, 255, 255, 0.1);
  position: relative;
  flex-shrink: 0;
  ${({ $urgent }) => $urgent && `animation: ${pulseGlow} 1.5s ease-in-out infinite;`}

  &::after {
    content: '';
    position: absolute;
    inset: 3px;
    border-radius: 50%;
    border: 1px solid rgba(255, 255, 255, 0.1);
  }
`;

const UrgentBanner = styled.div`
  position: absolute;
  top: -6px;
  right: -10px;
  font-family: ${theme.fonts.display};
  font-size: 0.45rem;
  color: #fff;
  background: #cc0000;
  padding: 1px 4px;
  border-radius: 2px;
  letter-spacing: 1px;
  text-transform: uppercase;
  font-weight: 700;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
  white-space: nowrap;
`;

export default function WaxSeal({ category, urgent, size }) {
  const color = CATEGORY_COLORS[category] || theme.colors.redInk;
  const icon = CATEGORY_ICONS[category] || '📜';

  return (
    <SealWrapper $color={color} $size={size} $urgent={urgent}>
      {icon}
      {urgent && <UrgentBanner>Urgent</UrgentBanner>}
    </SealWrapper>
  );
}
