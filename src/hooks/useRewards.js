import { useRewardContext } from '../context/RewardContext';
import { rollForReward, rollRewardTier, selectReward } from '../utils/rewards';
import { DIFFICULTIES } from '../constants/difficulties';
import { TALENT_PATHS } from '../constants/talents';
import { getDaysBetween } from '../utils/dates';

export function useRewards() {
  const { state, dispatch } = useRewardContext();

  function rollForQuestReward(quest, character) {
    const difficulty = DIFFICULTIES.find((d) => d.id === quest.difficulty) || DIFFICULTIES[2];

    const fortuneStat = character.stats.fortune || 10;
    const streakDays = character.streakDays || 0;

    const earned = rollForReward({
      difficulty: quest.difficulty,
      difficultyRewardMod: difficulty.rewardModifier,
      streakDays,
      fortuneStat,
    });

    if (!earned) {
      dispatch({ type: 'SET_PENDING_REWARD', payload: null });
      return null;
    }

    const talentFortune = character.talents.fortune || 0;
    const fortunePath = TALENT_PATHS.find((p) => p.id === 'fortune');
    const tierBonus =
      talentFortune > 0 && fortunePath
        ? fortunePath.ranks[talentFortune - 1].modifier.tierBonus
        : 0;

    const tier = rollRewardTier({ tierBonus });

    const availableRewards = getAvailableRewards(tier);
    const selectedReward = selectReward(
      availableRewards.length > 0 ? availableRewards : state.rewards,
      tier
    );

    if (selectedReward) {
      dispatch({ type: 'SET_PENDING_REWARD', payload: { ...selectedReward, rolledTier: tier } });
    } else {
      dispatch({ type: 'SET_PENDING_REWARD', payload: null });
    }

    return selectedReward;
  }

  function claimReward() {
    dispatch({ type: 'CLAIM_REWARD' });
  }

  function clearPending() {
    dispatch({ type: 'CLEAR_PENDING' });
  }

  function addCustomReward(rewardData) {
    dispatch({ type: 'ADD_REWARD', payload: rewardData });
  }

  function updateReward(id, updates) {
    dispatch({ type: 'UPDATE_REWARD', payload: { id, ...updates } });
  }

  function deleteReward(id) {
    dispatch({ type: 'DELETE_REWARD', payload: { id } });
  }

  function getAvailableRewards(tier) {
    const now = new Date();
    const currentMonth = now.getMonth();

    return state.rewards.filter((reward) => {
      // Filter by tier if specified
      if (tier && reward.tier !== tier) return false;

      // Check cooldown
      if (reward.cooldownDays && reward.cooldownDays > 0 && reward.lastAwarded) {
        const daysSinceAwarded = getDaysBetween(reward.lastAwarded, now);
        if (daysSinceAwarded < reward.cooldownDays) return false;
      }

      // Check seasonal availability
      if (reward.seasonal) {
        const seasonalMonths = reward.seasonal;
        if (Array.isArray(seasonalMonths) && !seasonalMonths.includes(currentMonth)) {
          return false;
        }
      }

      return true;
    });
  }

  return {
    rewards: state.rewards,
    rewardHistory: state.rewardHistory,
    pendingReward: state.pendingReward,
    rollForQuestReward,
    claimReward,
    clearPending,
    addCustomReward,
    updateReward,
    deleteReward,
    getAvailableRewards,
    dispatch,
  };
}
