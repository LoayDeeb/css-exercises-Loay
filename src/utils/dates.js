/**
 * Date utility functions for the Fantasy RPG Quest Manager.
 * Uses medieval-themed language for display strings.
 */

/**
 * Formats a due date as a thematic "moons remaining" string.
 * @param {string|Date} dueDate - The quest's due date
 * @returns {string} A medieval-themed time remaining string
 */
export function formatMoonsRemaining(dueDate) {
  if (!dueDate) return 'No deadline set';

  const now = new Date();
  now.setHours(0, 0, 0, 0);

  const due = new Date(dueDate);
  due.setHours(0, 0, 0, 0);

  const diffMs = due.getTime() - now.getTime();
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    const overdueDays = Math.abs(diffDays);
    if (overdueDays === 1) return 'Past due by 1 moon!';
    return `Past due by ${overdueDays} moons!`;
  }

  if (diffDays === 0) return 'Due this very day!';
  if (diffDays === 1) return '1 moon remaining';

  if (diffDays <= 7) return `${diffDays} moons remaining`;
  if (diffDays <= 30) {
    const weeks = Math.floor(diffDays / 7);
    const remainingDays = diffDays % 7;
    if (remainingDays === 0) {
      return `${weeks} ${weeks === 1 ? 'week' : 'weeks'} remaining`;
    }
    return `${weeks} ${weeks === 1 ? 'week' : 'weeks'}, ${remainingDays} ${remainingDays === 1 ? 'moon' : 'moons'} remaining`;
  }

  const months = Math.floor(diffDays / 30);
  const remainingDays = diffDays % 30;
  if (remainingDays === 0) {
    return `${months} ${months === 1 ? 'cycle' : 'cycles'} remaining`;
  }
  return `${months} ${months === 1 ? 'cycle' : 'cycles'}, ${remainingDays} ${remainingDays === 1 ? 'moon' : 'moons'} remaining`;
}

/**
 * Calculates the next recurrence date from a given date.
 * @param {string|Date} date - The reference date
 * @param {string} type - Recurrence type: 'daily', 'weekly', or 'monthly'
 * @returns {Date} The next occurrence date
 */
export function getNextRecurrence(date, type) {
  const d = new Date(date);

  switch (type) {
    case 'daily':
      d.setDate(d.getDate() + 1);
      break;
    case 'weekly':
      d.setDate(d.getDate() + 7);
      break;
    case 'monthly':
      d.setMonth(d.getMonth() + 1);
      break;
    default:
      throw new Error(`Unknown recurrence type: ${type}`);
  }

  return d;
}

/**
 * Checks whether a due date has passed.
 * @param {string|Date} dueDate - The due date to check
 * @returns {boolean} True if the due date is in the past
 */
export function isOverdue(dueDate) {
  if (!dueDate) return false;

  const now = new Date();
  now.setHours(23, 59, 59, 999);

  const due = new Date(dueDate);
  due.setHours(23, 59, 59, 999);

  return due.getTime() < now.getTime();
}

/**
 * Returns the number of days between two dates (absolute value).
 * @param {string|Date} date1 - First date
 * @param {string|Date} date2 - Second date
 * @returns {number} Number of whole days between the two dates
 */
export function getDaysBetween(date1, date2) {
  const d1 = new Date(date1);
  d1.setHours(0, 0, 0, 0);

  const d2 = new Date(date2);
  d2.setHours(0, 0, 0, 0);

  const diffMs = Math.abs(d2.getTime() - d1.getTime());
  return Math.round(diffMs / (1000 * 60 * 60 * 24));
}
