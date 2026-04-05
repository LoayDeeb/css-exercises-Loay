import { useCharacterContext } from '../context/CharacterContext';

export function useStreaks() {
  const { state, dispatch } = useCharacterContext();

  function updateDailyStreak() {
    dispatch({ type: 'UPDATE_STREAK' });
  }

  /**
   * Checks if the last 3+ completed quests are in the same category.
   * Returns the category name and combo count, or null if no combo.
   */
  function getCategoryCombo(recentQuests) {
    if (!recentQuests || recentQuests.length < 3) return null;

    // Look at the last 3+ quests for a same-category run
    const sorted = [...recentQuests]
      .filter((q) => q.status === 'completed' && q.completedAt)
      .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt));

    if (sorted.length < 3) return null;

    const targetCategory = sorted[0].category;
    let comboCount = 0;

    for (const quest of sorted) {
      if (quest.category === targetCategory) {
        comboCount++;
      } else {
        break;
      }
    }

    if (comboCount >= 3) {
      return { category: targetCategory, count: comboCount };
    }

    return null;
  }

  /**
   * Checks if recent quests form an ascending difficulty run (easy -> medium -> hard).
   * Returns the length of the run, or null if no valid sequence.
   */
  function getDifficultyRun(recentQuests) {
    if (!recentQuests || recentQuests.length < 3) return null;

    const difficultyOrder = ['trivial', 'easy', 'medium', 'hard', 'epic', 'legendary'];

    const sorted = [...recentQuests]
      .filter((q) => q.status === 'completed' && q.completedAt)
      .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt));

    if (sorted.length < 3) return null;

    // Check for ascending difficulty sequence (most recent first, so reverse for ascending check)
    const reversed = sorted.slice(0, 10).reverse();
    let longestRun = 0;
    let currentRun = 1;

    for (let i = 1; i < reversed.length; i++) {
      const prevIdx = difficultyOrder.indexOf(reversed[i - 1].difficulty);
      const currIdx = difficultyOrder.indexOf(reversed[i].difficulty);

      if (currIdx > prevIdx && prevIdx >= 0 && currIdx >= 0) {
        currentRun++;
        longestRun = Math.max(longestRun, currentRun);
      } else {
        currentRun = 1;
      }
    }

    longestRun = Math.max(longestRun, currentRun);

    if (longestRun >= 3) {
      return { runLength: longestRun };
    }

    return null;
  }

  /**
   * Checks if all quests due today have been completed.
   */
  function isPerfectDay(quests) {
    if (!quests || quests.length === 0) return false;

    const today = new Date().toISOString().split('T')[0];

    const dueToday = quests.filter((q) => {
      if (!q.dueDate) return false;
      const questDueDate = new Date(q.dueDate).toISOString().split('T')[0];
      return questDueDate === today;
    });

    if (dueToday.length === 0) return false;

    return dueToday.every((q) => q.status === 'completed');
  }

  /**
   * Returns the streak bonus as a decimal multiplier.
   * 10% per streak day, capped at 100% (1.0).
   */
  function getStreakBonus() {
    return Math.min(state.streakDays * 0.1, 1.0);
  }

  return {
    streakDays: state.streakDays,
    lastActiveDate: state.lastActiveDate,
    updateDailyStreak,
    getCategoryCombo,
    getDifficultyRun,
    isPerfectDay,
    getStreakBonus,
  };
}
