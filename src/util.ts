import { DateTime, DateTimeUnit, Info } from 'luxon';

export type SearchDirection = 'future' | 'past' | 'both';

export const MS_MARGIN = 1000;
export const DAY = 1000 * 3600 * 24;

/**
 * Sort dates by nearest date first.
 * @param dates
 * @returns
 */
export function sortByNearest(dates: DateTime[]) {
  return dates.sort((a, b) => {
    const aDiff = Math.abs(Date.now() - a.toMillis());
    const bDiff = Math.abs(Date.now() - b.toMillis());
    return aDiff - bDiff;
  });
}

/**
 * mon or monday to 1, sun or sunday to 7, etc
 * @param dayOfWeek
 * @returns
 */
export function dayOfWeekToNum(dayOfWeek: string): number {
  const format = dayOfWeek.length === 3 ? 'short' : 'long';
  return (
    1 +
    Info.weekdays(format)
      .map((d) => d.toLowerCase())
      .indexOf(dayOfWeek.toLowerCase())
  );
}

export function monthToNum(month: string): number {
  const format = month.length === 3 ? 'short' : 'long';
  return (
    1 +
    Info.months(format)
      .map((d) => d.toLowerCase())
      .indexOf(month.toLowerCase())
  );
}

/**
 * Converts "1st" or "1" to 1, for example
 * @param dayth
 */
export function daythToDay(dayth: string): number {
  if (!isNaN(Number(dayth))) {
    return Number(dayth);
  }
  if (!isNaN(Number(dayth.slice(0, 2)))) {
    return Number(dayth.slice(0, 2));
  }
  return Number(dayth.slice(0, 1));
}

export const units: DateTimeUnit[] = ['second', 'minute', 'hour', 'day', 'week', 'month', 'year'];

/**
 * Converts an abbreviated unit (like "min") to its full form
 * @param abbreviated Abbreviated unit
 * @returns
 */
export function abbreviatedUnitToFull(abbreviated: string): DateTimeUnit {
  if (abbreviated.startsWith('month')) return 'month';
  for (const unit of units) {
    if (abbreviated.startsWith(unit.charAt(0))) return unit;
  }
  return 'minute';
}

/**
 * Given a single word representing a quantity and a unit (e.g. 6d or 5min), return the quantity
 * and unit separately.
 * @param word
 */
export function getQtAndUnit(word: string): [number, DateTimeUnit] {
  let i = 0;
  while (!isNaN(Number(word.charAt(i)))) {
    i++;
  }
  return [Number(word.substring(0, i)), abbreviatedUnitToFull(word.substring(i))];
}

/**
 * Round a relative date based on the most precise unit used to describe it.
 * If this unit is an hour (or more precise), rounds to the start of that unit.
 * Otherwise, rounds to 9am on whatever day the date is on.
 * @param date
 * @param mostPreciseUnit
 * @returns
 */
export function roundRelative(date: DateTime, mostPreciseUnit: DateTimeUnit): DateTime {
  if (units.indexOf(mostPreciseUnit) <= 2) {
    // specificity within 1 hour, just round to start of most specific unit
    return date.startOf(mostPreciseUnit);
  } else {
    // morning is more natural than 12am
    return date.startOf('day').plus({ hour: 9 });
  }
}

/**
 * Convert a string representing an hour to its corresponding time today. For example:
 *  - "noon", "midnight"
 *  - "5pm"
 *  - "2 am"
 *  - "15"
 * @param str
 */
export function hourToTime(hour: number, suffix?: string): DateTime[] {
  if (hour > 12) return [DateTime.now().set({ hour }).startOf('hour')];
  const am = hour % 12;
  const pm = am + 12;
  if (suffix) {
    if (suffix.startsWith('p')) {
      return [DateTime.now().set({ hour: pm }).startOf('hour')];
    } else {
      return [DateTime.now().set({ hour: am }).startOf('hour')];
    }
  } else {
    return [DateTime.now().set({ hour: am }).startOf('hour'), DateTime.now().set({ hour: pm }).startOf('hour')];
  }
}
