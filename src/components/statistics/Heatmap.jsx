import styled from 'styled-components';
import theme from '../../theme';

const HeatmapContainer = styled.div`
  margin-bottom: 20px;
`;

const Title = styled.h3`
  font-family: ${theme.fonts.display};
  font-size: 0.8rem;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: ${theme.colors.darkBrown};
  margin: 0 0 10px;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 3px;
`;

const Cell = styled.div`
  aspect-ratio: 1;
  border-radius: 2px;
  background: ${({ $level }) => {
    switch ($level) {
      case 0: return 'rgba(74, 55, 40, 0.06)';
      case 1: return 'rgba(212, 175, 55, 0.2)';
      case 2: return 'rgba(212, 175, 55, 0.4)';
      case 3: return 'rgba(212, 175, 55, 0.6)';
      case 4: return 'rgba(212, 175, 55, 0.85)';
      default: return 'rgba(74, 55, 40, 0.06)';
    }
  }};
  border: 1px solid rgba(74, 55, 40, 0.08);
  title: ${({ $title }) => $title};
`;

const DayLabels = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 3px;
  margin-bottom: 4px;
`;

const DayLabel = styled.div`
  font-family: ${theme.fonts.body};
  font-size: 0.6rem;
  color: ${theme.colors.mediumBrown};
  text-align: center;
`;

const Legend = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  margin-top: 8px;
  justify-content: flex-end;
`;

const LegendLabel = styled.span`
  font-family: ${theme.fonts.body};
  font-size: 0.6rem;
  color: ${theme.colors.mediumBrown};
`;

const LegendCell = styled.div`
  width: 12px;
  height: 12px;
  border-radius: 2px;
  background: ${({ $level }) => {
    switch ($level) {
      case 0: return 'rgba(74, 55, 40, 0.06)';
      case 1: return 'rgba(212, 175, 55, 0.2)';
      case 2: return 'rgba(212, 175, 55, 0.4)';
      case 3: return 'rgba(212, 175, 55, 0.6)';
      case 4: return 'rgba(212, 175, 55, 0.85)';
      default: return 'rgba(74, 55, 40, 0.06)';
    }
  }};
`;

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function Heatmap({ questHistory }) {
  // Build a 4-week heatmap from quest history
  const today = new Date();
  const cells = [];

  for (let i = 27; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];

    const count = questHistory.filter((q) => {
      if (!q.completedAt) return false;
      return q.completedAt.split('T')[0] === dateStr;
    }).length;

    let level = 0;
    if (count >= 5) level = 4;
    else if (count >= 3) level = 3;
    else if (count >= 2) level = 2;
    else if (count >= 1) level = 1;

    cells.push({ date: dateStr, count, level });
  }

  return (
    <HeatmapContainer>
      <Title>Quest Activity (4 Weeks)</Title>
      <DayLabels>
        {DAYS.map((d) => (
          <DayLabel key={d}>{d}</DayLabel>
        ))}
      </DayLabels>
      <Grid>
        {cells.map((cell, i) => (
          <Cell key={i} $level={cell.level} title={`${cell.date}: ${cell.count} quests`} />
        ))}
      </Grid>
      <Legend>
        <LegendLabel>Less</LegendLabel>
        {[0, 1, 2, 3, 4].map((l) => (
          <LegendCell key={l} $level={l} />
        ))}
        <LegendLabel>More</LegendLabel>
      </Legend>
    </HeatmapContainer>
  );
}
