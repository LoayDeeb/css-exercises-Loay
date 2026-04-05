import { useCharacterContext } from '../context/CharacterContext';
import { calculateQuestXp, levelFromXp } from '../utils/xp';
import { DIFFICULTIES } from '../constants/difficulties';
import { CHARACTER_CLASSES } from '../constants/classes';
import { TALENT_PATHS } from '../constants/talents';

export function useCharacter() {
  const { state, dispatch } = useCharacterContext();

  function createCharacter(name, title, className) {
    dispatch({
      type: 'CREATE_CHARACTER',
      payload: { name, title, className },
    });
  }

  function addXp(amount) {
    const prevLevel = levelFromXp(state.xp);
    dispatch({ type: 'ADD_XP', payload: { amount } });
    const newLevel = levelFromXp(state.xp + amount);
    return newLevel > prevLevel;
  }

  function addGold(amount) {
    dispatch({ type: 'ADD_GOLD', payload: { amount } });
  }

  function recordQuestCompletion(category) {
    dispatch({ type: 'RECORD_QUEST_COMPLETION', payload: { category } });
  }

  function completeQuest(quest) {
    const difficulty = DIFFICULTIES.find((d) => d.id === quest.difficulty) || DIFFICULTIES[2];
    const baseXp = difficulty.baseXp;

    const characterClass = CHARACTER_CLASSES.find((c) => c.id === state.className);
    const classBonuses = characterClass ? characterClass.bonuses : {};

    const today = new Date().toISOString().split('T')[0];
    const isFirstOfDay = state.lastQuestDate !== today;

    const categoryCount = state.completedQuestsByCategory[quest.category.toLowerCase()] || 0;

    const isRecurring = quest.recurrence && quest.recurrence !== 'none';
    const isHardPlus = ['hard', 'epic', 'legendary'].includes(quest.difficulty);

    const disciplineRank = state.talents.discipline || 0;
    const disciplinePath = TALENT_PATHS.find((p) => p.id === 'discipline');
    const recurringXpBonus =
      disciplineRank > 0 && disciplinePath
        ? disciplinePath.ranks[disciplineRank - 1].modifier.value
        : 0;

    const ambitionRank = state.talents.ambition || 0;
    const ambitionPath = TALENT_PATHS.find((p) => p.id === 'ambition');
    const hardQuestXpBonus =
      ambitionRank > 0 && ambitionPath
        ? ambitionPath.ranks[ambitionRank - 1].modifier.value
        : 0;

    const xpGained = calculateQuestXp(baseXp, {
      streakDays: state.streakDays,
      isFirstOfDay,
      categoryCount,
      classBonuses,
      categoryType: quest.category,
      talents: { recurringXpBonus, hardQuestXpBonus },
      isRecurring,
      isHardPlus,
    });

    // Calculate bonus objective gold bonus
    const completedBonuses = quest.bonusObjectives
      ? quest.bonusObjectives.filter((obj) => obj.completed).length
      : 0;
    const totalBonuses = quest.bonusObjectives ? quest.bonusObjectives.length : 0;
    const bonusMultiplier = totalBonuses > 0 ? 1 + completedBonuses * 0.1 : 1;

    const baseGold = Math.floor(difficulty.baseXp * 0.5);
    const goldGained = Math.floor(baseGold * bonusMultiplier);

    const prevLevel = levelFromXp(state.xp);
    const newLevel = levelFromXp(state.xp + xpGained);
    const leveledUp = newLevel > prevLevel;

    dispatch({ type: 'ADD_XP', payload: { amount: xpGained } });
    dispatch({ type: 'ADD_GOLD', payload: { amount: goldGained } });
    dispatch({ type: 'RECORD_QUEST_COMPLETION', payload: { category: quest.category } });

    return { xpGained, goldGained, leveledUp };
  }

  function failQuest() {
    dispatch({ type: 'TAKE_DAMAGE', payload: { amount: 20 } });
  }

  function abandonQuest() {
    dispatch({ type: 'TAKE_DAMAGE', payload: { amount: 10 } });
  }

  function allocateTalent(path) {
    dispatch({ type: 'ALLOCATE_TALENT', payload: { path } });
  }

  function getMaxHp() {
    const resilienceRank = state.talents.resilience || 0;
    const resiliencePath = TALENT_PATHS.find((p) => p.id === 'resilience');
    const hpBonus =
      resilienceRank > 0 && resiliencePath
        ? resiliencePath.ranks[resilienceRank - 1].modifier.hpBonus
        : 0;
    return 100 + state.stats.vitality * 5 + hpBonus;
  }

  function getMaxMp() {
    return 50 + state.stats.wisdom * 3;
  }

  function getDerivedStats() {
    const level = levelFromXp(state.xp);
    const maxHp = getMaxHp();
    const maxMp = getMaxMp();

    const fortuneStat = state.stats.fortune;
    const talentFortune = state.talents.fortune || 0;
    const goldModifier = 1 + (fortuneStat - 10) * 0.01 + talentFortune * 0.15;

    const wisdomRank = state.talents.wisdom || 0;
    const wisdomPath = TALENT_PATHS.find((p) => p.id === 'wisdom');
    const mpReduction =
      wisdomRank > 0 && wisdomPath
        ? wisdomPath.ranks[wisdomRank - 1].modifier.value
        : 0;

    const resilienceRank = state.talents.resilience || 0;
    const resiliencePath = TALENT_PATHS.find((p) => p.id === 'resilience');
    const failureReduction =
      resilienceRank > 0 && resiliencePath
        ? resiliencePath.ranks[resilienceRank - 1].modifier.failureReduction
        : 0;

    const disciplineRank = state.talents.discipline || 0;
    const disciplinePath = TALENT_PATHS.find((p) => p.id === 'discipline');
    const recurringXpBonus =
      disciplineRank > 0 && disciplinePath
        ? disciplinePath.ranks[disciplineRank - 1].modifier.value
        : 0;

    const ambitionRank = state.talents.ambition || 0;
    const ambitionPath = TALENT_PATHS.find((p) => p.id === 'ambition');
    const hardQuestXpBonus =
      ambitionRank > 0 && ambitionPath
        ? ambitionPath.ranks[ambitionRank - 1].modifier.value
        : 0;

    const fortunePath = TALENT_PATHS.find((p) => p.id === 'fortune');
    const tierBonus =
      talentFortune > 0 && fortunePath
        ? fortunePath.ranks[talentFortune - 1].modifier.tierBonus
        : 0;

    return {
      level,
      maxHp,
      maxMp,
      goldModifier,
      mpReduction,
      failureReduction,
      recurringXpBonus,
      hardQuestXpBonus,
      tierBonus,
      streakBonus: Math.min(state.streakDays * 0.1, 1.0),
    };
  }

  return {
    character: state,
    createCharacter,
    completeQuest,
    failQuest,
    abandonQuest,
    allocateTalent,
    addXp,
    addGold,
    getMaxHp,
    getMaxMp,
    getDerivedStats,
    dispatch,
  };
}
