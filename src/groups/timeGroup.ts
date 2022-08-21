import { createSequence } from '../wordex/Sequence';
import { createTerm } from '../wordex/Term';
import { DateTime } from 'luxon';
import { numberTerm } from '../words/number';
import { anyOfTerm } from '../words/anyOf';

const timeGroup = createSequence<DateTime[], { hour: number; min: number | undefined; ampm: number | undefined }>(
  [
    {
      name: 'hour',
      required: true,
      element: numberTerm(0, 24),
    },
    {
      name: 'min',
      required: false,
      element: createSequence<number, { min: number }>(
        [
          {
            name: undefined,
            required: true,
            element: anyOfTerm([':']),
          },
          {
            name: 'min',
            required: true,
            element: numberTerm(0, 59),
          },
        ],
        ({ min }) => {
          return min;
        },
      ),
    },
    {
      name: 'ampm',
      required: false,
      element: createTerm((str) => {
        if (['am', 'pm', 'a', 'p'].includes(str)) {
          return str.startsWith('a') ? 0 : 12;
        }
        return false;
      }),
    },
  ],
  ({ hour, min, ampm }) => {
    let possibleHours;
    if (ampm === undefined && hour <= 12) {
      // ambiguous
      possibleHours = [hour, (hour + 12) % 24];
    } else if (ampm !== undefined) {
      if (hour === 12) possibleHours = [ampm];
      else possibleHours = [hour + ampm];
    } else {
      possibleHours = [hour];
    }
    const minute = min === undefined ? 0 : min;
    return possibleHours.map((h) => {
      return DateTime.fromObject({
        hour: h,
        minute,
      }).startOf('minute');
    });
  },
);
