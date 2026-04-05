import styled from 'styled-components';
import theme from '../../theme';

const ChartContainer = styled.div`
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

const SvgContainer = styled.div`
  display: flex;
  justify-content: center;
`;

const LegendList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: center;
  margin-top: 10px;
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  font-family: ${theme.fonts.body};
  font-size: 0.75rem;
  color: ${theme.colors.darkBrown};
`;

const LegendDot = styled.div`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: ${({ $color }) => $color};
`;

const CATEGORY_CONFIG = [
  { id: 'health', name: 'Health', color: '#8b2500' },
  { id: 'intelligence', name: 'Intelligence', color: '#1a1a3e' },
  { id: 'money', name: 'Money', color: '#b8860b' },
  { id: 'relationships', name: 'Relationships', color: '#6b3a6b' },
];

function polarToCartesian(cx, cy, r, angle) {
  const rad = ((angle - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function describeArc(cx, cy, r, startAngle, endAngle) {
  const start = polarToCartesian(cx, cy, r, endAngle);
  const end = polarToCartesian(cx, cy, r, startAngle);
  const largeArc = endAngle - startAngle > 180 ? 1 : 0;
  return `M ${cx} ${cy} L ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 0 ${end.x} ${end.y} Z`;
}

export default function CategoryChart({ categoryCounts }) {
  const total = Object.values(categoryCounts).reduce((a, b) => a + b, 0);
  const cx = 80;
  const cy = 80;
  const r = 65;

  if (total === 0) {
    return (
      <ChartContainer>
        <Title>Category Distribution</Title>
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <span style={{ fontFamily: theme.fonts.handwritten, color: theme.colors.mediumBrown, fontStyle: 'italic' }}>
            Complete quests to see your distribution
          </span>
        </div>
      </ChartContainer>
    );
  }

  let currentAngle = 0;
  const slices = CATEGORY_CONFIG.map((cat) => {
    const count = categoryCounts[cat.id] || 0;
    const angle = (count / total) * 360;
    const slice = {
      ...cat,
      count,
      startAngle: currentAngle,
      endAngle: currentAngle + angle,
    };
    currentAngle += angle;
    return slice;
  }).filter((s) => s.count > 0);

  return (
    <ChartContainer>
      <Title>Category Distribution</Title>
      <SvgContainer>
        <svg width={160} height={160} viewBox="0 0 160 160">
          {/* Compass rose decoration */}
          {[0, 90, 180, 270].map((angle) => {
            const p = polarToCartesian(cx, cy, r + 8, angle);
            return (
              <line
                key={angle}
                x1={cx}
                y1={cy}
                x2={p.x}
                y2={p.y}
                stroke="rgba(74, 55, 40, 0.1)"
                strokeWidth={1}
              />
            );
          })}

          {slices.map((slice) => {
            if (slices.length === 1) {
              return (
                <circle
                  key={slice.id}
                  cx={cx}
                  cy={cy}
                  r={r}
                  fill={slice.color}
                  opacity={0.8}
                />
              );
            }
            return (
              <path
                key={slice.id}
                d={describeArc(cx, cy, r, slice.startAngle, slice.endAngle)}
                fill={slice.color}
                opacity={0.8}
                stroke={theme.colors.parchment}
                strokeWidth={1.5}
              />
            );
          })}

          {/* Center decoration */}
          <circle cx={cx} cy={cy} r={16} fill={theme.colors.parchment} stroke="rgba(74, 55, 40, 0.2)" strokeWidth={1} />
          <text x={cx} y={cy + 1} textAnchor="middle" dominantBaseline="middle" fontSize="7" fontFamily={theme.fonts.display} fill={theme.colors.mediumBrown}>
            {total}
          </text>
          <text x={cx} y={cy + 9} textAnchor="middle" fontSize="4" fontFamily={theme.fonts.body} fill={theme.colors.mediumBrown}>
            quests
          </text>
        </svg>
      </SvgContainer>
      <LegendList>
        {CATEGORY_CONFIG.map((cat) => (
          <LegendItem key={cat.id}>
            <LegendDot $color={cat.color} />
            {cat.name}: {categoryCounts[cat.id] || 0}
          </LegendItem>
        ))}
      </LegendList>
    </ChartContainer>
  );
}
