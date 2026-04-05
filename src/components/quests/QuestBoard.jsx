import { useState } from 'react';
import styled from 'styled-components';
import { AnimatePresence } from 'framer-motion';
import { useQuestContext } from '../../context/QuestContext';
import QuestCard from './QuestCard';
import theme from '../../theme';

const Board = styled.div`
  padding: 5px;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
`;

const PageTitle = styled.h2`
  font-family: ${theme.fonts.display};
  font-size: 1.3rem;
  color: ${theme.colors.darkBrown};
  margin: 0;
`;

const NewQuestBtn = styled.button`
  font-family: ${theme.fonts.display};
  font-size: 0.65rem;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: ${theme.colors.lightText};
  background: linear-gradient(135deg, ${theme.colors.darkBrown}, ${theme.colors.mediumBrown});
  border: 1px solid ${theme.colors.gold}55;
  border-radius: 3px;
  padding: 6px 14px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    box-shadow: 0 0 10px rgba(212, 175, 55, 0.3);
    border-color: ${theme.colors.gold};
  }
`;

const FilterRow = styled.div`
  display: flex;
  gap: 6px;
  margin-bottom: 14px;
  flex-wrap: wrap;
`;

const FilterBtn = styled.button`
  font-family: ${theme.fonts.display};
  font-size: 0.55rem;
  letter-spacing: 1px;
  text-transform: uppercase;
  padding: 4px 10px;
  border-radius: 2px;
  border: 1px solid ${({ $active }) => $active ? theme.colors.gold : 'rgba(74, 55, 40, 0.2)'};
  background: ${({ $active }) => $active ? `${theme.colors.gold}15` : 'transparent'};
  color: ${({ $active }) => $active ? theme.colors.darkBrown : theme.colors.mediumBrown};
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: ${theme.colors.gold};
  }
`;

const QuestList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
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

const FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'health', label: '❤️ Health' },
  { id: 'intelligence', label: '📖 Intel' },
  { id: 'money', label: '💰 Money' },
  { id: 'relationships', label: '💍 Social' },
];

export default function QuestBoard({ onNewQuest, onSelectQuest }) {
  const { state } = useQuestContext();
  const [filter, setFilter] = useState('all');

  const activeQuests = state.quests.filter(
    (q) => q.status === 'available' || q.status === 'in_progress'
  );

  const filtered = filter === 'all'
    ? activeQuests
    : activeQuests.filter((q) => q.category === filter);

  const inProgress = filtered.filter((q) => q.status === 'in_progress');
  const available = filtered.filter((q) => q.status === 'available');
  const sortedQuests = [...inProgress, ...available];

  return (
    <Board>
      <Header>
        <PageTitle>Active Quests</PageTitle>
        <NewQuestBtn onClick={onNewQuest}>+ New Quest</NewQuestBtn>
      </Header>

      <FilterRow>
        {FILTERS.map((f) => (
          <FilterBtn
            key={f.id}
            $active={filter === f.id}
            onClick={() => setFilter(f.id)}
          >
            {f.label}
          </FilterBtn>
        ))}
      </FilterRow>

      <QuestList>
        <AnimatePresence>
          {sortedQuests.length > 0 ? (
            sortedQuests.map((quest) => (
              <QuestCard key={quest.id} quest={quest} onClick={onSelectQuest} />
            ))
          ) : (
            <EmptyState>
              <EmptyIcon>📜</EmptyIcon>
              <EmptyText>
                {filter === 'all'
                  ? "No quests on the board. Create one to begin your adventure!"
                  : "No quests in this category. Try a different filter."}
              </EmptyText>
            </EmptyState>
          )}
        </AnimatePresence>
      </QuestList>
    </Board>
  );
}
