import styled from 'styled-components';
import { motion } from 'framer-motion';
import theme from '../../theme';

const ObjectiveRow = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 0;
  cursor: pointer;
  user-select: none;

  &:hover {
    opacity: 0.8;
  }
`;

const Checkbox = styled.div`
  width: 18px;
  height: 18px;
  border: 2px solid ${({ $checked }) => $checked ? theme.colors.gold : theme.colors.mediumBrown};
  background: ${({ $checked }) => $checked ? theme.colors.gold + '22' : 'transparent'};
  border-radius: 2px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
  color: ${theme.colors.gold};
  transition: all 0.2s;
  flex-shrink: 0;
`;

const ObjectiveText = styled.span`
  font-family: ${theme.fonts.handwritten};
  font-size: 1rem;
  color: ${({ $checked }) => $checked ? theme.colors.mediumBrown : theme.colors.darkText};
  text-decoration: ${({ $checked }) => $checked ? 'line-through' : 'none'};
  opacity: ${({ $checked }) => $checked ? 0.6 : 1};
  transition: all 0.2s;
`;

const BonusTag = styled.span`
  font-family: ${theme.fonts.display};
  font-size: 0.55rem;
  color: ${theme.colors.gold};
  background: ${theme.colors.gold}15;
  padding: 1px 5px;
  border-radius: 2px;
  letter-spacing: 1px;
  text-transform: uppercase;
  flex-shrink: 0;
`;

export default function BonusObjective({ objective, onToggle, disabled }) {
  return (
    <ObjectiveRow
      onClick={() => !disabled && onToggle(objective.id)}
      whileTap={!disabled ? { scale: 0.98 } : undefined}
    >
      <Checkbox $checked={objective.completed}>
        {objective.completed && '✓'}
      </Checkbox>
      <ObjectiveText $checked={objective.completed}>
        {objective.text}
      </ObjectiveText>
      <BonusTag>+25% XP</BonusTag>
    </ObjectiveRow>
  );
}
