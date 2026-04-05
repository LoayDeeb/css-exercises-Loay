import styled from 'styled-components';
import { motion } from 'framer-motion';
import theme from '../../theme';

const TIER_COLORS = {
  common: '#8B8B8B',
  uncommon: '#2ecc71',
  rare: '#3498db',
  epic: '#9b59b6',
  legendary: '#f39c12',
};

const Card = styled(motion.div)`
  background: ${theme.colors.parchment};
  border: 2px solid ${({ $tierColor }) => $tierColor}44;
  border-left: 4px solid ${({ $tierColor }) => $tierColor};
  border-radius: 3px;
  padding: 12px 14px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
`;

const Info = styled.div`
  flex: 1;
  min-width: 0;
`;

const Name = styled.div`
  font-family: ${theme.fonts.body};
  font-size: 0.95rem;
  color: ${theme.colors.darkBrown};
  font-weight: 600;
`;

const Tier = styled.span`
  font-family: ${theme.fonts.display};
  font-size: 0.55rem;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: ${({ $tierColor }) => $tierColor};
  background: ${({ $tierColor }) => $tierColor}11;
  padding: 2px 6px;
  border-radius: 2px;
`;

const Category = styled.span`
  font-family: ${theme.fonts.handwritten};
  font-size: 0.8rem;
  color: ${theme.colors.mediumBrown};
`;

const Actions = styled.div`
  display: flex;
  gap: 4px;
`;

const ActionBtn = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  font-size: 0.9rem;
  opacity: 0.4;
  transition: opacity 0.2s;

  &:hover {
    opacity: 1;
  }
`;

export default function RewardCard({ reward, onEdit, onDelete }) {
  const tierColor = TIER_COLORS[reward.tier] || TIER_COLORS.common;

  return (
    <Card
      $tierColor={tierColor}
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
    >
      <Info>
        <Name>{reward.name}</Name>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: '4px' }}>
          <Tier $tierColor={tierColor}>{reward.tier}</Tier>
          {reward.category && <Category>{reward.category}</Category>}
        </div>
      </Info>
      {(onEdit || onDelete) && (
        <Actions>
          {onEdit && <ActionBtn onClick={() => onEdit(reward)}>✏️</ActionBtn>}
          {onDelete && <ActionBtn onClick={() => onDelete(reward.id)}>🗑️</ActionBtn>}
        </Actions>
      )}
    </Card>
  );
}
