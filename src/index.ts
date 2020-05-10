import { Bag } from "./bag";
import { OutcomeFunction } from "./OutcomeFunction";
import { Token, TokenEffects } from "./tokens";
import {
  allCombinations,
  cartesianProduct,
  combinations,
  factorial,
  flatten
} from "./utils";

export type OddsFn = (
  numTokensPulled: number,
  bag: Bag,
  outcomes: TokenEffects,
  outcomeFunction: OutcomeFunction
) => number;

/**
 * Compute the odds of a particular combination of tokens based on how many
 * tokens are not "redraw" tokens.
 * It took me a lot of time to get this formula right. Many thanks to those who
 * helped me get it.
 * TODO: Use fraction.js for precise calculations
 *
 * @param {number} totalNumberOfTokens
 *   The total number of tokens in the bag
 * @param {number} numberOfTokensInCombination
 *   The number of tokens in the combination
 * @param {number} numberOfNonRedrawTokensInCombination
 *   The number of tokens in this combination that are not "redraw" tokens
 * @return {number}
 *   The odds of this combination
 */
function oddsOfCombination(
  totalNumberOfTokens: number,
  numberOfTokensInCombination: number,
  numberOfNonRedrawTokensInCombination: number
): number {
  return (
    (factorial(totalNumberOfTokens - numberOfTokensInCombination) *
      factorial(numberOfTokensInCombination - 1) *
      numberOfNonRedrawTokensInCombination) /
    factorial(totalNumberOfTokens)
  );
}

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
 * @param {TokenEffects} outcomes
 *   The token effects.
 * @param {OutcomeFunction} outcomeFunction
 *   The outcome function returning `true` if the pulled tokens represent a
 *   desired outcome and `false` otherwise.
 *   The first argument passed to the function are the tokens pulled, the second
 *   is the token effects map and the third is the bag.
 *   The outcome function should always assume that redraw tokens are counted
 *   and that pulled tokens contains the result of redrawing.
 * @return {number}
 *   The odds of the desired outcome.
 */
export const odds: OddsFn = (
  numTokensPulled: number,
  bag: Bag,
  outcomes: TokenEffects,
  outcomeFunction: OutcomeFunction
): number => {
  const tokensWithRedraw = bag
    .getTokens()
    .filter(t => outcomes.getEffect(t).isRedraw());
  const tokensWithoutRedraw = bag
    .getTokens()
    .filter(t => !outcomes.getEffect(t).isRedraw());

  const combinationsOfRedrawTokens = allCombinations(tokensWithRedraw);
  const combinationsOfNonRedrawTokens = combinations(
    numTokensPulled,
    tokensWithoutRedraw
  );

  const comb: Token[][] = cartesianProduct(
    combinationsOfRedrawTokens,
    combinationsOfNonRedrawTokens
  ).map(c => flatten(c));

  const filterCondition = (tokensPulled: Token[]) => {
    return outcomeFunction(tokensPulled, outcomes, bag);
  };

  const totalNumberOfTokens = bag.getTokens().length;
  return (
    comb
      .filter(filterCondition) // Only successful combinations
      .map(successfulComb => {
        const numOfNonRedrawTokens = successfulComb.filter(
          token => !outcomes.getEffect(token).isRedraw()
        ).length;
        // Compute the odds of success of this particular combination
        return oddsOfCombination(
          totalNumberOfTokens,
          successfulComb.length,
          numOfNonRedrawTokens
        );
      })
      // Sum up odds of success for successful combinations
      .reduce((totalOdds, oddsOfComb) => totalOdds + oddsOfComb, 0)
  );
};

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
 * TODO Update this function to account for tokens with a redraw effect.
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
export const oddsWithRedraw: OddsFn = (
  numTokensPulled: number,
  bag: Bag,
  outcomes: TokenEffects,
  outcomeFunction: OutcomeFunction
): number => {
  const comb: Token[][] = cartesianProduct(
    ...Array(numTokensPulled).fill(bag.getTokens())
  );
  const filterCondition = (tokensPulled: Token[]) => {
    return outcomeFunction(tokensPulled, outcomes, bag);
  };
  return comb.filter(filterCondition).length / comb.length;
};

export * from "./bag";
export * from "./cards";
export * from "./tokens";
export * from "./OutcomeFunction";
