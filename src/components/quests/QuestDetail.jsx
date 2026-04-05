import styled from 'styled-components';
import { motion } from 'framer-motion';
import WaxSeal from './WaxSeal';
import BonusObjective from './BonusObjective';
import theme from '../../theme';
import { DIFFICULTIES } from '../../constants/difficulties';
import { formatMoonsRemaining, isOverdue } from '../../utils/dates';

const Overlay = styled(motion.div)`
  position: fixed;
  inset: 0;
  background: rgba(10, 5, 2, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const Detail = styled(motion.div)`
  background: ${theme.colors.parchment};
  background-image:
    radial-gradient(ellipse at 20% 80%, rgba(139, 37, 0, 0.03) 0%, transparent 50%);
  border: 2px solid ${theme.colors.mediumBrown};
  border-radius: 4px;
  padding: 30px 36px;
  max-width: 500px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 0 40px rgba(0, 0, 0, 0.5);

  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background: ${theme.colors.mediumBrown};
    border-radius: 3px;
  }
`;

const Header = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 14px;
  margin-bottom: 16px;
`;

const QuestTitle = styled.h2`
  font-family: ${theme.fonts.display};
  font-size: 1.4rem;
  color: ${theme.colors.darkBrown};
  margin: 0;
`;

const Description = styled.p`
  font-family: ${theme.fonts.handwritten};
  font-size: 1.1rem;
  color: ${theme.colors.mediumBrown};
  line-height: 1.5;
  margin: 0 0 16px;
  font-style: italic;
`;

const InfoRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
  font-family: ${theme.fonts.body};
  font-size: 0.9rem;
  color: ${theme.colors.darkBrown};
`;

const InfoLabel = styled.span`
  font-family: ${theme.fonts.display};
  font-size: 0.65rem;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: ${theme.colors.mediumBrown};
  width: 80px;
`;

const InfoValue = styled.span`
  color: ${theme.colors.darkBrown};
  font-weight: 600;
`;

const Divider = styled.div`
  height: 1px;
  background: rgba(74, 55, 40, 0.15);
  margin: 16px 0;
`;

const BonusSection = styled.div`
  margin: 16px 0;
`;

const SectionLabel = styled.div`
  font-family: ${theme.fonts.display};
  font-size: 0.7rem;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: ${theme.colors.darkBrown};
  margin-bottom: 8px;
`;

const ActionButtons = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 24px;
`;

const ActionBtn = styled(motion.button)`
  flex: 1;
  min-width: 100px;
  padding: 10px 16px;
  font-family: ${theme.fonts.display};
  font-size: 0.75rem;
  letter-spacing: 1px;
  text-transform: uppercase;
  border-radius: 3px;
  border: 1px solid;
  cursor: pointer;
  transition: all 0.2s;

  ${({ $variant }) => {
    switch ($variant) {
      case 'start':
        return `
          background: ${theme.colors.midnightBlue};
          color: #fff;
          border-color: ${theme.colors.midnightBlue};
          &:hover { box-shadow: 0 0 10px rgba(26, 26, 62, 0.4); }
        `;
      case 'complete':
        return `
          background: linear-gradient(135deg, ${theme.colors.gold}, ${theme.colors.goldBright});
          color: ${theme.colors.darkBrown};
          border-color: ${theme.colors.gold};
          &:hover { box-shadow: 0 0 10px rgba(212, 175, 55, 0.4); }
        `;
      case 'fail':
        return `
          background: transparent;
          color: #8b0000;
          border-color: #8b0000;
          &:hover { background: rgba(139, 0, 0, 0.05); }
        `;
      case 'abandon':
        return `
          background: transparent;
          color: ${theme.colors.mediumBrown};
          border-color: rgba(74, 55, 40, 0.3);
          &:hover { background: rgba(74, 55, 40, 0.05); }
        `;
      default:
        return `
          background: transparent;
          color: ${theme.colors.mediumBrown};
          border-color: rgba(74, 55, 40, 0.3);
        `;
    }
  }}
`;

const CloseBtn = styled.button`
  position: absolute;
  top: 12px;
  right: 16px;
  background: none;
  border: none;
  font-size: 1.5rem;
  color: ${theme.colors.mediumBrown};
  cursor: pointer;
  opacity: 0.5;

  &:hover {
    opacity: 1;
  }
`;

const CATEGORY_NAMES = {
  health: 'Health',
  intelligence: 'Intelligence',
  money: 'Money',
  relationships: 'Relationships',
};

const RECURRENCE_NAMES = {
  none: 'One-time',
  daily: 'Daily',
  weekly: 'Weekly',
  monthly: 'Monthly',
};

export default function QuestDetail({ quest, onClose, onStart, onComplete, onFail, onAbandon, onToggleBonus }) {
  if (!quest) return null;

  const difficulty = DIFFICULTIES.find((d) => d.id === quest.difficulty);
  const overdue = quest.dueDate && isOverdue(quest.dueDate);
  const stars = difficulty ? '★'.repeat(Math.floor(difficulty.stars)) + (difficulty.stars % 1 ? '½' : '') : '';

  return (
    <Overlay
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <Detail
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        style={{ position: 'relative' }}
      >
        <CloseBtn onClick={onClose}>×</CloseBtn>

        <Header>
          <WaxSeal category={quest.category} urgent={overdue} size={48} />
          <div>
            <QuestTitle>{quest.title}</QuestTitle>
          </div>
        </Header>

        {quest.description && <Description>"{quest.description}"</Description>}

        <InfoRow>
          <InfoLabel>Category</InfoLabel>
          <InfoValue>{CATEGORY_NAMES[quest.category]}</InfoValue>
        </InfoRow>
        <InfoRow>
          <InfoLabel>Difficulty</InfoLabel>
          <InfoValue>
            {difficulty?.name} ({stars}) — {difficulty?.xp} XP
          </InfoValue>
        </InfoRow>
        <InfoRow>
          <InfoLabel>Recurrence</InfoLabel>
          <InfoValue>{RECURRENCE_NAMES[quest.recurrence]}</InfoValue>
        </InfoRow>
        {quest.dueDate && (
          <InfoRow>
            <InfoLabel>Due</InfoLabel>
            <InfoValue style={{ color: overdue ? '#cc0000' : undefined }}>
              {formatMoonsRemaining(quest.dueDate)}
            </InfoValue>
          </InfoRow>
        )}

        {quest.bonusObjectives?.length > 0 && (
          <>
            <Divider />
            <BonusSection>
              <SectionLabel>Bonus Objectives</SectionLabel>
              {quest.bonusObjectives.map((obj) => (
                <BonusObjective
                  key={obj.id}
                  objective={obj}
                  onToggle={() => onToggleBonus?.(quest.id, obj.id)}
                  disabled={quest.status !== 'in_progress'}
                />
              ))}
            </BonusSection>
          </>
        )}

        <Divider />

        <ActionButtons>
          {quest.status === 'available' && (
            <ActionBtn $variant="start" onClick={() => onStart(quest.id)} whileTap={{ scale: 0.95 }}>
              Begin Quest
            </ActionBtn>
          )}
          {quest.status === 'in_progress' && (
            <>
              <ActionBtn $variant="complete" onClick={() => onComplete(quest.id)} whileTap={{ scale: 0.95 }}>
                Complete Quest
              </ActionBtn>
              <ActionBtn $variant="fail" onClick={() => onFail(quest.id)} whileTap={{ scale: 0.95 }}>
                Fail
              </ActionBtn>
              <ActionBtn $variant="abandon" onClick={() => onAbandon(quest.id)} whileTap={{ scale: 0.95 }}>
                Abandon
              </ActionBtn>
            </>
          )}
          {(quest.status === 'completed' || quest.status === 'failed' || quest.status === 'abandoned') && (
            <ActionBtn $variant="default" onClick={onClose} whileTap={{ scale: 0.95 }}>
              Close
            </ActionBtn>
          )}
        </ActionButtons>
      </Detail>
    </Overlay>
  );
}
