import styled from 'styled-components';
import { useQuestContext } from '../../context/QuestContext';
import theme from '../../theme';

const Log = styled.div`
  padding: 5px;
`;

const PageTitle = styled.h2`
  font-family: ${theme.fonts.display};
  font-size: 1.3rem;
  color: ${theme.colors.darkBrown};
  margin: 0 0 16px;
`;

const EntryList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

const Entry = styled.div`
  padding-bottom: 14px;
  border-bottom: 1px solid rgba(74, 55, 40, 0.1);

  &:last-child {
    border-bottom: none;
  }
`;

const EntryDate = styled.div`
  font-family: ${theme.fonts.handwritten};
  font-size: 0.8rem;
  color: ${theme.colors.mediumBrown};
  margin-bottom: 4px;
`;

const EntryTitle = styled.div`
  font-family: ${theme.fonts.display};
  font-size: 0.95rem;
  color: ${theme.colors.darkBrown};
  margin-bottom: 2px;
`;

const EntryStatus = styled.span`
  font-family: ${theme.fonts.body};
  font-size: 0.8rem;
  color: ${({ $status }) => {
    switch ($status) {
      case 'completed': return '#2d6a2d';
      case 'failed': return '#8b0000';
      case 'abandoned': return '#666';
      default: return theme.colors.mediumBrown;
    }
  }};
  font-style: italic;
`;

const EntryDesc = styled.p`
  font-family: ${theme.fonts.handwritten};
  font-size: 0.95rem;
  color: ${theme.colors.mediumBrown};
  margin: 4px 0 0;
  line-height: 1.4;
  font-style: italic;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 40px 20px;
`;

const EmptyIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 12px;
  opacity: 0.3;
`;

const EmptyText = styled.p`
  font-family: ${theme.fonts.handwritten};
  font-size: 1.1rem;
  color: ${theme.colors.mediumBrown};
  font-style: italic;
`;

function formatDate(isoString) {
  if (!isoString) return '';
  const d = new Date(isoString);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}

const STATUS_TEXT = {
  completed: 'Quest Completed',
  failed: 'Quest Failed',
  abandoned: 'Quest Abandoned',
};

export default function QuestLog() {
  const { state } = useQuestContext();
  const history = [...state.questHistory].sort(
    (a, b) => new Date(b.completedAt || b.createdAt) - new Date(a.completedAt || a.createdAt)
  );

  return (
    <Log>
      <PageTitle>Quest Log</PageTitle>

      {history.length > 0 ? (
        <EntryList>
          {history.map((quest) => (
            <Entry key={quest.id}>
              <EntryDate>{formatDate(quest.completedAt || quest.createdAt)}</EntryDate>
              <EntryTitle>
                {quest.title}{' '}
                <EntryStatus $status={quest.status}>
                  — {STATUS_TEXT[quest.status] || quest.status}
                </EntryStatus>
              </EntryTitle>
              {quest.description && (
                <EntryDesc>"{quest.description}"</EntryDesc>
              )}
            </Entry>
          ))}
        </EntryList>
      ) : (
        <EmptyState>
          <EmptyIcon>📖</EmptyIcon>
          <EmptyText>
            Your journal is empty. Complete quests to fill its pages with tales of your adventures.
          </EmptyText>
        </EmptyState>
      )}
    </Log>
  );
}
