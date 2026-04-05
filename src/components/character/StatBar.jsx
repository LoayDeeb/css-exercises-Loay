import styled from 'styled-components';
import { motion } from 'framer-motion';
import theme from '../../theme';

const BarContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
`;

const Icon = styled.span`
  font-size: 1.2rem;
  width: 24px;
  text-align: center;
`;

const StatName = styled.div`
  font-family: ${theme.fonts.display};
  font-size: 0.75rem;
  color: ${theme.colors.darkBrown};
  width: 70px;
  letter-spacing: 1px;
  text-transform: uppercase;
`;

const BarOuter = styled.div`
  flex: 1;
  height: 16px;
  background: rgba(74, 55, 40, 0.1);
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid rgba(74, 55, 40, 0.15);
  position: relative;
`;

const BarFill = styled(motion.div)`
  height: 100%;
  background: ${({ $color }) =>
    `linear-gradient(90deg, ${$color}cc, ${$color})`};
  border-radius: 8px;
  box-shadow: ${({ $color }) => `0 0 4px ${$color}44`};
  position: relative;

  &::after {
    content: '';
    position: absolute;
    top: 2px;
    left: 4px;
    right: 4px;
    height: 4px;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 2px;
  }
`;

const StatValue = styled.div`
  font-family: ${theme.fonts.display};
  font-size: 0.85rem;
  color: ${({ $color }) => $color};
  font-weight: 700;
  width: 32px;
  text-align: right;
`;

export default function StatBar({ name, icon, value, maxValue, color }) {
  const percentage = Math.min((value / maxValue) * 100, 100);

  return (
    <BarContainer>
      <Icon>{icon}</Icon>
      <StatName>{name}</StatName>
      <BarOuter>
        <BarFill
          $color={color}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      </BarOuter>
      <StatValue $color={color}>{value}</StatValue>
    </BarContainer>
  );
}
