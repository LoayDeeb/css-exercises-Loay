/**
 * Reward rolling and selection logic for the Fantasy RPG Quest Manager.
 */

import { REWARD_TIERS } from '../constants/rewards';

/**
 * Determines whether a reward is triggered upon quest completion.
 *
 * Base chance: 70%
 * Difficulty modifier: applied from the difficulty's rewardModifier
 *   - Legendary difficulty always returns true (guaranteed reward)
 * Streak bonus: +1% per streak day, capped at +10%
 * Fortune stat bonus: +0.5% per point above 10
 *
 * @param {object} options
 * @param {string} [options.difficulty='medium'] - The quest's difficulty id
 * @param {number} [options.difficultyRewardMod=0] - The difficulty's reward modifier (-0.2 to 1.0)
 * @param {number} [options.streakDays=0] - Current streak in days
 * @param {number} [options.fortuneStat=10] - The player's fortune stat (default baseline 10)
 * @returns {boolean} Whether a reward is earned
 */
export function rollForReward({ difficulty = 'medium', difficultyRewardMod = 0, streakDays = 0, fortuneStat = 10 } = {}) {
  // Legendary always rewards
  if (difficulty === 'legendary') {
    return true;
  }

  const baseChance = 0.7;

  // Difficulty modifier adjusts base chance
  const difficultyBonus = difficultyRewardMod;

  // Streak bonus: +1% per day, max +10%
  const streakBonus = Math.min(streakDays * 0.01, 0.1);

  // Fortune bonus: +0.5% per point above 10
  const fortuneBonus = fortuneStat > 10 ? (fortuneStat - 10) * 0.005 : 0;

  const totalChance = Math.min(baseChance + difficultyBonus + streakBonus + fortuneBonus, 1);

  return Math.random() < totalChance;
}

/**
 * Rolls for a reward tier based on the tier probability distribution.
 *
 * Common:    50%
 * Uncommon:  30%
 * Rare:      15%
 * Epic:       4%
 * Legendary:  1%
 *
 * @param {object} [options]
 * @param {number} [options.tierBonus=0] - Fortune talent bonus that shifts probabilities upward
 * @returns {string} The tier name (e.g., 'Common', 'Uncommon', 'Rare', 'Epic', 'Legendary')
 */
export function rollRewardTier({ tierBonus = 0 } = {}) {
  const roll = Math.random();

  // Tier thresholds (cumulative from the top)
  // tierBonus shifts chances toward better tiers
  const legendaryThreshold = 1 - (REWARD_TIERS.Legendary.chance + tierBonus * 0.5);
  const epicThreshold = legendaryThreshold - (REWARD_TIERS.Epic.chance + tierBonus);
  const rareThreshold = epicThreshold - (REWARD_TIERS.Rare.chance + tierBonus * 2);
  const uncommonThreshold = rareThreshold - (REWARD_TIERS.Uncommon.chance + tierBonus * 2);

  if (roll >= legendaryThreshold) return 'Legendary';
  if (roll >= epicThreshold) return 'Epic';
  if (roll >= rareThreshold) return 'Rare';
  if (roll >= uncommonThreshold) return 'Uncommon';
  return 'Common';
}

/**
 * Selects a random reward from the available rewards matching the given tier.
 * If no rewards match the tier, falls back to the next lower tier, then Common.
 *
 * @param {Array} rewards - Array of reward objects with a `tier` property
 * @param {string} tier - The target tier to select from
 * @returns {object|null} A randomly selected reward, or null if no rewards available
 */
export function selectReward(rewards, tier) {
  if (!rewards || rewards.length === 0) return null;

  const tierOrder = ['Legendary', 'Epic', 'Rare', 'Uncommon', 'Common'];
  const startIndex = tierOrder.indexOf(tier);

  // Try the requested tier, then fall back to lower tiers
  for (let i = startIndex; i < tierOrder.length; i++) {
    const candidates = rewards.filter((r) => r.tier === tierOrder[i]);
    if (candidates.length > 0) {
      const randomIndex = Math.floor(Math.random() * candidates.length);
      return candidates[randomIndex];
    }
  }

  // If still nothing found, pick any reward
  const randomIndex = Math.floor(Math.random() * rewards.length);
  return rewards[randomIndex];
}
