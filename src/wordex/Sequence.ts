import { Union } from './Union';
import { Term } from './Term';

export type Sequence<K, M extends { [key: string]: any }> = {
  type: 'sequence';
  elements: SequenceElement<M>[];
  value: (values: M) => K;
  ordered: boolean;
  numTermsRange: [number, number];
};

type SequenceElement<M extends { [key: string]: any }> = {
  [KEY in keyof M]:
    | {
        name: KEY;
        element:
          | Term<Exclude<M[KEY], undefined>>
          | Sequence<Exclude<M[KEY], undefined>, any>
          | Union<Exclude<M[KEY], undefined>>;
        required: undefined extends M[KEY] ? false : true;
      }
    | {
        name: undefined;
        element: Term<any> | Sequence<any, any> | Union<any>; // false, undefined, or null -- otherwise truthy
        required: boolean;
      };
}[keyof M];

export function createSequence<K, M extends { [key: string]: any }>(
  elements: SequenceElement<M>[],
  value: (values: M) => K,
  ordered = true,
): Sequence<K, M> {
  const numTermsRange = elements.reduce(
    (val, { required, element }) => {
      return [required ? val[0] + element.numTermsRange[0] : 0, val[1] + element.numTermsRange[1]] as [number, number];
    },
    [0, 0] as [number, number],
  );
  return {
    type: 'sequence',
    elements,
    value,
    ordered,
    numTermsRange,
  };
}
