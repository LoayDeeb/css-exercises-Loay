/**
 * LocalStorage persistence utilities for the Fantasy RPG Quest Manager.
 */

export const STORAGE_KEYS = {
  CHARACTER: 'rpg_character',
  QUESTS: 'rpg_quests',
  REWARDS: 'rpg_rewards',
  ACHIEVEMENTS: 'rpg_achievements',
  PLAYER: 'rpg_quest_player',
  COMPLETED_QUESTS: 'rpg_quest_completed',
  TALENTS: 'rpg_quest_talents',
  CUSTOM_REWARDS: 'rpg_quest_custom_rewards',
  STREAK: 'rpg_quest_streak',
  SETTINGS: 'rpg_quest_settings',
  CHARACTER_CLASS: 'rpg_quest_class',
  STATS: 'rpg_quest_stats',
  QUEST_LOG: 'rpg_quest_log',
  LAST_ACTIVE: 'rpg_quest_last_active',
};

/**
 * Saves data to localStorage under the given key.
 * @param {string} key - The storage key
 * @param {*} data - The data to persist (will be JSON-serialized)
 */
export function saveState(key, data) {
  try {
    const serialized = JSON.stringify(data);
    localStorage.setItem(key, serialized);
  } catch (error) {
    console.error(`Failed to save state for key "${key}":`, error);
  }
}

/**
 * Loads data from localStorage for the given key.
 * @param {string} key - The storage key
 * @param {*} defaultValue - Value to return if key is not found or parsing fails
 * @returns {*} The parsed data, or defaultValue on failure
 */
export function loadState(key, defaultValue = null) {
  try {
    const serialized = localStorage.getItem(key);
    if (serialized === null) return defaultValue;
    return JSON.parse(serialized);
  } catch (error) {
    console.error(`Failed to load state for key "${key}":`, error);
    return defaultValue;
  }
}

/**
 * Exports all game state data as a single JSON string for backup/transfer.
 * Collects every key defined in STORAGE_KEYS.
 * @returns {string} JSON string containing all saved game data
 */
export function exportAllData() {
  const exportData = {};

  Object.entries(STORAGE_KEYS).forEach(([label, key]) => {
    const value = localStorage.getItem(key);
    if (value !== null) {
      exportData[key] = JSON.parse(value);
    }
  });

  exportData._exportedAt = new Date().toISOString();
  exportData._version = 1;

  return JSON.stringify(exportData, null, 2);
}

/**
 * Imports game state data from a JSON string, restoring all keys.
 * @param {string} jsonString - The JSON string from exportAllData
 * @throws {Error} If the JSON is invalid or does not contain expected data
 */
export function importAllData(jsonString) {
  let data;

  try {
    data = JSON.parse(jsonString);
  } catch (error) {
    throw new Error('Invalid JSON: could not parse the import data.');
  }

  if (typeof data !== 'object' || data === null) {
    throw new Error('Invalid import data: expected an object.');
  }

  const validKeys = new Set(Object.values(STORAGE_KEYS));

  // Clear existing data first
  clearAllData();

  // Restore each key
  Object.entries(data).forEach(([key, value]) => {
    if (validKeys.has(key)) {
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch (error) {
        console.error(`Failed to import key "${key}":`, error);
      }
    }
  });
}

/**
 * Clears all game state data from localStorage.
 * Only removes keys managed by this application (defined in STORAGE_KEYS).
 */
export function clearAllData() {
  Object.values(STORAGE_KEYS).forEach((key) => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Failed to clear key "${key}":`, error);
    }
  });
}
