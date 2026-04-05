import { createContext, useContext, useReducer, useEffect } from 'react';
import { loadState, saveState, STORAGE_KEYS } from '../utils/storage';
import { DEFAULT_REWARDS } from '../constants/rewards';

const RewardContext = createContext(null);

const DEFAULT_STATE = {
  rewards: DEFAULT_REWARDS,
  rewardHistory: [],
  pendingReward: null,
};

function rewardReducer(state, action) {
  switch (action.type) {
    case 'ADD_REWARD': {
      const newReward = {
        id: action.payload.id,
        name: action.payload.name || '',
        tier: action.payload.tier || 'Common',
        category: action.payload.category || 'custom',
        cooldownDays: action.payload.cooldownDays || 0,
        seasonal: action.payload.seasonal || false,
        lastAwarded: action.payload.lastAwarded || null,
        ...action.payload,
      };
      return { ...state, rewards: [...state.rewards, newReward] };
    }

    case 'UPDATE_REWARD': {
      const { id, ...updates } = action.payload;
      return {
        ...state,
        rewards: state.rewards.map((r) => (r.id === id ? { ...r, ...updates } : r)),
      };
    }

    case 'DELETE_REWARD': {
      const deleteId = typeof action.payload === 'string' ? action.payload : action.payload.id;
      return {
        ...state,
        rewards: state.rewards.filter((r) => r.id !== deleteId),
      };
    }

    case 'SET_PENDING_REWARD': {
      return { ...state, pendingReward: action.payload };
    }

    case 'CLAIM_REWARD': {
      if (!state.pendingReward) return state;

      const claimedReward = {
        ...state.pendingReward,
        claimedAt: new Date().toISOString(),
      };

      const updatedRewards = state.rewards.map((r) =>
        r.id === state.pendingReward.id
          ? { ...r, lastAwarded: new Date().toISOString() }
          : r
      );

      return {
        ...state,
        rewards: updatedRewards,
        rewardHistory: [...state.rewardHistory, claimedReward],
        pendingReward: null,
      };
    }

    case 'CLEAR_PENDING': {
      return { ...state, pendingReward: null };
    }

    case 'IMPORT_STATE': {
      return { ...DEFAULT_STATE, ...action.payload };
    }

    default:
      return state;
  }
}

export function RewardProvider({ children }) {
  const [state, dispatch] = useReducer(
    rewardReducer,
    DEFAULT_STATE,
    () => loadState(STORAGE_KEYS.REWARDS, DEFAULT_STATE)
  );

  useEffect(() => {
    saveState(STORAGE_KEYS.REWARDS, state);
  }, [state]);

  return (
    <RewardContext.Provider value={{ state, dispatch }}>
      {children}
    </RewardContext.Provider>
  );
}

export function useRewardContext() {
  const context = useContext(RewardContext);
  if (!context) {
    throw new Error('useRewardContext must be used within a RewardProvider');
  }
  return context;
}
