import { DateTime, DateTimeUnit } from "luxon";
import { abbreviatedUnitToFull, getQtAndUnit, roundRelative } from "./util";

/**
 * Parse a unit string from inputs. Examples include:
 * "3 days, 5 minutes"
 * "8 months 1 week"
 * "an hr and 30 mins"
 * @param input string input
 * @param ago if true, subtracts from now, otherwise adds
 */
export const fromUnits = (input: string, ago: boolean): DateTime[] => {
  const words = input
    .split(' ')
    .filter(w => w !== "and");
  let i = 0;
  let res = DateTime.now();
  const singularQuantities = ["a", "an"];
  let lastUnit: DateTimeUnit = 'minute';
  while (i < words.length) {
    let qt = singularQuantities.includes(words[i]) ? 1 : Number(words[i]);
    let unit: DateTimeUnit;
    if (isNaN(qt)) {
      [qt, unit] = getQtAndUnit(words[i]);
      if (isNaN(qt)) break;
      i += 1;
    } else {
      if (i === words.length - 1) break;
      unit = abbreviatedUnitToFull(words[i + 1]);
      i += 2;
    }
    if (ago) res = res.minus({ [unit]: qt });
    else res = res.plus({ [unit]: qt });
    lastUnit = unit;
  }
  return [roundRelative(res, lastUnit)];
}