import { DateTime } from 'luxon';
import {
  fromDayMonth,
  fromDayOfWeek,
  fromNumericRelativeWeek,
  fromRelativeWeekday,
  fromSimpleRelative,
  fromSlashes,
} from '../src/dateSuggestions';

test('fromSimpleRelative', () => {
  expect(fromSimpleRelative('today')[0]).toEqual(DateTime.now().startOf('day'));
  expect(fromSimpleRelative('yesterday')[0]).toEqual(DateTime.now().startOf('day').minus({ day: 1 }));
  expect(fromSimpleRelative('day after tomorrow')[0]).toEqual(DateTime.now().startOf('day').plus({ day: 2 }));
});

test('fromDayOfWeek', () => {
  expect(fromDayOfWeek('tue')[0]).toEqual(DateTime.now().startOf('week').set({ weekday: 2 }));
  expect(fromDayOfWeek('sunday')[0]).toEqual(DateTime.now().startOf('week').set({ weekday: 7 }));
});

test('fromRelativeWeekday', () => {
  expect(fromRelativeWeekday('this', 'sun')[0]).toEqual(DateTime.now().startOf('week').set({ weekday: 7 }));
  expect(fromRelativeWeekday('next', 'thursday')[0]).toEqual(
    DateTime.now().startOf('week').set({ weekday: 4 }).plus({ week: 1 }),
  );
  expect(fromRelativeWeekday('last', 'sat')[0]).toEqual(
    DateTime.now().startOf('week').set({ weekday: 6 }).minus({ week: 1 }),
  );
});

test('fromNumericRelativeWeek', () => {
  expect(fromNumericRelativeWeek('5', 'tuesday', 'ago')[0]).toEqual(
    DateTime.now().minus({ week: 5 }).set({ weekday: 2 }).startOf('day'),
  );
  expect(fromNumericRelativeWeek('2', 'mon', 'from now')[0]).toEqual(
    DateTime.now().plus({ week: 2 }).set({ weekday: 1 }).startOf('day'),
  );
});

test('fromSlashes', () => {
  expect(fromSlashes('09', '24', '01')[0].toMillis()).toBe(1001304000000);
  expect(fromSlashes('30', '6', '2030')[0].toMillis()).toBe(1909022400000);
  expect(fromSlashes('04', '4').length).toBe(2);
});

test('fromDayMonth', () => {
  expect(fromDayMonth('24th', 'sep', '2001')[0].toMillis()).toBe(1001304000000);
  expect(fromDayMonth('8', 'July', '2020')[0].toMillis()).toBe(1594180800000);
});
