import { Bag } from './bag';
import { OutcomeFunction } from './OutcomeFunction';
import { Token, TokenEffects } from './tokens';
import { combinations } from './utils';

/**
 * Compute the odds of a particular outcome when pulling tokens from the bag.
 *
 * @param {number} numTokensPulled
 *   The number of tokens simultaneously pulled from the bag.
 * @param {Bag} bag
 *   The bag from which the tokens are pulled.
 * @param {OutcomeFunction} outcomeFunction
 *   The outcome function returning `true` if the pulled tokens represent a
 *   desired outcome and `false` otherwise.
 *   The first argument passed to the function are the tokens pulled, the second
 *   is the token effects map and the third is the bag.
 * @return {number}
 *   The odds of the desired outcome.
 */
export function odds(numTokensPulled: number, bag: Bag, outcomes: TokenEffects, outcomeFunction: OutcomeFunction) {
  const comb: Token[][] = combinations(numTokensPulled, bag.getTokens());
  const filterCondition = (tokensPulled: Token[]) => {
    return outcomeFunction(tokensPulled, outcomes, bag);
  };
  return comb.filter(filterCondition).length / comb.length;
}

export * from './bag';
export * from './cards';
export * from './tokens';
