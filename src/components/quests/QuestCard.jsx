import styled from 'styled-components';
import { motion } from 'framer-motion';
import WaxSeal from './WaxSeal';
import theme from '../../theme';
import { DIFFICULTIES } from '../../constants/difficulties';
import { formatMoonsRemaining, isOverdue } from '../../utils/dates';

const Card = styled(motion.div)`
  background: ${theme.colors.parchment};
  background-image:
    radial-gradient(ellipse at 80% 20%, rgba(74, 55, 40, 0.04) 0%, transparent 50%);
  border: 1px solid rgba(74, 55, 40, 0.25);
  border-radius: 3px;
  padding: 14px;
  cursor: pointer;
  position: relative;
  transition: box-shadow 0.3s;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    transform: translateY(-2px);
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: ${({ $categoryColor }) => $categoryColor || theme.colors.mediumBrown};
    border-radius: 3px 3px 0 0;
    opacity: 0.6;
  }
`;

const CardHeader = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 10px;
  margin-bottom: 8px;
`;

const CardInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const QuestTitle = styled.h3`
  font-family: ${theme.fonts.display};
  font-size: 0.95rem;
  color: ${theme.colors.darkBrown};
  margin: 0 0 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const QuestDesc = styled.p`
  font-family: ${theme.fonts.handwritten};
  font-size: 0.85rem;
  color: ${theme.colors.mediumBrown};
  margin: 0;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const CardFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 8px;
  gap: 8px;
`;

const Stars = styled.div`
  display: flex;
  gap: 2px;
  font-size: 0.7rem;
`;

const Star = styled.span`
  color: ${({ $filled }) => $filled ? theme.colors.gold : 'rgba(74, 55, 40, 0.2)'};
`;

const DueDate = styled.span`
  font-family: ${theme.fonts.handwritten};
  font-size: 0.8rem;
  color: ${({ $overdue }) => $overdue ? '#cc0000' : theme.colors.mediumBrown};
  font-style: italic;
`;

const StatusBadge = styled.span`
  font-family: ${theme.fonts.display};
  font-size: 0.55rem;
  letter-spacing: 1px;
  text-transform: uppercase;
  padding: 2px 8px;
  border-radius: 2px;
  background: ${({ $status }) => {
    switch ($status) {
      case 'in_progress': return theme.colors.midnightBlue;
      case 'completed': return '#2d6a2d';
      case 'failed': return '#8b0000';
      case 'abandoned': return '#555';
      default: return theme.colors.mediumBrown;
    }
  }};
  color: #fff;
`;

const BonusCount = styled.span`
  font-family: ${theme.fonts.body};
  font-size: 0.7rem;
  color: ${theme.colors.gold};
`;

const CATEGORY_COLORS = {
  health: '#8b2500',
  intelligence: '#1a1a3e',
  money: '#b8860b',
  relationships: '#6b3a6b',
};

export default function QuestCard({ quest, onClick }) {
  const difficulty = DIFFICULTIES.find((d) => d.id === quest.difficulty);
  const overdue = quest.dueDate && isOverdue(quest.dueDate);
  const completedBonuses = quest.bonusObjectives?.filter((b) => b.completed).length || 0;
  const totalBonuses = quest.bonusObjectives?.length || 0;

  const renderStars = () => {
    if (!difficulty) return null;
    const fullStars = Math.floor(difficulty.stars);
    const halfStar = difficulty.stars % 1 !== 0;
    const stars = [];
    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} $filled>★</Star>);
    }
    if (halfStar) {
      stars.push(<Star key="half" $filled style={{ opacity: 0.5 }}>★</Star>);
    }
    for (let i = stars.length; i < 5; i++) {
      stars.push(<Star key={`e${i}`}>★</Star>);
    }
    return stars;
  };

  return (
    <Card
      $categoryColor={CATEGORY_COLORS[quest.category]}
      onClick={() => onClick?.(quest)}
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
    >
      <CardHeader>
        <WaxSeal category={quest.category} urgent={overdue} size={36} />
        <CardInfo>
          <QuestTitle>{quest.title}</QuestTitle>
          {quest.description && <QuestDesc>{quest.description}</QuestDesc>}
        </CardInfo>
        {quest.status !== 'available' && (
          <StatusBadge $status={quest.status}>
            {quest.status.replace('_', ' ')}
          </StatusBadge>
        )}
      </CardHeader>

      <CardFooter>
        <Stars>{renderStars()}</Stars>
        {totalBonuses > 0 && (
          <BonusCount>
            {completedBonuses}/{totalBonuses} bonus
          </BonusCount>
        )}
        {quest.dueDate && (
          <DueDate $overdue={overdue}>
            {formatMoonsRemaining(quest.dueDate)}
          </DueDate>
        )}
      </CardFooter>
    </Card>
  );
}
