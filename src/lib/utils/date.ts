// src/lib/utils/date.ts - ENHANCED VERSION

/**
 * Convert Date to local date string (YYYY-MM-DD)
 * WITHOUT timezone conversion
 */
export const toLocalDateString = (date: Date): string => {
  // Get local date components
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

/**
 * Parse date string as LOCAL date (not UTC)
 */
export const parseLocalDate = (dateString: string): Date => {
  // Parse as YYYY-MM-DD in local timezone
  const [year, month, day] = dateString.split('-').map(Number);
  return new Date(year, month - 1, day);
};

/**
 * Compare two dates by local date only (ignore time)
 */
export const isSameLocalDate = (date1: Date, date2: Date): boolean => {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
};

/**
 * Get date range for a week (local dates)
 */
export const getWeekDateRange = (weekStart: Date, weekEnd: Date): string[] => {
  const dates: string[] = [];
  const current = new Date(weekStart);

  while (current <= weekEnd) {
    dates.push(toLocalDateString(current));
    current.setDate(current.getDate() + 1);
  }

  return dates;
};

/**
 * Format timestamp for display (Indonesian locale)
 */
export const formatIndonesianDateTime = (date: Date): string => {
  return new Intl.DateTimeFormat('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Asia/Jakarta', // ✅ Explicitly set Jakarta timezone
  }).format(date);
};

/**
 * Get week number in month (1-based)
 */
export const getWeekOfMonth = (date: Date): number => {
  const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
  const dayOfMonth = date.getDate();
  const dayOfWeek = firstDay.getDay();

  return Math.ceil((dayOfMonth + dayOfWeek) / 7);
};
