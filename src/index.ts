import { Bag } from "./bag";
import { OutcomeFunction } from "./OutcomeFunction";
import { Token, TokenEffects } from "./tokens";
import { cartesianProduct, combinations } from "./utils";

/**
 * Compute the odds of a particular outcome when pulling tokens from the bag.
 *
 * The outcome function is called for each possible combination of `numTokens`
 * from the bag and return `true` or `false` wether this specific combination
 * is a success or not. This function is called with first argument being the
 * combination (it will contain exactly `numTokens` tokens), second optional
 * argument being the effects of the tokens and third optional argument being
 * the Chaos bag.
 *
 * The simplest outcome function is checking if a particular token was pulled:
 *
 * ```javascript
 * function pulledASkull(tokensPulled) {
 *   return tokensPulled[0] === ArkhamOdds.Token.SKULL;
 * }
 * ```
 *
 * Using the token effects mapping, you can check if the skill test is a
 * success when the total skil vallue is 2 above the difficulty.
 *
 * ```javascript
 * function isSuccessWhenTwoAbove(tokensPulled, tokenEffects) {
 *   return tokenEffects.isSuccess(tokensPulled, 2);
 * }
 * ```
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
export function odds(
  numTokensPulled: number,
  bag: Bag,
  outcomes: TokenEffects,
  outcomeFunction: OutcomeFunction
): number {
  const comb: Token[][] = combinations(numTokensPulled, bag.getTokens());
  const filterCondition = (tokensPulled: Token[]) => {
    return outcomeFunction(tokensPulled, outcomes, bag);
  };
  return comb.filter(filterCondition).length / comb.length;
}

/**
 * Similar to `odds` but this time putting tokens back into the bag between
 * each pull.
 *
 * It should be used for abilities like Wendy's:
 *
 * ```javascript
 * let wendyOdds = ArkhamOdds.oddsWithRedraw(
 *   2, theBag, theEffects,
 *   ArkhamOdds.successChoosingBest(0));
 * ```
 *
 * @param {number} numTokensPulled
 *   The number of tokens sequentially pulled from the bag while putting them
 *   back in between each pull..
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
export function oddsWithRedraw(
  numTokensPulled: number,
  bag: Bag,
  outcomes: TokenEffects,
  outcomeFunction: OutcomeFunction
): number {
  const comb: Token[][] = cartesianProduct(
    ...Array(numTokensPulled).fill(bag.getTokens())
  );
  const filterCondition = (tokensPulled: Token[]) => {
    return outcomeFunction(tokensPulled, outcomes, bag);
  };
  return comb.filter(filterCondition).length / comb.length;
}

export * from "./bag";
export * from "./cards";
export * from "./tokens";
