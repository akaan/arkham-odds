import { Bag } from './bag';
import { OutcomeFunction } from './OutcomeFunction';
import { BadTokens, Token, TokenEffects } from './tokens';

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

/**
 * Determine success when pulling several tokens and choosing the best to
 * resolve and ignore to others.
 *
 * @param {number} skillMinusDifficulty The difference between the total skill
 *  value and the difficulty.
 * @return {OutcomeFunction}
 *    An outcome function determining success.
 */
export function successChoosingBest(skillMinusDifficulty: number): OutcomeFunction {
  return (tokensPulled, tokenEffects) => {
    const sorted: Token[] = tokenEffects.sortByBestOutcomeDesc(tokensPulled);
    const chosen: Token[] = sorted.slice(0, 1);
    return tokenEffects.isSuccess(chosen, skillMinusDifficulty);
  };
}

/*
 * Determine success when using a single copy of Ritual Candles.
 *
 * @param {number} skillMinusDifficulty The difference between the total skill
 *  value and the difficulty.
 * @return {OutcomeFunction}
 *    An outcome function determining success.
 */
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
 * Choose the right token to call with Recall the Future which is, among tokens
 * that can be turned to success using the +2 bonus, the one which has the most
 * occurrences in the bag.
 *
 * @param {number} skillMinusDifficulty
 *   value and the difficulty.
 * @param {Bag} bag
 *   The Chaos bag
 * @param {TokenEffects} tokenEffects
 *   The token effects mapping.
 * @return {Token | null}
 *   The best token to call or `null` if there is none.
 */
function chooseTokenForRecallTheFuture(skillMinusDifficulty: number,
                                       bag: Bag,
                                       tokenEffects: TokenEffects): Token | null {

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

  return chosenToken;
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
  let chosenToken: Token | null | undefined;

  return (tokensPulled, tokenEffects, bag) => {

    if (chosenToken === undefined) {
      chosenToken = chooseTokenForRecallTheFuture(skillMinusDifficulty, bag, tokenEffects);
    }

    if (chosenToken !== null && tokensPulled.includes(chosenToken)) {
      return tokenEffects.isSuccess(tokensPulled, skillMinusDifficulty + 2);
    } else {
      return tokenEffects.isSuccess(tokensPulled, skillMinusDifficulty);
    }

  };
}

/**
 * Determine success using Dark Prophecy.
 *
 * @param {number} skillMinusDifficulty The difference between the total skill
 *  value and the difficulty.
 * @return {OutcomeFunction}
 *    An outcome function determining success.
 */
export function darkProphecy(skillMinusDifficulty: number): OutcomeFunction {
  return (tokensPulled, tokenEffects, bag) => {
    let chosenToken: Token;

    if (tokensPulled.some((t) => BadTokens.includes(t))) {
      const onlyBad = tokensPulled.filter((t) => BadTokens.includes(t));
      chosenToken = tokenEffects.sortByBestOutcomeDesc(onlyBad)[0];
    } else {
      chosenToken = tokenEffects.sortByBestOutcomeDesc(tokensPulled)[0];
    }

    return tokenEffects.isSuccess([chosenToken], skillMinusDifficulty);
  };
}