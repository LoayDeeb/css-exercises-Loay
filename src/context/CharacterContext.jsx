import { createContext, useContext, useReducer, useEffect } from 'react';
import { loadState, saveState, STORAGE_KEYS } from '../utils/storage';
import { levelFromXp } from '../utils/xp';
import { TALENT_PATHS } from '../constants/talents';

const CharacterContext = createContext(null);

const DEFAULT_STATE = {
  created: false,
  name: '',
  title: '',
  className: '',
  stats: { vitality: 10, wisdom: 10, fortune: 10, charisma: 10 },
  xp: 0,
  gold: 0,
  hp: 150,
  mp: 80,
  talentPoints: 0,
  talents: { discipline: 0, ambition: 0, fortune: 0, wisdom: 0, resilience: 0 },
  streakDays: 0,
  lastActiveDate: null,
  completedQuestsByCategory: { health: 0, intelligence: 0, money: 0, relationships: 0 },
  questsCompletedToday: 0,
  lastQuestDate: null,
};

function getMaxHp(stats, talents) {
  const resilienceRank = talents.resilience || 0;
  const resiliencePath = TALENT_PATHS.find((p) => p.id === 'resilience');
  const hpBonus = resilienceRank > 0 && resiliencePath
    ? resiliencePath.ranks[resilienceRank - 1].modifier.hpBonus
    : 0;
  return 100 + stats.vitality * 5 + hpBonus;
}

function getMaxMp(stats) {
  return 50 + stats.wisdom * 3;
}

function characterReducer(state, action) {
  switch (action.type) {
    case 'CREATE_CHARACTER': {
      const newState = {
        ...DEFAULT_STATE,
        created: true,
        name: action.payload.name,
        title: action.payload.title,
        className: action.payload.className,
        hp: getMaxHp(DEFAULT_STATE.stats, DEFAULT_STATE.talents),
        mp: getMaxMp(DEFAULT_STATE.stats),
      };
      return newState;
    }

    case 'ADD_XP': {
      const prevLevel = levelFromXp(state.xp);
      const amount = typeof action.payload === 'number' ? action.payload : action.payload.amount;
      const newXp = state.xp + amount;
      const newLevel = levelFromXp(newXp);
      const levelsGained = newLevel - prevLevel;

      if (levelsGained <= 0) {
        return { ...state, xp: newXp };
      }

      // Apply level-up bonuses: +1 all stats per level
      const newStats = { ...state.stats };
      Object.keys(newStats).forEach((key) => {
        newStats[key] += levelsGained;
      });

      // Every 5 levels grants a talent point
      const talentPointsGained = Math.floor(newLevel / 5) - Math.floor(prevLevel / 5);

      const maxHp = getMaxHp(newStats, state.talents);
      const maxMp = getMaxMp(newStats);

      return {
        ...state,
        xp: newXp,
        stats: newStats,
        hp: maxHp,
        mp: maxMp,
        talentPoints: state.talentPoints + talentPointsGained,
      };
    }

    case 'ADD_GOLD': {
      const goldAmount = typeof action.payload === 'number' ? action.payload : action.payload.amount;
      const adjustedGold = goldAmount;
      return { ...state, gold: state.gold + adjustedGold };
    }

    case 'TAKE_DAMAGE': {
      const dmgAmount = typeof action.payload === 'number' ? action.payload : action.payload.amount;
      const resilienceRank = state.talents.resilience || 0;
      const resiliencePath = TALENT_PATHS.find((p) => p.id === 'resilience');
      const failureReduction = resilienceRank > 0 && resiliencePath && resiliencePath.ranks[resilienceRank - 1]?.modifier?.failureReduction
        ? resiliencePath.ranks[resilienceRank - 1].modifier.failureReduction
        : 0;
      const damage = Math.floor(dmgAmount * (1 - failureReduction));
      return { ...state, hp: Math.max(0, state.hp - damage) };
    }

    case 'SPEND_MP': {
      const mpAmount = typeof action.payload === 'number' ? action.payload : action.payload.amount;
      return { ...state, mp: Math.max(0, state.mp - mpAmount) };
    }

    case 'RESTORE_HP_MP': {
      return {
        ...state,
        hp: getMaxHp(state.stats, state.talents),
        mp: getMaxMp(state.stats),
      };
    }

    case 'UPDATE_STREAK': {
      const today = new Date().toISOString().split('T')[0];
      const lastActive = state.lastActiveDate;

      if (!lastActive) {
        return { ...state, streakDays: 1, lastActiveDate: today };
      }

      if (lastActive === today) {
        return state;
      }

      const lastDate = new Date(lastActive);
      const todayDate = new Date(today);
      const diffMs = todayDate - lastDate;
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        return { ...state, streakDays: state.streakDays + 1, lastActiveDate: today };
      }

      // Streak broken
      return { ...state, streakDays: 1, lastActiveDate: today };
    }

    case 'RECORD_QUEST_COMPLETION': {
      const category = typeof action.payload === 'string' ? action.payload : action.payload.category;
      const today = new Date().toISOString().split('T')[0];
      const normalizedCategory = category.toLowerCase();

      const isNewDay = state.lastQuestDate !== today;

      return {
        ...state,
        completedQuestsByCategory: {
          ...state.completedQuestsByCategory,
          [normalizedCategory]: (state.completedQuestsByCategory[normalizedCategory] || 0) + 1,
        },
        questsCompletedToday: isNewDay ? 1 : state.questsCompletedToday + 1,
        lastQuestDate: today,
      };
    }

    case 'ALLOCATE_TALENT': {
      const { path } = action.payload;
      if (state.talentPoints <= 0) return state;

      const talentPath = TALENT_PATHS.find((p) => p.id === path);
      if (!talentPath) return state;

      const currentRank = state.talents[path] || 0;
      if (currentRank >= talentPath.maxRanks) return state;

      const newTalents = { ...state.talents, [path]: currentRank + 1 };

      // Recalculate HP/MP if resilience changed
      const maxHp = getMaxHp(state.stats, newTalents);

      return {
        ...state,
        talents: newTalents,
        talentPoints: state.talentPoints - 1,
        hp: path === 'resilience' ? maxHp : state.hp,
      };
    }

    case 'IMPORT_STATE': {
      return { ...DEFAULT_STATE, ...action.payload };
    }

    default:
      return state;
  }
}

export function CharacterProvider({ children }) {
  const [state, dispatch] = useReducer(
    characterReducer,
    DEFAULT_STATE,
    () => loadState(STORAGE_KEYS.CHARACTER, DEFAULT_STATE)
  );

  useEffect(() => {
    saveState(STORAGE_KEYS.CHARACTER, state);
  }, [state]);

  return (
    <CharacterContext.Provider value={{ state, dispatch }}>
      {children}
    </CharacterContext.Provider>
  );
}

export function useCharacterContext() {
  const context = useContext(CharacterContext);
  if (!context) {
    throw new Error('useCharacterContext must be used within a CharacterProvider');
  }
  return context;
}
