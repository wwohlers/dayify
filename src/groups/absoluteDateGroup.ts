import {createSequence} from "../wordex/Sequence";
import {DateTime} from "luxon";
import {monthTerm} from "../words/month";
import {numberTerm} from "../words/number";

export const absoluteDateGroup = createSequence<DateTime[], { }>(
  [
    {

    }
  ],
  () => {
    return [DateTime.now()];
  }
);

const monthDayGroup = createSequence<DateTime[], { month: number | undefined, day: number }>(
  [
    {
      name: "month",
      element: monthTerm,
      required: false,
    },
    {
      name: "day",
      element: numberTerm(1, 31),
      required: true,
    }
  ],
  ({ month, day }) => {

  },
  false,
)
