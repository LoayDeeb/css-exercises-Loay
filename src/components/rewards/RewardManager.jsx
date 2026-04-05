import { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { v4 as uuidv4 } from 'uuid';
import { useRewardContext } from '../../context/RewardContext';
import RewardCard from './RewardCard';
import theme from '../../theme';
import { REWARD_TIERS } from '../../constants/rewards';

const Manager = styled.div`
  padding: 5px;
`;

const PageTitle = styled.h2`
  font-family: ${theme.fonts.display};
  font-size: 1.3rem;
  color: ${theme.colors.darkBrown};
  margin: 0 0 16px;
`;

const TierSection = styled.div`
  margin-bottom: 20px;
`;

const TierHeader = styled.h3`
  font-family: ${theme.fonts.display};
  font-size: 0.8rem;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: ${({ $color }) => $color};
  margin: 0 0 8px;
  display: flex;
  align-items: center;
  gap: 8px;

  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: ${({ $color }) => $color}33;
  }
`;

const RewardList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const AddForm = styled.div`
  margin-top: 20px;
  padding: 16px;
  background: rgba(74, 55, 40, 0.04);
  border: 1px dashed rgba(74, 55, 40, 0.2);
  border-radius: 4px;
`;

const FormTitle = styled.h3`
  font-family: ${theme.fonts.display};
  font-size: 0.8rem;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: ${theme.colors.darkBrown};
  margin: 0 0 12px;
`;

const FormRow = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 8px;
`;

const Input = styled.input`
  flex: 1;
  padding: 6px 10px;
  font-family: ${theme.fonts.handwritten};
  font-size: 1rem;
  color: ${theme.colors.darkText};
  background: rgba(255, 255, 255, 0.4);
  border: none;
  border-bottom: 1px solid rgba(74, 55, 40, 0.2);
  outline: none;
  box-sizing: border-box;

  &:focus {
    border-bottom-color: ${theme.colors.gold};
  }
`;

const Select = styled.select`
  padding: 6px 8px;
  font-family: ${theme.fonts.body};
  font-size: 0.9rem;
  background: rgba(255, 255, 255, 0.4);
  border: 1px solid rgba(74, 55, 40, 0.2);
  border-radius: 2px;
  outline: none;
  color: ${theme.colors.darkText};
`;

const AddBtn = styled(motion.button)`
  padding: 8px 16px;
  font-family: ${theme.fonts.display};
  font-size: 0.7rem;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: ${theme.colors.lightText};
  background: ${theme.colors.mediumBrown};
  border: none;
  border-radius: 3px;
  cursor: pointer;

  &:hover {
    background: ${theme.colors.darkBrown};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const TIER_ORDER = ['Legendary', 'Epic', 'Rare', 'Uncommon', 'Common'];
const TIER_ARRAY = Object.entries(REWARD_TIERS).map(([id, t]) => ({ id, ...t }));

export default function RewardManager() {
  const { state, dispatch } = useRewardContext();
  const [newName, setNewName] = useState('');
  const [newTier, setNewTier] = useState('Common');
  const [newCategory, setNewCategory] = useState('');

  const handleAdd = () => {
    if (!newName.trim()) return;
    dispatch({
      type: 'ADD_REWARD',
      payload: {
        id: uuidv4(),
        name: newName.trim(),
        tier: newTier,
        category: newCategory || null,
        cooldownDays: 0,
        seasonal: false,
        lastAwarded: null,
      },
    });
    setNewName('');
  };

  const handleDelete = (id) => {
    dispatch({ type: 'DELETE_REWARD', payload: id });
  };

  const grouped = TIER_ORDER.reduce((acc, tier) => {
    acc[tier] = state.rewards.filter((r) => r.tier === tier);
    return acc;
  }, {});

  return (
    <Manager>
      <PageTitle>Reward Treasury</PageTitle>

      {TIER_ORDER.map((tier) => {
        const rewards = grouped[tier];
        if (!rewards?.length) return null;
        const tierConfig = REWARD_TIERS[tier];
        return (
          <TierSection key={tier}>
            <TierHeader $color={tierConfig?.color || '#888'}>
              {tierConfig?.name || tier} ({rewards.length})
            </TierHeader>
            <RewardList>
              {rewards.map((r) => (
                <RewardCard key={r.id} reward={r} onDelete={handleDelete} />
              ))}
            </RewardList>
          </TierSection>
        );
      })}

      <AddForm>
        <FormTitle>Add Custom Reward</FormTitle>
        <FormRow>
          <Input
            placeholder="Reward name..."
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />
          <Select value={newTier} onChange={(e) => setNewTier(e.target.value)}>
            {TIER_ARRAY.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </Select>
        </FormRow>
        <FormRow>
          <Input
            placeholder="Category (optional)..."
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
          />
          <AddBtn
            disabled={!newName.trim()}
            onClick={handleAdd}
            whileTap={{ scale: 0.95 }}
          >
            Add
          </AddBtn>
        </FormRow>
      </AddForm>
    </Manager>
  );
}
