import { DateTime } from 'luxon';
import { dayOfWeekToNum, monthToNum, abbreviatedUnitToFull, sortByNearest, hourToTime, getQtAndUnit, roundRelative } from '../src/util';

test('dayOfWeekToNum', () => {
  expect(dayOfWeekToNum('TUE')).toBe(2);
  expect(dayOfWeekToNum('thursday')).toBe(4);
  expect(dayOfWeekToNum('sun')).toBe(7);
});

test('monthToNum', () => {
  expect(monthToNum('Jul')).toBe(7);
  expect(monthToNum('september')).toBe(9);
  expect(monthToNum('jANUARY')).toBe(1);
});

test('abbreviatedUnitToFull', () => {
  expect(abbreviatedUnitToFull('s')).toBe('second');
  expect(abbreviatedUnitToFull('min')).toBe('minute');
  expect(abbreviatedUnitToFull('month')).toBe('month');
});

test('getQtAndUnit', () => {
  expect(getQtAndUnit('6d')).toEqual([6, 'day']);
  expect(getQtAndUnit('17hour')).toEqual([17, 'hour']);
  expect(getQtAndUnit('56247min')).toEqual([56247, 'minute']);
});

test('roundRelative', () => {
  expect(roundRelative(DateTime.now(), 'minute')).toEqual(DateTime.now().startOf('minute'));
  expect(roundRelative(DateTime.now(), 'hour')).toEqual(DateTime.now().startOf('hour'));
  expect(roundRelative(DateTime.now(), 'day')).toEqual(DateTime.now().startOf('day').plus({ hour: 9 }));
  expect(roundRelative(DateTime.now(), 'year')).toEqual(DateTime.now().startOf('day').plus({ hour: 9 }));
});

test('sortByNearest', () => {
  const today = DateTime.now();
  const tomorrow = today.plus({ day: 1 });
  const earlier = today.minus({ hour: 1 });
  const sorted = sortByNearest([today, tomorrow, earlier]);
  expect(sorted).toEqual([today, earlier, tomorrow]);
});

test('hourStrToTime', () => {
  expect(hourToTime(8, 'pm')[0]).toEqual(DateTime.now().set({ hour: 20 }).startOf('hour'));
  expect(hourToTime(5)[0]).toEqual(DateTime.now().set({ hour: 5 }).startOf('hour'));
  expect(hourToTime(5)[1]).toEqual(DateTime.now().set({ hour: 17 }).startOf('hour'));
  expect(hourToTime(15)[0]).toEqual(DateTime.now().set({ hour: 15 }).startOf('hour'));
});
