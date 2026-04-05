import { useQuestContext } from '../context/QuestContext';
import { isOverdue } from '../utils/dates';

export function useQuests() {
  const { state, dispatch } = useQuestContext();

  function addQuest(questData) {
    dispatch({ type: 'ADD_QUEST', payload: questData });
  }

  function startQuest(id) {
    dispatch({ type: 'START_QUEST', payload: { id } });
  }

  function completeQuest(id) {
    dispatch({ type: 'COMPLETE_QUEST', payload: { id } });
  }

  function failQuest(id) {
    dispatch({ type: 'FAIL_QUEST', payload: { id } });
  }

  function abandonQuest(id) {
    dispatch({ type: 'ABANDON_QUEST', payload: { id } });
  }

  function toggleBonusObjective(questId, objectiveId) {
    dispatch({ type: 'TOGGLE_BONUS_OBJECTIVE', payload: { questId, objectiveId } });
  }

  function deleteQuest(id) {
    dispatch({ type: 'DELETE_QUEST', payload: { id } });
  }

  function getActiveQuests() {
    return state.quests.filter(
      (q) => q.status === 'available' || q.status === 'in_progress'
    );
  }

  function getQuestsByCategory(category) {
    return state.quests.filter(
      (q) => q.category.toLowerCase() === category.toLowerCase()
    );
  }

  function getOverdueQuests() {
    return state.quests.filter(
      (q) =>
        (q.status === 'available' || q.status === 'in_progress') &&
        q.dueDate &&
        isOverdue(q.dueDate)
    );
  }

  function getQuestById(id) {
    return (
      state.quests.find((q) => q.id === id) ||
      state.questHistory.find((q) => q.id === id) ||
      null
    );
  }

  return {
    quests: state.quests,
    questHistory: state.questHistory,
    addQuest,
    startQuest,
    completeQuest,
    failQuest,
    abandonQuest,
    toggleBonusObjective,
    deleteQuest,
    getActiveQuests,
    getQuestsByCategory,
    getOverdueQuests,
    getQuestById,
    dispatch,
  };
}
