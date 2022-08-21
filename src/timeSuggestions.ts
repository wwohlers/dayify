import { DateTime } from "luxon";
import { hourToTime } from "./util";

const HOUR_REGEX = /^(?:(\d{1,2}|quarter|half) (to|past) )?(midnight|noon|\d{1,2} ?(?:o'?clock)? ?(?:a|p)?m?)$/;
/**
 * For example:
 * 5 to midnight
 * half past 4 am
 * quarter to 22
 * 10 past 6p
 * 22
 * 5am
 * 3 o'clock
 * noon
 */
export const fromHour = (modifier: string | undefined, modifierDirection: string | undefined, hourStr: string) => {
  let res = [];
  if (hourStr === "noon") {
    res = [DateTime.now().set({ hour: 12 }).startOf('hour')];
  } else if (hourStr === "midnight") {
    res = [DateTime.now().set({ hour: 0 }).startOf('hour')];
  } else {
    let hour = Number(hourStr.charAt(0));
    let digits = 1;
    const twoDigits = Number(hourStr.substring(0, 2));
    if (!isNaN(twoDigits)) {
      hour = twoDigits;
      digits = 2;
    }
    const suffix = hourStr.substring(digits).trim();
    if (suffix) {
      hour %= 12;
      if (suffix.startsWith("p")) hour += 12;
    }
    res = hourToTime(hour, suffix);
  }
  if (modifier && modifierDirection) {
    const minutes = ((str: string): number => {
      if (str === "half") return 30;
      if (str === "quarter") return 15;
      return Number(str);
    })(modifier);
    if (modifierDirection === "to") {
      res = res.map(d => d.minus({ minutes }));
    } else {
      res = res.map(d => d.plus({ minutes }));
    }
  }
  return res;
}

const HHMM_REGEX = /^(\d{1,2}):(\d{2}) ?(a|p)?m?$/;
export const fromHHMM = (hh: string, mm: string, a?: string) => {
  let hour = Number(hh);
  if (hour <= 12 && a?.startsWith("p")) {
    hour += 12;
  }
  hour %= 24;
  const minute = Math.min(Number(mm), 59);
  return [DateTime.now().set({ hour, minute }).startOf('minute')];
}

export const timeParsers: [RegExp, (...args: string[]) => DateTime[]][] = [
  [HOUR_REGEX, fromHour],
  [HHMM_REGEX, fromHHMM],
]