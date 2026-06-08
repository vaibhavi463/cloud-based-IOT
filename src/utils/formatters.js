import { format, formatDistanceToNow, isToday, isThisWeek, isThisMonth, startOfDay, endOfDay, subDays, eachDayOfInterval } from 'date-fns';

/**
 * Format a Firestore Timestamp to a readable date string.
 */
export function formatTimestamp(timestamp) {
  if (!timestamp) return '—';
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  return format(date, 'MMM dd, yyyy  hh:mm a');
}

/**
 * Format a Firestore Timestamp to relative time (e.g., "5 minutes ago").
 */
export function formatRelativeTime(timestamp) {
  if (!timestamp) return '—';
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  return formatDistanceToNow(date, { addSuffix: true });
}

/**
 * Format a Firestore Timestamp to time only (e.g., "10:35 AM").
 */
export function formatTimeOnly(timestamp) {
  if (!timestamp) return '—';
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  return format(date, 'hh:mm a');
}

/**
 * Format a Firestore Timestamp to short date (e.g., "Jun 05").
 */
export function formatShortDate(timestamp) {
  if (!timestamp) return '—';
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  return format(date, 'MMM dd');
}

/**
 * Check if a record's timestamp is today.
 */
export function isRecordToday(timestamp) {
  if (!timestamp) return false;
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  return isToday(date);
}

/**
 * Check if a record's timestamp is this week.
 */
export function isRecordThisWeek(timestamp) {
  if (!timestamp) return false;
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  return isThisWeek(date, { weekStartsOn: 1 });
}

/**
 * Check if a record's timestamp is this month.
 */
export function isRecordThisMonth(timestamp) {
  if (!timestamp) return false;
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  return isThisMonth(date);
}

/**
 * Format a number with commas.
 */
export function formatNumber(num) {
  if (num === null || num === undefined) return '0';
  return num.toLocaleString();
}

/**
 * Calculate percentage.
 */
export function calcPercentage(part, total) {
  if (!total || total === 0) return 0;
  return Math.round((part / total) * 100);
}

/**
 * Get the last N days as an array of date strings.
 */
export function getLastNDays(n) {
  const end = new Date();
  const start = subDays(end, n - 1);
  return eachDayOfInterval({ start, end }).map(d => format(d, 'MMM dd'));
}

/**
 * Get start and end of today as Date objects.
 */
export function getTodayRange() {
  const now = new Date();
  return { start: startOfDay(now), end: endOfDay(now) };
}

/**
 * Truncate text with ellipsis.
 */
export function truncate(str, maxLen = 20) {
  if (!str) return '';
  return str.length > maxLen ? str.slice(0, maxLen) + '…' : str;
}
