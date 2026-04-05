import styled from 'styled-components';
import { useAchievementContext } from '../../context/AchievementContext';
import { ACHIEVEMENTS } from '../../constants/achievements';
import AchievementBadge from './AchievementBadge';
import theme from '../../theme';

const Room = styled.div`
  padding: 5px;
`;

const PageTitle = styled.h2`
  font-family: ${theme.fonts.display};
  font-size: 1.3rem;
  color: ${theme.colors.darkBrown};
  margin: 0 0 4px;
`;

const Subtitle = styled.div`
  font-family: ${theme.fonts.handwritten};
  font-size: 0.95rem;
  color: ${theme.colors.mediumBrown};
  margin-bottom: 20px;
  font-style: italic;
`;

const CategorySection = styled.div`
  margin-bottom: 20px;
`;

const CategoryTitle = styled.h3`
  font-family: ${theme.fonts.display};
  font-size: 0.75rem;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: ${theme.colors.mediumBrown};
  margin: 0 0 10px;
  display: flex;
  align-items: center;
  gap: 8px;

  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: rgba(74, 55, 40, 0.15);
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 10px;
`;

const CATEGORIES = [
  { id: 'progression', name: 'Progression' },
  { id: 'mastery', name: 'Category Mastery' },
  { id: 'dedication', name: 'Dedication' },
  { id: 'challenge', name: 'Challenge' },
];

export default function TrophyRoom() {
  const { state } = useAchievementContext();
  const unlockedSet = new Set(state.unlockedAchievements);
  const totalUnlocked = state.unlockedAchievements.length;

  return (
    <Room>
      <PageTitle>Trophy Room</PageTitle>
      <Subtitle>
        {totalUnlocked} of {ACHIEVEMENTS.length} achievements unlocked
      </Subtitle>

      {CATEGORIES.map((cat) => {
        const achievements = ACHIEVEMENTS.filter((a) => a.category === cat.id);
        if (!achievements.length) return null;
        return (
          <CategorySection key={cat.id}>
            <CategoryTitle>{cat.name}</CategoryTitle>
            <Grid>
              {achievements.map((ach) => (
                <AchievementBadge
                  key={ach.id}
                  achievement={ach}
                  unlocked={unlockedSet.has(ach.id)}
                />
              ))}
            </Grid>
          </CategorySection>
        );
      })}
    </Room>
  );
}
