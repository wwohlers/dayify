import { DateTime } from 'luxon';
import { fromUnits } from '../src/unitsSuggestions';

test('fromUnits', () => {
  expect(fromUnits('3 days, 5 minutes', true)[0]).toEqual(
    DateTime.now().minus({ day: 3, minutes: 5 }).startOf('minute'),
  );
  expect(fromUnits('8 months 1 week', false)[0]).toEqual(
    DateTime.now().plus({ month: 8, week: 1 }).startOf('day').plus({ hour: 9 }),
  );
  expect(fromUnits('an hr and 30 mins', false)[0]).toEqual(
    DateTime.now().plus({ hour: 1, minutes: 30 }).startOf('minute'),
  );
  expect(fromUnits('6d 2h', true)[0]).toEqual(DateTime.now().minus({ day: 6, hour: 2 }).startOf('hour'));
  expect(fromUnits('4y and 2 days', false)[0]).toEqual(
    DateTime.now().plus({ year: 4, day: 2 }).startOf('day').plus({ hour: 9 }),
  );
  expect(fromUnits('3 hours and 6', true)[0]).toEqual(DateTime.now().minus({ hour: 3 }).startOf('hour'));
});
