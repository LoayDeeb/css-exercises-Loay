import styled from 'styled-components';
import theme from '../../theme';

const GraphContainer = styled.div`
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

export default function StreakGraph({ streakDays }) {
  const maxDisplay = 30;
  const barWidth = 100 / maxDisplay;
  const currentStreak = Math.min(streakDays, maxDisplay);

  return (
    <GraphContainer>
      <Title>Current Streak</Title>
      <svg width="100%" height={60} viewBox={`0 0 300 60`} preserveAspectRatio="xMidYMid meet">
        {/* Background track */}
        <rect x={0} y={20} width={300} height={20} rx={4} fill="rgba(74, 55, 40, 0.08)" />

        {/* Streak fill */}
        {currentStreak > 0 && (
          <rect
            x={0}
            y={20}
            width={(currentStreak / maxDisplay) * 300}
            height={20}
            rx={4}
            fill={`url(#streakGradient)`}
          />
        )}

        <defs>
          <linearGradient id="streakGradient" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={theme.colors.gold} />
            <stop offset="100%" stopColor={theme.colors.goldBright} />
          </linearGradient>
        </defs>

        {/* Labels */}
        <text x={4} y={14} fontSize="9" fontFamily={theme.fonts.handwritten} fill={theme.colors.mediumBrown}>
          0
        </text>
        <text x={146} y={14} textAnchor="middle" fontSize="9" fontFamily={theme.fonts.handwritten} fill={theme.colors.mediumBrown}>
          15
        </text>
        <text x={290} y={14} textAnchor="end" fontSize="9" fontFamily={theme.fonts.handwritten} fill={theme.colors.mediumBrown}>
          30+
        </text>

        {/* Current value */}
        <text
          x={Math.max(20, Math.min((currentStreak / maxDisplay) * 300, 280))}
          y={52}
          textAnchor="middle"
          fontSize="11"
          fontFamily={theme.fonts.display}
          fill={theme.colors.gold}
          fontWeight="700"
        >
          {streakDays} day{streakDays !== 1 ? 's' : ''}
        </text>
      </svg>
    </GraphContainer>
  );
}
