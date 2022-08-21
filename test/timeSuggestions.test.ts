import { DateTime } from 'luxon';
import { fromHHMM, fromHour } from '../src/timeSuggestions';

test('fromHour', () => {
  expect(fromHour('half', 'past', '5p')[0]).toEqual(DateTime.now().set({ hour: 17, minute: 30 }).startOf('minute'));
  expect(fromHour('5', 'to', '12 pm')[0]).toEqual(DateTime.now().set({ hour: 11, minute: 55 }).startOf('minute'));
  expect(fromHour('quarter', 'past', '4 oclock am')[0]).toEqual(DateTime.now().set({ hour: 4, minute: 15 }).startOf('minute'));
  expect(fromHour('10', 'past', '13')[0]).toEqual(DateTime.now().set({ hour: 13, minute: 10 }).startOf('minute'));
  expect(fromHour(undefined, undefined, '8 pm')[0]).toEqual(DateTime.now().set({ hour: 20, minute: 0 }).startOf('minute'));
});

test('fromHHMM', () => {
  expect(fromHHMM("05", "30")[0]).toEqual(DateTime.now().set({ hour: 5, minute: 30 }).startOf('minute'));
  expect(fromHHMM("4", "59", "am")[0]).toEqual(DateTime.now().set({ hour: 4, minute: 59 }).startOf('minute'));
  expect(fromHHMM("8", "00", "p")[0]).toEqual(DateTime.now().set({ hour: 20, minute: 0 }).startOf('minute'));
})