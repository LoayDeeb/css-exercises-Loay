import styled from 'styled-components';
import { motion } from 'framer-motion';
import theme from '../../theme';

const Badge = styled(motion.div)`
  background: ${({ $unlocked }) =>
    $unlocked ? `linear-gradient(135deg, ${theme.colors.gold}15, ${theme.colors.goldBright}08)` : 'rgba(74, 55, 40, 0.04)'};
  border: 1px solid ${({ $unlocked }) =>
    $unlocked ? theme.colors.gold + '44' : 'rgba(74, 55, 40, 0.1)'};
  border-radius: 4px;
  padding: 12px;
  text-align: center;
  opacity: ${({ $unlocked }) => $unlocked ? 1 : 0.5};
  transition: all 0.3s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ $unlocked }) =>
      $unlocked ? '0 4px 12px rgba(212, 175, 55, 0.2)' : '0 2px 6px rgba(0,0,0,0.1)'};
  }
`;

const Icon = styled.div`
  font-size: 2rem;
  margin-bottom: 6px;
  ${({ $unlocked }) => !$unlocked && 'filter: grayscale(100%);'}
`;

const Name = styled.div`
  font-family: ${theme.fonts.display};
  font-size: 0.7rem;
  color: ${({ $unlocked }) => $unlocked ? theme.colors.darkBrown : theme.colors.mediumBrown};
  font-weight: 700;
  letter-spacing: 0.5px;
  margin-bottom: 2px;
`;

const Desc = styled.div`
  font-family: ${theme.fonts.handwritten};
  font-size: 0.75rem;
  color: ${theme.colors.mediumBrown};
  line-height: 1.3;
`;

export default function AchievementBadge({ achievement, unlocked }) {
  return (
    <Badge
      $unlocked={unlocked}
      whileHover={{ scale: 1.02 }}
    >
      <Icon $unlocked={unlocked}>{unlocked ? achievement.icon : '🔒'}</Icon>
      <Name $unlocked={unlocked}>{achievement.name}</Name>
      <Desc>{unlocked ? achievement.description : '???'}</Desc>
    </Badge>
  );
}
