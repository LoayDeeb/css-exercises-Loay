/**
 * XP and leveling calculations for the Fantasy RPG Quest Manager.
 */

/**
 * Returns the XP needed to advance from level (n-1) to level n.
 * Formula: n^2 * 50 + n * 50
 * @param {number} n - The target level (must be >= 1)
 * @returns {number} XP required for that level
 */
export function xpForLevel(n) {
  if (n <= 0) return 0;
  return n * n * 50 + n * 50;
}

/**
 * Returns the cumulative XP required to reach level n (from level 0).
 * This is the sum of xpForLevel(1) + xpForLevel(2) + ... + xpForLevel(n).
 * @param {number} n - The target level
 * @returns {number} Total cumulative XP
 */
export function totalXpForLevel(n) {
  if (n <= 0) return 0;
  let total = 0;
  for (let i = 1; i <= n; i++) {
    total += xpForLevel(i);
  }
  return total;
}

/**
 * Returns the current level for a given total XP amount.
 * @param {number} totalXp - The player's total accumulated XP
 * @returns {number} The current level
 */
export function levelFromXp(totalXp) {
  if (totalXp <= 0) return 0;
  let level = 0;
  let accumulated = 0;
  while (true) {
    const nextLevelCost = xpForLevel(level + 1);
    if (accumulated + nextLevelCost > totalXp) break;
    accumulated += nextLevelCost;
    level++;
  }
  return level;
}

/**
 * Returns detailed progress information for a given total XP.
 * @param {number} totalXp - The player's total accumulated XP
 * @returns {{ level: number, currentXp: number, nextLevelXp: number, progress: number }}
 *   level - current level
 *   currentXp - XP earned towards the next level
 *   nextLevelXp - total XP needed for the next level
 *   progress - fraction (0 to 1) of progress towards next level
 */
export function xpProgress(totalXp) {
  const level = levelFromXp(totalXp);
  const xpAtCurrentLevel = totalXpForLevel(level);
  const currentXp = totalXp - xpAtCurrentLevel;
  const nextLevelXp = xpForLevel(level + 1);
  const progress = nextLevelXp > 0 ? Math.min(currentXp / nextLevelXp, 1) : 0;

  return {
    level,
    currentXp,
    nextLevelXp,
    progress,
  };
}

/**
 * Calculates total XP earned from completing a quest, applying all modifiers.
 *
 * @param {number} baseXp - Base XP from the quest's difficulty
 * @param {object} options - Modifier options
 * @param {number} [options.streakDays=0] - Current streak in days
 * @param {boolean} [options.isFirstOfDay=false] - Whether this is the first quest of the day
 * @param {number} [options.categoryCount=0] - Number of quests completed in this category
 * @param {object} [options.classBonuses={}] - Class bonus multipliers (e.g. { health: 1.2 })
 * @param {string} [options.categoryType=''] - The category of the quest (health, intelligence, money, relationships)
 * @param {object} [options.talents={}] - Active talent modifiers
 * @param {number} [options.talents.recurringXpBonus=0] - Bonus from Path of Discipline
 * @param {number} [options.talents.hardQuestXpBonus=0] - Bonus from Path of Ambition
 * @param {boolean} [options.isRecurring=false] - Whether this is a recurring quest
 * @param {boolean} [options.isHardPlus=false] - Whether difficulty is Hard or above
 * @returns {number} Total XP after all modifiers (rounded down)
 */
export function calculateQuestXp(baseXp, options = {}) {
  const {
    streakDays = 0,
    isFirstOfDay = false,
    categoryCount = 0,
    classBonuses = {},
    categoryType = '',
    talents = {},
    isRecurring = false,
    isHardPlus = false,
  } = options;

  let xp = baseXp;

  // Streak bonus: +10% per consecutive day, capped at +100%
  const streakBonus = Math.min(streakDays * 0.1, 1.0);
  xp *= 1 + streakBonus;

  // First quest of the day bonus: +25 XP flat
  if (isFirstOfDay) {
    xp += 25;
  }

  // Category mastery: +50 XP every 10 quests in a category
  if (categoryCount > 0 && categoryCount % 10 === 0) {
    xp += 50;
  }

  // Class bonus: applies the class multiplier for the quest's category
  const normalizedCategory = categoryType.toLowerCase();
  if (classBonuses[normalizedCategory] && classBonuses[normalizedCategory] !== 1) {
    xp *= classBonuses[normalizedCategory];
  }

  // Talent: Path of Discipline (recurring quest XP bonus)
  if (isRecurring && talents.recurringXpBonus) {
    xp *= 1 + talents.recurringXpBonus;
  }

  // Talent: Path of Ambition (Hard+ quest XP bonus)
  if (isHardPlus && talents.hardQuestXpBonus) {
    xp *= 1 + talents.hardQuestXpBonus;
  }

  return Math.floor(xp);
}
