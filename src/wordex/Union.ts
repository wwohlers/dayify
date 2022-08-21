import {Sequence} from './Sequence';
import {Term} from './Term';

export type Union<T extends any[]> = {
  elements: (Term<ExtractArrayType<T>> | Sequence<ExtractArrayType<T>, any> | Union<ExtractArrayType<T>>)[];
  value: (values: T) => T;
  numTermsRange: [number, number];
};

type ExtractArrayType<T> = T extends (infer K)[] ? K : never;

export function createUnion<T extends any[]>(elements: Union<T>['elements']): Union<T> {
  const numTermsRange = elements.reduce(
    (val, element) => {
      return [Math.min(val[0], element.numTermsRange[0]), Math.max(val[1], element.numTermsRange[1])] as [
        number,
        number,
      ];
    },
    [0, 0] as [number, number],
  );
  return {
    elements,
    value: (values) => values,
    numTermsRange,
  };
}
