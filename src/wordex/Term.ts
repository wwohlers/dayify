export type Term<K> = {
  type: "word";
  value: (str: string) =>  false | K;
  numTermsRange: [number, number];
};

export function createTerm<K>(
  value: (str: string) => false | K,
): Term<K> {
  return {
    type: "word",
    value,
    numTermsRange: [1, 1],
  };
}
