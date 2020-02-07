import * as t from 'io-ts';

const toLiteral = <T extends string>(literal: T) => t.literal(literal);

export const toLiterals = <T extends string>(literals: T[]) =>
  // eslint-disable-next-line implicit-arrow-linebreak
  t.union(literals.map(toLiteral) as [t.LiteralC<T>, t.LiteralC<T>]);
