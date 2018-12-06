import { OutcomeFunction } from './OutcomeFunction';
import { BadTokens, Token } from './tokens';

/**
 * Basically determine success based on difference between skill value and
 * difficulty.
 *
 * @param {number} skillMinusDifficulty The difference between the total skill
 *  value and the difficulty.
 * @return {OutcomeFunction}
 *    An outcome function determining success.
 */
export function success(skillMinusDifficulty: number): OutcomeFunction {
  return (tokensPulled, tokenEffects) => {
    return tokenEffects.isSuccess(tokensPulled, skillMinusDifficulty);
  };
}

export function ritualCandles(skillMinusDifficulty: number): OutcomeFunction {
  return (tokensPulled, tokenEffects) => {
    const candleBonus = tokensPulled.reduce((bonus, token) => {
      if (BadTokens.includes(token)) {
        return bonus + 1;
      } else {
        return bonus;
      }
    }, 0);
    return tokenEffects.isSuccess(tokensPulled, skillMinusDifficulty + candleBonus);
  };
}

/**
 * Choose the 2 best tokens.
 *
 * @param {number} skillMinusDifficulty The difference between the total skill
 *  value and the difficulty.
 * @return {OutcomeFunction} An outcome function determining if the two chosen
 *  tokens result in a success.
 */
export function oliveMcBride(skillMinusDifficulty: number): OutcomeFunction {
  return (tokensPulled, tokenEffects) => {
    const sorted: Token[] = tokenEffects.sortByBestOutcomeDesc(tokensPulled);
    const chosen: Token[] = sorted.slice(0, 2);
    return tokenEffects.isSuccess(chosen, skillMinusDifficulty);
  };
}

/**
 * Choose a Skull if able and the best of remaining tokens.
 *
 * @param {number} skillMinusDifficulty The difference between the total skill
 *  value and the difficulty.
 * @return {OutcomeFunction} An outcome function determining if the tokens
 *   include a Skull and that this Skull + the best of remaining tokens
 *   result in a success.
 */
export function oliveMcBrideWithSkull(skillMinusDifficulty: number): OutcomeFunction {
  return (tokensPulled, tokenEffects) => {
    if (!tokensPulled.includes(Token.SKULL)) { return false; }

    const skull: Token[] = tokensPulled.splice(tokensPulled.indexOf(Token.SKULL), 1);
    const secondToken: Token[] = tokenEffects.sortByBestOutcomeDesc(tokensPulled).slice(0, 1);
    return tokenEffects.isSuccess(skull.concat(secondToken), skillMinusDifficulty);
  };
}

/**
 * Determine success using Recall the Future.
 * The strategy applied for Recall the Future is the following :
 * - determine which tokens can be turned from failure to success using the
 *   +2 bonus from Recall the Future
 * - choose the token with the most occurrences in the bag
 *
 * @param {number} skillMinusDifficulty The difference between the total skill
 *  value and the difficulty.
 * @return {OutcomeFunction}
 *    An outcome function determining success.
 */
export function recallTheFuture(skillMinusDifficulty: number): OutcomeFunction {
  return (tokensPulled, tokenEffects, bag) => {

    // TODO Move this out of the outcome function by adding the bag and the
    // effects as argument to the recallTheFuture function.

    // Get tokens that can be turned to successes
    const canBeTurnedToSuccesses = bag.getTokens().filter((t) => {
      return !tokenEffects.isSuccess([t], skillMinusDifficulty)
        && tokenEffects.isSuccess([t], skillMinusDifficulty + 2);
    });

    // Counting them
    const countByToken = canBeTurnedToSuccesses.reduce((acc: Map<Token, number>, t: Token) => {
      if (acc.has(t)) {
        acc.set(t, acc.get(t) + 1);
      } else {
        acc.set(t, 1);
      }
      return acc;
    }, new Map<Token, number>());

    // Choosing the one with the most occurrences
    const chosenToken: Token | null = Array.from(countByToken.entries())
      .reduce(([previousToken, previousCount], [token, count]) => {
        if (count > previousCount) {
          return [token, count];
        } else {
          return [previousToken, previousCount];
        }
      }, [null, 0])[0];

    if (chosenToken !== null && tokensPulled.includes(chosenToken)) {
      return tokenEffects.isSuccess(tokensPulled, skillMinusDifficulty + 2);
    } else {
      return tokenEffects.isSuccess(tokensPulled, skillMinusDifficulty);
    }

  };
}
