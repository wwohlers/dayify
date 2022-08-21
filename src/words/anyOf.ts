import { createTerm } from '../wordex/Term';

export const anyOfTerm = (strs: string[]) =>
  createTerm((str: string) => {
    return strs.includes(str) ? str : false;
  });
