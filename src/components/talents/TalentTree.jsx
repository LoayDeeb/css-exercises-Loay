import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useCharacterContext } from '../../context/CharacterContext';
import { TALENT_PATHS } from '../../constants/talents';
import theme from '../../theme';

const Tree = styled.div`
  padding: 5px;
`;

const PageTitle = styled.h2`
  font-family: ${theme.fonts.display};
  font-size: 1.3rem;
  color: ${theme.colors.darkBrown};
  margin: 0 0 4px;
`;

const PointsDisplay = styled.div`
  font-family: ${theme.fonts.handwritten};
  font-size: 1rem;
  color: ${theme.colors.gold};
  margin-bottom: 20px;
`;

const PathList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const PathCard = styled.div`
  background: rgba(74, 55, 40, 0.04);
  border: 1px solid rgba(74, 55, 40, 0.12);
  border-radius: 4px;
  padding: 14px;
`;

const PathHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
`;

const PathIcon = styled.span`
  font-size: 1.5rem;
`;

const PathInfo = styled.div`
  flex: 1;
`;

const PathName = styled.div`
  font-family: ${theme.fonts.display};
  font-size: 0.9rem;
  color: ${theme.colors.darkBrown};
  font-weight: 700;
`;

const PathDesc = styled.div`
  font-family: ${theme.fonts.handwritten};
  font-size: 0.85rem;
  color: ${theme.colors.mediumBrown};
`;

const RankRow = styled.div`
  display: flex;
  gap: 6px;
  margin-top: 8px;
`;

const RankNode = styled(motion.button)`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 2px solid ${({ $active, $available }) =>
    $active ? theme.colors.gold : $available ? theme.colors.mediumBrown : 'rgba(74, 55, 40, 0.15)'};
  background: ${({ $active }) =>
    $active ? `linear-gradient(135deg, ${theme.colors.gold}44, ${theme.colors.goldBright}22)` : 'rgba(255, 255, 255, 0.2)'};
  color: ${({ $active }) => $active ? theme.colors.gold : theme.colors.mediumBrown};
  font-family: ${theme.fonts.display};
  font-size: 0.7rem;
  font-weight: 700;
  cursor: ${({ $available }) => $available ? 'pointer' : 'default'};
  opacity: ${({ $active, $available }) => $active || $available ? 1 : 0.4};
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    ${({ $available }) => $available && `
      border-color: ${theme.colors.gold};
      box-shadow: 0 0 8px rgba(212, 175, 55, 0.3);
    `}
  }
`;

const Connector = styled.div`
  width: 12px;
  height: 2px;
  background: ${({ $active }) => $active ? theme.colors.gold : 'rgba(74, 55, 40, 0.15)'};
  align-self: center;
`;

const CurrentEffect = styled.div`
  font-family: ${theme.fonts.body};
  font-size: 0.8rem;
  color: ${theme.colors.gold};
  margin-top: 8px;
  font-style: italic;
`;

export default function TalentTree() {
  const { state, dispatch } = useCharacterContext();
  const { talentPoints, talents } = state;

  const handleAllocate = (pathId) => {
    if (talentPoints <= 0) return;
    const current = talents[pathId] || 0;
    const pathConfig = TALENT_PATHS.find((p) => p.id === pathId);
    if (current >= pathConfig.maxRanks) return;

    dispatch({
      type: 'ALLOCATE_TALENT',
      payload: { path: pathId },
    });
  };

  return (
    <Tree>
      <PageTitle>Talent Tree</PageTitle>
      <PointsDisplay>
        Available Points: {talentPoints}
      </PointsDisplay>

      <PathList>
        {TALENT_PATHS.map((path) => {
          const currentRank = talents[path.id] || 0;
          return (
            <PathCard key={path.id}>
              <PathHeader>
                <PathIcon>{path.icon}</PathIcon>
                <PathInfo>
                  <PathName>{path.name}</PathName>
                  <PathDesc>{path.description}</PathDesc>
                </PathInfo>
              </PathHeader>

              <RankRow>
                {path.ranks.map((rank, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center' }}>
                    {i > 0 && <Connector $active={i < currentRank} />}
                    <RankNode
                      $active={i < currentRank}
                      $available={i === currentRank && talentPoints > 0}
                      onClick={() => i === currentRank && handleAllocate(path.id)}
                      whileTap={i === currentRank && talentPoints > 0 ? { scale: 0.9 } : undefined}
                      title={rank.effect}
                    >
                      {i + 1}
                    </RankNode>
                  </div>
                ))}
              </RankRow>

              {currentRank > 0 && (
                <CurrentEffect>
                  Current: {path.ranks[currentRank - 1].effect}
                </CurrentEffect>
              )}
            </PathCard>
          );
        })}
      </PathList>
    </Tree>
  );
}
