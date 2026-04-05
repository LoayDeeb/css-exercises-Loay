import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useCharacterContext } from '../../context/CharacterContext';
import { xpProgress } from '../../utils/xp';
import { CHARACTER_CLASSES } from '../../constants/classes';
import StatBar from './StatBar';
import theme from '../../theme';

const Sheet = styled.div`
  padding: 10px;
  font-family: ${theme.fonts.body};
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 2px solid rgba(74, 55, 40, 0.2);
`;

const CharName = styled.h1`
  font-family: ${theme.fonts.display};
  font-size: 1.8rem;
  color: ${theme.colors.darkBrown};
  margin: 0 0 4px;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
`;

const CharTitle = styled.div`
  font-family: ${theme.fonts.handwritten};
  font-size: 1.2rem;
  color: ${theme.colors.mediumBrown};
  font-style: italic;
`;

const ClassBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-top: 8px;
  padding: 4px 14px;
  background: linear-gradient(135deg, ${theme.colors.darkBrown}, ${theme.colors.mediumBrown});
  color: ${theme.colors.gold};
  font-family: ${theme.fonts.display};
  font-size: 0.75rem;
  letter-spacing: 2px;
  text-transform: uppercase;
  border-radius: 2px;
  border: 1px solid ${theme.colors.gold}44;
`;

const LevelSection = styled.div`
  text-align: center;
  margin-bottom: 24px;
`;

const LevelNumber = styled.div`
  font-family: ${theme.fonts.display};
  font-size: 2.5rem;
  color: ${theme.colors.gold};
  font-weight: 900;
  text-shadow: 0 0 10px rgba(212, 175, 55, 0.3);
`;

const LevelLabel = styled.div`
  font-family: ${theme.fonts.display};
  font-size: 0.7rem;
  letter-spacing: 3px;
  text-transform: uppercase;
  color: ${theme.colors.mediumBrown};
  margin-bottom: 8px;
`;

const XpBarContainer = styled.div`
  width: 100%;
  height: 12px;
  background: rgba(74, 55, 40, 0.15);
  border-radius: 6px;
  overflow: hidden;
  border: 1px solid rgba(74, 55, 40, 0.2);
  margin-top: 6px;
`;

const XpBarFill = styled(motion.div)`
  height: 100%;
  background: linear-gradient(90deg, ${theme.colors.gold}, ${theme.colors.goldBright});
  border-radius: 6px;
  box-shadow: 0 0 6px rgba(212, 175, 55, 0.4);
`;

const XpText = styled.div`
  font-family: ${theme.fonts.handwritten};
  font-size: 0.9rem;
  color: ${theme.colors.mediumBrown};
  text-align: center;
  margin-top: 4px;
`;

const StatsSection = styled.div`
  margin-bottom: 20px;
`;

const SectionTitle = styled.h2`
  font-family: ${theme.fonts.display};
  font-size: 1rem;
  color: ${theme.colors.darkBrown};
  letter-spacing: 2px;
  text-transform: uppercase;
  margin-bottom: 12px;
  padding-bottom: 4px;
  border-bottom: 1px solid rgba(74, 55, 40, 0.15);
`;

const DerivedStatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  margin-top: 12px;
`;

const DerivedStat = styled.div`
  text-align: center;
  padding: 10px 6px;
  background: rgba(74, 55, 40, 0.05);
  border: 1px solid rgba(74, 55, 40, 0.1);
  border-radius: 4px;
`;

const DerivedIcon = styled.div`
  font-size: 1.3rem;
  margin-bottom: 4px;
`;

const DerivedValue = styled.div`
  font-family: ${theme.fonts.display};
  font-size: 1.2rem;
  color: ${({ $color }) => $color || theme.colors.darkBrown};
  font-weight: 700;
`;

const DerivedLabel = styled.div`
  font-family: ${theme.fonts.body};
  font-size: 0.7rem;
  color: ${theme.colors.mediumBrown};
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const STAT_CONFIG = [
  { key: 'vitality', name: 'Vitality', icon: '❤️', color: '#c0392b' },
  { key: 'wisdom', name: 'Wisdom', icon: '📖', color: '#2980b9' },
  { key: 'fortune', name: 'Fortune', icon: '💰', color: '#d4af37' },
  { key: 'charisma', name: 'Charisma', icon: '💍', color: '#8e44ad' },
];

export default function CharacterSheet() {
  const { state } = useCharacterContext();
  const { name, title, className, stats, xp, gold, hp, mp, talents } = state;

  const classData = CHARACTER_CLASSES.find((c) => c.id === className);
  const progress = xpProgress(xp);
  const maxHp = 100 + stats.vitality * 5 + (talents.resilience || 0) * 20;
  const maxMp = 50 + stats.wisdom * 3;

  return (
    <Sheet>
      <Header>
        <CharName>{name}</CharName>
        <CharTitle>"{title}"</CharTitle>
        {classData && (
          <ClassBadge>
            <span>{classData.icon}</span>
            <span>{classData.name}</span>
          </ClassBadge>
        )}
      </Header>

      <LevelSection>
        <LevelLabel>Level</LevelLabel>
        <LevelNumber>{progress.level}</LevelNumber>
        <XpBarContainer>
          <XpBarFill
            initial={{ width: 0 }}
            animate={{ width: `${progress.progress * 100}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />
        </XpBarContainer>
        <XpText>
          {progress.currentXp} / {progress.nextLevelXp} XP
        </XpText>
      </LevelSection>

      <StatsSection>
        <SectionTitle>Primary Stats</SectionTitle>
        {STAT_CONFIG.map((s) => (
          <StatBar
            key={s.key}
            name={s.name}
            icon={s.icon}
            value={stats[s.key]}
            maxValue={100}
            color={s.color}
          />
        ))}
      </StatsSection>

      <StatsSection>
        <SectionTitle>Derived Stats</SectionTitle>
        <DerivedStatsGrid>
          <DerivedStat>
            <DerivedIcon>❤️</DerivedIcon>
            <DerivedValue $color="#c0392b">
              {Math.max(0, hp)} / {maxHp}
            </DerivedValue>
            <DerivedLabel>HP</DerivedLabel>
          </DerivedStat>
          <DerivedStat>
            <DerivedIcon>🔮</DerivedIcon>
            <DerivedValue $color="#2980b9">
              {Math.max(0, mp)} / {maxMp}
            </DerivedValue>
            <DerivedLabel>MP</DerivedLabel>
          </DerivedStat>
          <DerivedStat>
            <DerivedIcon>💰</DerivedIcon>
            <DerivedValue $color="#d4af37">{gold}</DerivedValue>
            <DerivedLabel>Gold</DerivedLabel>
          </DerivedStat>
        </DerivedStatsGrid>
      </StatsSection>
    </Sheet>
  );
}
