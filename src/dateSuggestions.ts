import { DateTime } from 'luxon';
import { dayOfWeekToNum, daythToDay, monthToNum, sortByNearest } from './util';

const SIMPLE_RELATIVE_REGEX = /^(today|tomorrow|day after tomorrow|yesterday|day before yesterday)$/;
export const fromSimpleRelative = (str: string): DateTime[] => {
  const today = DateTime.now().startOf('day');
  switch (str) {
    case 'today':
      return [today];
    case 'tomorrow':
      return [today.plus({ day: 1 })];
    case 'day after tomorrow':
      return [today.plus({ day: 2 })];
    case 'yesterday':
      return [today.minus({ day: 1 })];
    case 'day before yesterday':
      return [today.minus({ day: 2 })];
    default:
      return [];
  }
};

const DAY_OF_WEEK_REGEX = /^(mon|tue|wed|thu|fri|sat|sun|monday|tuesday|wednesday|thursday|friday|saturday|sunday)$/;
/**
 * Example: "tuesday"
 * @param dayOfWeek
 * @returns
 */
export const fromDayOfWeek = (dayOfWeek: string) => {
  const weekday = dayOfWeekToNum(dayOfWeek);
  const thisWeek = DateTime.now().startOf('week').set({ weekday });
  const prevWeek = thisWeek.minus({ week: 1 });
  const nextWeek = thisWeek.plus({ week: 2 });
  return [thisWeek, prevWeek, nextWeek];
};

const RELATIVE_WEEKDAY_REGEX =
  /^(this|next|last) (mon|tue|wed|thu|fri|sat|sun|monday|tuesday|wednesday|thursday|friday|saturday|sunday)$/;
/**
 * Example: "next Tuesday", "this Sunday"
 * @param relator "this", "next", or "last"
 * @param dayOfWeek
 * @returns
 */
export const fromRelativeWeekday = (relator: string, dayOfWeek: string) => {
  const weekday = dayOfWeekToNum(dayOfWeek);
  const thisWeek = DateTime.now().set({ weekday }).startOf('day');
  if (relator === 'this') {
    return [thisWeek];
  } else if (relator === 'next') {
    return [thisWeek.plus({ week: 1 }), thisWeek, thisWeek.plus({ week: 2 })];
  } else {
    return [thisWeek.minus({ week: 1 }), thisWeek, thisWeek.minus({ week: 2 })];
  }
};

const NUMERIC_RELATIVE_WEEK_REGEX =
  /^(\d+) (monday|tuesday|wednesday|thursday|friday|saturday|sunday)s? ?(ago|from now|)$/;
/**
 * Example: "2 Wednesdays ago", "5 Thursdays from now", "1 Sunday"
 * @param ago
 * @returns
 */
export const fromNumericRelativeWeek = (numWeeks: string, dayOfWeek: string, suffix?: string) => {
  const weekday = dayOfWeekToNum(dayOfWeek);
  const thisWeek = DateTime.now().startOf('week').set({ weekday });
  if (suffix === 'ago') {
    return [thisWeek.minus({ week: Number(numWeeks) })];
  } else {
    return [thisWeek.plus({ week: Number(numWeeks) })];
  }
};

const SLASHES_REGEX = /^(\d{1,2})[\/\-](\d{1,2})(?:[\/\-](\d{4}|\d{2}))?$/;
/**
 * For example, "9/24/01" or "30/6/2030". Notice that this can handle MM/DD/[YY[YY]] as well as DD/MM/[YY[YY]] since these are the same regex formats.
 * @param aa the first number (can be one digit or two)
 * @param bb the second number (can be one digit or two)
 * @param yy
 * @returns
 */
export const fromSlashes = (aa: string, bb: string, yy?: string) => {
  const year = yy ? (Number(yy) % 2000) + 2000 : undefined;
  let a: DateTime;
  let b: DateTime;
  a = DateTime.fromObject({
    month: Number(aa),
    day: Number(bb),
    year,
  }).startOf('day');
  b = DateTime.fromObject({
    month: Number(bb),
    day: Number(aa),
    year,
  }).startOf('day');
  return sortByNearest([a, b].filter((d) => d.isValid));
};

const DAY_MONTH_REGEX =
  /^(\d{1,2})(?:th|st|rd|)(?: of|) (jan|feb|mar|apr|may|jun|jul|aug|sep|nov|dec|january|february|march|april|may|june|july|august|september|october|november|december) ?(\d{4}|\d{2})?$/;
/**
 * For example, "24th August" or "7 April 2020"
 */
export const fromDayMonth = (dayth: string, monthStr: string, year?: string) => {
  const month = monthToNum(monthStr);
  const day = daythToDay(dayth);
  return [
    DateTime.fromObject({
      month,
      day,
      year: year ? Number(year) : undefined,
    }).startOf('day'),
  ];
};

const MONTH_DAY_REGEX =
  /^(jan|feb|mar|apr|may|jun|jul|aug|sep|nov|dec|january|february|march|april|may|june|july|august|september|october|november|december) (\d{1,2})(?:th|st|rd|)(?:,? )?(\d{4}|\d{2})?$/;
/**
 * For example, "August 24th" or "Apr 7 2020"
 */
export const fromMonthDay = (monthStr: string, dayth: string, year?: string) => {
  const month = monthToNum(monthStr);
  const day = daythToDay(dayth);
  return [
    DateTime.fromObject({
      month,
      day,
      year: year ? Number(year) : undefined,
    }).startOf('day'),
  ];
};

const DAY_REGEX = /^(?:the )?(\d+)(?:th|rd|st)?$/;
/**
 * For example, "4", "4th" or "the 4th"
 */
export const fromDay = (dayth: string) => {
  const day = DateTime.now()
    .set({ day: daythToDay(dayth) })
    .startOf('day');
  return sortByNearest([day, day.plus({ month: 1 }), day.minus({ month: 1 })]);
};

export const dateParsers: [RegExp, (...args: string[]) => DateTime[]][] = [
  [SIMPLE_RELATIVE_REGEX, fromSimpleRelative],
  [DAY_OF_WEEK_REGEX, fromDayOfWeek],
  [RELATIVE_WEEKDAY_REGEX, fromRelativeWeekday],
  [NUMERIC_RELATIVE_WEEK_REGEX, fromNumericRelativeWeek],
  [SLASHES_REGEX, fromSlashes],
  [DAY_MONTH_REGEX, fromDayMonth],
  [MONTH_DAY_REGEX, fromMonthDay],
  [DAY_REGEX, fromDay],
];
