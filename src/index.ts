import { DateTime } from 'luxon';
import { dateParsers } from './dateSuggestions';
import { timeParsers } from './timeSuggestions';
import { fromUnits } from './unitsSuggestions';
import { SearchDirection } from './util';

export function suggestDate(input: string, direction: SearchDirection = 'both'): DateTime[] {
  const today = DateTime.now().startOf('day');
  const trimmed = input.trim().toLowerCase();
  for (const [regexp, parser] of dateParsers) {
    if (regexp.test(trimmed)) {
      return parser(...regexp.exec(trimmed)!.slice(1))
        .filter((date) => date.isValid)
        .filter((date) => {
          if (direction === 'future') return date >= today;
          if (direction === 'past') return date < today;
          return true;
        })
        .map((date) => date.set({ hour: 9 }));
    }
  }
  return [];
}

export function suggestTime(input: string, direction: SearchDirection = 'both'): DateTime[] {
  const trimmed = input.trim().toLowerCase();
  for (const [regexp, parser] of timeParsers) {
    if (regexp.test(trimmed)) {
      return parser(...regexp.exec(trimmed)!.slice(1))
        .filter((date) => date.isValid)
        .filter((date) => {
          if (direction === 'future') return date >= DateTime.now();
          if (direction === 'past') return date < DateTime.now();
          return true;
        })
        .map((date) => date.startOf('minute'));
    }
  }
  return [];
}

export function suggest(input: string, direction: SearchDirection = 'both'): DateTime[] {
  const trimmed = input.trim().toLowerCase();
  if (direction !== 'past' && trimmed.startsWith('in ')) {
    return fromUnits(trimmed.substring(2).trim(), false);
  } else if (direction !== 'future' && trimmed.endsWith(' ago')) {
    return fromUnits(trimmed.substring(0, input.length - 3).trim(), true);
  }
  if (trimmed.includes(' at ')) {
    const [dateInput, timeInput] = trimmed.split(' at ');
    const dates = suggestDate(dateInput);
    const times = suggestTime(timeInput);
    return dates
      .map((d) => {
        return times.map((t) => {
          return d.set({
            hour: t.hour,
            minute: t.minute,
          });
        });
      })
      .flat(1)
      .filter((dt) => {
        if (direction === "future") return dt > DateTime.now();
        else if (direction === "past") return dt < DateTime.now();
        return true;
      })
  } else {
    const dates = suggestDate(trimmed, direction);
    if (dates.length) return dates;
    return suggestTime(trimmed);
  }
}
