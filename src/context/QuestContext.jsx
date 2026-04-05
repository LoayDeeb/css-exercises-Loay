import { createContext, useContext, useReducer, useEffect } from 'react';
import { loadState, saveState, STORAGE_KEYS } from '../utils/storage';
import { v4 as uuidv4 } from 'uuid';

const QuestContext = createContext(null);

const DEFAULT_STATE = {
  quests: [],
  questHistory: [],
};

function questReducer(state, action) {
  switch (action.type) {
    case 'ADD_QUEST': {
      const newQuest = {
        id: uuidv4(),
        title: '',
        description: '',
        category: 'health',
        difficulty: 'medium',
        status: 'available',
        dueDate: null,
        recurrence: 'none',
        prerequisites: [],
        bonusObjectives: [],
        createdAt: new Date().toISOString(),
        completedAt: null,
        chainId: null,
        ...action.payload,
        id: action.payload.id || uuidv4(),
        createdAt: action.payload.createdAt || new Date().toISOString(),
      };
      return { ...state, quests: [...state.quests, newQuest] };
    }

    case 'UPDATE_QUEST': {
      const { id, ...updates } = action.payload;
      return {
        ...state,
        quests: state.quests.map((q) => (q.id === id ? { ...q, ...updates } : q)),
      };
    }

    case 'START_QUEST': {
      const startId = typeof action.payload === 'string' ? action.payload : action.payload.id;
      return {
        ...state,
        quests: state.quests.map((q) =>
          q.id === startId ? { ...q, status: 'in_progress' } : q
        ),
      };
    }

    case 'COMPLETE_QUEST': {
      const completeId = typeof action.payload === 'string' ? action.payload : action.payload.id;
      const quest = state.quests.find((q) => q.id === completeId);
      if (!quest) return state;

      const completedQuest = {
        ...quest,
        status: 'completed',
        completedAt: new Date().toISOString(),
      };

      return {
        ...state,
        quests: state.quests.filter((q) => q.id !== completeId),
        questHistory: [...state.questHistory, completedQuest],
      };
    }

    case 'FAIL_QUEST': {
      const failId = typeof action.payload === 'string' ? action.payload : action.payload.id;
      const failQuest = state.quests.find((q) => q.id === failId);
      if (!failQuest) return state;

      const failedQuest = { ...failQuest, status: 'failed' };

      return {
        ...state,
        quests: state.quests.filter((q) => q.id !== failId),
        questHistory: [...state.questHistory, failedQuest],
      };
    }

    case 'ABANDON_QUEST': {
      const abandonId = typeof action.payload === 'string' ? action.payload : action.payload.id;
      const abandonQuest = state.quests.find((q) => q.id === abandonId);
      if (!abandonQuest) return state;

      const abandonedQuest = { ...abandonQuest, status: 'abandoned' };

      return {
        ...state,
        quests: state.quests.filter((q) => q.id !== abandonId),
        questHistory: [...state.questHistory, abandonedQuest],
      };
    }

    case 'TOGGLE_BONUS_OBJECTIVE': {
      const { questId, objectiveId } = action.payload;
      return {
        ...state,
        quests: state.quests.map((q) => {
          if (q.id !== questId) return q;
          return {
            ...q,
            bonusObjectives: q.bonusObjectives.map((obj) =>
              obj.id === objectiveId ? { ...obj, completed: !obj.completed } : obj
            ),
          };
        }),
      };
    }

    case 'DELETE_QUEST': {
      const deleteId = typeof action.payload === 'string' ? action.payload : action.payload.id;
      return {
        ...state,
        quests: state.quests.filter((q) => q.id !== deleteId),
      };
    }

    case 'IMPORT_STATE': {
      return { ...DEFAULT_STATE, ...action.payload };
    }

    default:
      return state;
  }
}

export function QuestProvider({ children }) {
  const [state, dispatch] = useReducer(
    questReducer,
    DEFAULT_STATE,
    () => loadState(STORAGE_KEYS.QUESTS, DEFAULT_STATE)
  );

  useEffect(() => {
    saveState(STORAGE_KEYS.QUESTS, state);
  }, [state]);

  return (
    <QuestContext.Provider value={{ state, dispatch }}>
      {children}
    </QuestContext.Provider>
  );
}

export function useQuestContext() {
  const context = useContext(QuestContext);
  if (!context) {
    throw new Error('useQuestContext must be used within a QuestProvider');
  }
  return context;
}
