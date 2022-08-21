import {createTerm} from "../wordex/Term";

const first24Numbers = [
  'zero',
  'one',
  'two',
  'three',
  'four',
  'five',
  'six',
  'seven',
  'eight',
  'nine',
  'ten',
  'eleven',
  'twelve',
];

export const numberTerm = (min?: number, max?: number) => createTerm((str: string): number | false => {
  const num = Number(str);
  if (!isNaN(num)) {
    if (min !== undefined && num < min) return false;
    if (max !== undefined && num > max) return false;
    return num;
  }
  const minEl = min === undefined ? 0 : Math.max(0, min);
  const maxEl = max === undefined ? 10 : Math.min(first24Numbers.length, max);
  const words = first24Numbers
    .slice(minEl, maxEl + 1); // inclusive at upper limit
  if (words.includes(str)) {
    return words.indexOf(str);
  }
  return false;
});
