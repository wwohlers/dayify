import { Info } from 'luxon';
import { createTerm } from '../wordex/Term';

export const monthTerm = createTerm((str: string) => {
  const monthNames = Info.months('long')
    .concat(Info.months('short'))
    .concat(Info.months('numeric'))
    .map((n) => n.toLowerCase());
  if (monthNames.includes(str)) {
    return monthNames.indexOf(str) % 12;
  }
  return false;
});
