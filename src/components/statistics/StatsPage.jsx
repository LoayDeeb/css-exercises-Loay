import styled from 'styled-components';
import { useCharacterContext } from '../../context/CharacterContext';
import { useQuestContext } from '../../context/QuestContext';
import Heatmap from './Heatmap';
import CategoryChart from './CategoryChart';
import StreakGraph from './StreakGraph';
import theme from '../../theme';
import { DIFFICULTIES } from '../../constants/difficulties';

const Page = styled.div`
  padding: 5px;
`;

const PageTitle = styled.h2`
  font-family: ${theme.fonts.display};
  font-size: 1.3rem;
  color: ${theme.colors.darkBrown};
  margin: 0 0 20px;
`;

const RecordsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
  margin-bottom: 20px;
`;

const RecordCard = styled.div`
  background: rgba(74, 55, 40, 0.04);
  border: 1px solid rgba(74, 55, 40, 0.1);
  border-radius: 3px;
  padding: 10px;
  text-align: center;
`;

const RecordValue = styled.div`
  font-family: ${theme.fonts.display};
  font-size: 1.4rem;
  color: ${theme.colors.gold};
  font-weight: 700;
`;

const RecordLabel = styled.div`
  font-family: ${theme.fonts.body};
  font-size: 0.7rem;
  color: ${theme.colors.mediumBrown};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const DifficultyBars = styled.div`
  margin-bottom: 20px;
`;

const DiffTitle = styled.h3`
  font-family: ${theme.fonts.display};
  font-size: 0.8rem;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: ${theme.colors.darkBrown};
  margin: 0 0 10px;
`;

const DiffRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
`;

const DiffLabel = styled.div`
  font-family: ${theme.fonts.body};
  font-size: 0.7rem;
  color: ${theme.colors.mediumBrown};
  width: 65px;
  text-align: right;
`;

const DiffBar = styled.div`
  flex: 1;
  height: 14px;
  background: rgba(74, 55, 40, 0.06);
  border-radius: 7px;
  overflow: hidden;
`;

const DiffFill = styled.div`
  height: 100%;
  width: ${({ $pct }) => $pct}%;
  background: ${({ $color }) => $color};
  border-radius: 7px;
  transition: width 0.5s ease;
`;

const DiffCount = styled.div`
  font-family: ${theme.fonts.handwritten};
  font-size: 0.8rem;
  color: ${theme.colors.mediumBrown};
  width: 24px;
`;

const DIFF_COLORS = {
  trivial: '#999',
  easy: '#27ae60',
  medium: '#2980b9',
  hard: '#e67e22',
  epic: '#8e44ad',
  legendary: '#f39c12',
};

export default function StatsPage() {
  const { state: charState } = useCharacterContext();
  const { state: questState } = useQuestContext();

  const totalCompleted = questState.questHistory.filter((q) => q.status === 'completed').length;
  const totalFailed = questState.questHistory.filter((q) => q.status === 'failed').length;

  // Difficulty breakdown
  const diffCounts = {};
  questState.questHistory
    .filter((q) => q.status === 'completed')
    .forEach((q) => {
      diffCounts[q.difficulty] = (diffCounts[q.difficulty] || 0) + 1;
    });
  const maxDiff = Math.max(1, ...Object.values(diffCounts));

  return (
    <Page>
      <PageTitle>Statistics</PageTitle>

      <RecordsGrid>
        <RecordCard>
          <RecordValue>{totalCompleted}</RecordValue>
          <RecordLabel>Quests Done</RecordLabel>
        </RecordCard>
        <RecordCard>
          <RecordValue>{charState.streakDays}</RecordValue>
          <RecordLabel>Day Streak</RecordLabel>
        </RecordCard>
        <RecordCard>
          <RecordValue>{charState.xp}</RecordValue>
          <RecordLabel>Total XP</RecordLabel>
        </RecordCard>
        <RecordCard>
          <RecordValue>{charState.gold}</RecordValue>
          <RecordLabel>Total Gold</RecordLabel>
        </RecordCard>
      </RecordsGrid>

      <Heatmap questHistory={questState.questHistory} />

      <CategoryChart categoryCounts={charState.completedQuestsByCategory} />

      <DifficultyBars>
        <DiffTitle>Difficulty Breakdown</DiffTitle>
        {DIFFICULTIES.map((d) => {
          const count = diffCounts[d.id] || 0;
          return (
            <DiffRow key={d.id}>
              <DiffLabel>{d.name}</DiffLabel>
              <DiffBar>
                <DiffFill $pct={(count / maxDiff) * 100} $color={DIFF_COLORS[d.id]} />
              </DiffBar>
              <DiffCount>{count}</DiffCount>
            </DiffRow>
          );
        })}
      </DifficultyBars>

      <StreakGraph streakDays={charState.streakDays} />
    </Page>
  );
}
