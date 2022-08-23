import { DateTime } from 'luxon';
import {
  fromDay,
  fromDayMonth,
  fromDayOfWeek,
  fromMonthDay,
  fromNumericRelativeWeek,
  fromSimpleRelative,
  fromSlashes,
} from '../src/dateSuggestions';
import { suggest, suggestDate, suggestTime } from '../src/index';
import { fromHHMM, fromHour } from '../src/timeSuggestions';

test('suggestDate', () => {
  expect(suggestDate('day after tomorrow')[0]).toEqual(fromSimpleRelative('day after tomorrow')[0].plus({ hour: 9 }));
  expect(suggestDate('tue')[0]).toEqual(fromDayOfWeek('tue')[0].plus({ hour: 9 }));
  expect(suggestDate(' 2 TUESDAYS ago')[0]).toEqual(
    fromNumericRelativeWeek('2', 'tuesday', 'ago')[0].plus({ hour: 9 }),
  );
  expect(suggestDate('1 Sunday')[0]).toEqual(fromNumericRelativeWeek('1', 'sunday', undefined)[0].plus({ hour: 9 }));
  expect(suggestDate(' 09/24/01 ')[0]).toEqual(fromSlashes('09', '24', '01')[0].plus({ hour: 9 }));
  expect(suggestDate('4-12-2010')[0]).toEqual(fromSlashes('4', '12', '2010')[0].plus({ hour: 9 }));
  expect(suggestDate('4th of july')[0]).toEqual(fromDayMonth('4', 'july')[0].plus({ hour: 9 }));
  expect(suggestDate('3 sep 22')[0]).toEqual(fromDayMonth('3', 'sep', '22')[0].plus({ hour: 9 }));
  expect(suggestDate('july 4th, 2012')[0]).toEqual(fromMonthDay('july', '4', '2012')[0].plus({ hour: 9 }));
  expect(suggestDate('sep 8 02')[0]).toEqual(fromMonthDay('sep', '8', '02')[0].plus({ hour: 9 }));
  expect(suggestDate('the 4th')[0]).toEqual(fromDay('4th')[0].plus({ hour: 9 }));
  expect(suggestDate('21')[0]).toEqual(fromDay('21')[0].plus({ hour: 9 }));
});

test('suggestTime', () => {
  expect(suggestTime('Half past 5p')).toEqual(fromHour('half', 'past', '5p'));
  expect(suggestTime('5 to 12 pm')).toEqual(fromHour('5', 'to', '12 pm'));
  expect(suggestTime('QUARTER past 4 oclock am')).toEqual(fromHour('quarter', 'past', '4 oclock pm'));
  expect(suggestTime(' 10 past 13 ')).toEqual(fromHour('10', 'past', '13'));
  expect(suggestTime('8 pm')).toEqual(fromHour(undefined, undefined, '8 pm'));
  expect(suggestTime('05:30   ')).toEqual(fromHHMM('05', '30'));
  expect(suggestTime('4:59 am')).toEqual(fromHHMM('4', '59', 'am'));
  expect(suggestTime('8:00P')).toEqual(fromHHMM('8', '00', 'p'));
});

test('suggest - units', () => {
  expect(suggest(' In 3 Hours ', 'future')[0]).toEqual(DateTime.now().plus({ hour: 3 }).startOf('hour'));
  expect(suggest('2 days, 4 hours ago', 'past')[0]).toEqual(DateTime.now().minus({ day: 2, hour: 4 }).startOf('hour'));
  expect(suggest('IN 36 D AND 2 MIN  ')[0]).toEqual(DateTime.now().plus({ day: 36, minute: 2 }).startOf('minute'));
  expect(suggest('5y 3wk 2d ago')[0]).toEqual(
    DateTime.now().minus({ year: 5, week: 3, day: 2 }).startOf('day').plus({ hour: 9 }),
  );
  expect(suggest('in an hour and 30 minutes')[0]).toEqual(
    DateTime.now().plus({ hour: 1, minute: 30 }).startOf('minute'),
  );
  expect(suggest('in an hour and 30 minutes', 'past')).toEqual([]);
});

test('suggest - at', () => {
  expect(suggest('TOMORROW AT 7')[0]).toEqual(DateTime.now().startOf('day').plus({ day: 1, hour: 7 }));
  expect(suggest(' next tuesday at midnight')[0]).toEqual(DateTime.now().startOf('week').plus({ week: 1, day: 1 }));
  expect(suggest(' JUly 21st, 2030 at 7:31pm')[0]).toEqual(
    DateTime.now().set({ year: 2030, month: 7, day: 21, hour: 19, minute: 31 }).startOf('minute'),
  );
  expect(suggest('4 sep at quarter to 17  ')[0]).toEqual(
    DateTime.now().set({ month: 9, day: 4, hour: 16, minute: 45 }).startOf('minute'),
  );
  expect(suggest('saturday at 5')[0]).toEqual(DateTime.now().set({ weekday: 6, hour: 5, minute: 0 }).startOf('minute'));
});
