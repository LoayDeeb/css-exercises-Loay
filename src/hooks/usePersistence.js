import { useCharacterContext } from '../context/CharacterContext';
import { useQuestContext } from '../context/QuestContext';
import { useRewardContext } from '../context/RewardContext';
import { useAchievementContext } from '../context/AchievementContext';
import { loadState, saveState, STORAGE_KEYS, clearAllData } from '../utils/storage';

export function usePersistence() {
  const { state: characterState, dispatch: characterDispatch } = useCharacterContext();
  const { state: questState, dispatch: questDispatch } = useQuestContext();
  const { state: rewardState, dispatch: rewardDispatch } = useRewardContext();
  const { state: achievementState, dispatch: achievementDispatch } = useAchievementContext();

  function exportData() {
    const data = {
      character: characterState,
      quests: questState,
      rewards: rewardState,
      achievements: achievementState,
      _exportedAt: new Date().toISOString(),
      _version: 1,
    };
    return JSON.stringify(data, null, 2);
  }

  function importData(json) {
    let data;
    try {
      data = typeof json === 'string' ? JSON.parse(json) : json;
    } catch (error) {
      throw new Error('Invalid JSON: could not parse the import data.');
    }

    if (typeof data !== 'object' || data === null) {
      throw new Error('Invalid import data: expected an object.');
    }

    if (data.character) {
      characterDispatch({ type: 'IMPORT_STATE', payload: data.character });
    }
    if (data.quests) {
      questDispatch({ type: 'IMPORT_STATE', payload: data.quests });
    }
    if (data.rewards) {
      rewardDispatch({ type: 'IMPORT_STATE', payload: data.rewards });
    }
    if (data.achievements) {
      achievementDispatch({ type: 'IMPORT_STATE', payload: data.achievements });
    }
  }

  function resetAll() {
    clearAllData();
    window.location.reload();
  }

  return {
    exportData,
    importData,
    resetAll,
  };
}
