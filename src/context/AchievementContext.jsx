import { createContext, useContext, useReducer, useEffect } from 'react';
import { loadState, saveState, STORAGE_KEYS } from '../utils/storage';

const AchievementContext = createContext(null);

const DEFAULT_STATE = {
  unlockedAchievements: [],
  newlyUnlocked: null,
};

function achievementReducer(state, action) {
  switch (action.type) {
    case 'UNLOCK_ACHIEVEMENT': {
      const { id } = action.payload;
      if (state.unlockedAchievements.includes(id)) {
        return state;
      }
      return {
        ...state,
        unlockedAchievements: [...state.unlockedAchievements, id],
        newlyUnlocked: id,
      };
    }

    case 'CLEAR_NEW': {
      return { ...state, newlyUnlocked: null };
    }

    case 'IMPORT_STATE': {
      return { ...DEFAULT_STATE, ...action.payload };
    }

    default:
      return state;
  }
}

export function AchievementProvider({ children }) {
  const [state, dispatch] = useReducer(
    achievementReducer,
    DEFAULT_STATE,
    () => loadState(STORAGE_KEYS.ACHIEVEMENTS, DEFAULT_STATE)
  );

  useEffect(() => {
    saveState(STORAGE_KEYS.ACHIEVEMENTS, state);
  }, [state]);

  return (
    <AchievementContext.Provider value={{ state, dispatch }}>
      {children}
    </AchievementContext.Provider>
  );
}

export function useAchievementContext() {
  const context = useContext(AchievementContext);
  if (!context) {
    throw new Error('useAchievementContext must be used within an AchievementProvider');
  }
  return context;
}
