import { Bag } from "./bag";
import { OutcomeFunction } from "./OutcomeFunction";
import { BadTokens, Token, TokenEffects } from "./tokens";

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
export function successChoosingBest(
  skillMinusDifficulty: number
): OutcomeFunction {
  return (tokensPulled, tokenEffects) => {
    const { redrawTokens, nonRedrawTokens } = tokenEffects.separateRedrawTokens(
      tokensPulled
    );
    const sorted: Token[] = tokenEffects.sortByBestOutcomeDesc(nonRedrawTokens);
    const chosen: Token[] = sorted.slice(0, 1);
    return tokenEffects.isSuccess(
      chosen.concat(redrawTokens),
      skillMinusDifficulty
    );
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
    return tokenEffects.isSuccess(
      tokensPulled,
      skillMinusDifficulty + candleBonus
    );
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
    const { redrawTokens, nonRedrawTokens } = tokenEffects.separateRedrawTokens(
      tokensPulled
    );
    const sorted: Token[] = tokenEffects.sortByBestOutcomeDesc(nonRedrawTokens);
    const chosen: Token[] = sorted.slice(0, 2);
    return tokenEffects.isSuccess(
      chosen.concat(redrawTokens),
      skillMinusDifficulty
    );
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
export function oliveMcBrideWithSkull(
  skillMinusDifficulty: number
): OutcomeFunction {
  return (tokensPulled, tokenEffects) => {
    if (!tokensPulled.includes(Token.SKULL)) {
      return false;
    }

    const copyOfTokensPulled = [...tokensPulled];
    const skull: Token[] = copyOfTokensPulled.splice(
      copyOfTokensPulled.indexOf(Token.SKULL),
      1
    );
    const { redrawTokens, nonRedrawTokens } = tokenEffects.separateRedrawTokens(
      copyOfTokensPulled
    );
    const secondToken: Token[] = tokenEffects
      .sortByBestOutcomeDesc(nonRedrawTokens)
      .slice(0, 1);
    return tokenEffects.isSuccess(
      skull.concat(secondToken, redrawTokens),
      skillMinusDifficulty
    );
  };
}

/**
 * Choose the right token to call with Recall the Future which is, among tokens
 * that can be turned to success using the +2 bonus, the one which has the most
 * occurrences in the bag.
 * Note that it will take into account redraw tokens. For example, when testing
 * at -2, it will not choose -3 even though there is a Bless token (+2, redraw)
 * in the bag.
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
function chooseTokenForRecallTheFuture(
  skillMinusDifficulty: number,
  bag: Bag,
  tokenEffects: TokenEffects
): Token | null {
  // Get tokens that can be turned to successes
  const canBeTurnedToSuccesses = bag.getTokens().filter(t => {
    return (
      !tokenEffects.isSuccess([t], skillMinusDifficulty) &&
      tokenEffects.isSuccess([t], skillMinusDifficulty + 2)
    );
  });

  // Counting them
  const countByToken = canBeTurnedToSuccesses.reduce(
    (acc: Map<Token, number>, t: Token) => {
      if (acc.has(t)) {
        acc.set(t, acc.get(t) + 1);
      } else {
        acc.set(t, 1);
      }
      return acc;
    },
    new Map<Token, number>()
  );

  // Choosing the one with the most occurrences
  const chosenToken: Token | null = Array.from(countByToken.entries()).reduce(
    ([previousToken, previousCount], [token, count]) => {
      if (count > previousCount) {
        return [token, count];
      } else {
        return [previousToken, previousCount];
      }
    },
    [null, 0]
  )[0];

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
      chosenToken = chooseTokenForRecallTheFuture(
        skillMinusDifficulty,
        bag,
        tokenEffects
      );
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
  return (tokensPulled, tokenEffects) => {
    let chosenToken: Token;
    const { redrawTokens, nonRedrawTokens } = tokenEffects.separateRedrawTokens(
      tokensPulled
    );

    if (nonRedrawTokens.some(t => BadTokens.includes(t))) {
      const onlyBad = nonRedrawTokens.filter(t => BadTokens.includes(t));
      chosenToken = tokenEffects.sortByBestOutcomeDesc(onlyBad)[0];
    } else {
      chosenToken = tokenEffects.sortByBestOutcomeDesc(nonRedrawTokens)[0];
    }

    return tokenEffects.isSuccess(
      [chosenToken].concat(redrawTokens),
      skillMinusDifficulty
    );
  };
}

/**
 * Check if a list of elements contains at least one of the elements provided as
 * second argument.
 *
 * @param {T[]} elements The list of elements to check.
 * @param {T[]} elementsSearched The list of elements to look for.
 * @return {boolean} True if the list provided as first argument contains at
 *  least one of the elements provided as second argument.
 */
function containsAtLeastOneAmong<T>(
  elements: T[],
  elementsSearched: T[]
): boolean {
  return elements.some(elem => elementsSearched.includes(elem));
}

/**
 * Check if a list of elements does not contains any of the elements provided as
 * second argument.
 *
 * @param {T[]} elements The list of elements to check.
 * @param {T[]} elementsSearched The list of elements to look for.
 * @return {boolean} True if the list provided as first argument does contains
 *  not contain any of the elements provided as second argument.
 */
function containsNoneOf<T>(elements: T[], elementsSearched: T[]): boolean {
  return elements.every(elem => !elementsSearched.includes(elem));
}

/**
 * Determine success and doing exactly 1 damage using .35 Winchester.
 *
 * @param {number} skillMinusDifficulty The difference between the total skill
 *  value and the difficulty.
 * @return {OutcomeFunction}
 *    An outcome function determining success.
 */
export function winchesterDoing1Damage(
  skillMinusDifficulty: number
): OutcomeFunction {
  return (tokensPulled, tokenEffects) => {
    return (
      containsNoneOf(tokensPulled, [
        Token.ELDER_SIGN,
        Token.PLUS_ONE,
        Token.ZERO
      ]) && tokenEffects.isSuccess(tokensPulled, skillMinusDifficulty)
    );
  };
}

/**
 * Determine success and doing exactly 3 damage using .35 Winchester.
 *
 * @param {number} skillMinusDifficulty The difference between the total skill
 *  value and the difficulty.
 * @return {OutcomeFunction}
 *    An outcome function determining success.
 */
export function winchesterDoing3Damage(
  skillMinusDifficulty: number
): OutcomeFunction {
  return (tokensPulled, tokenEffects) => {
    return (
      containsAtLeastOneAmong(tokensPulled, [
        Token.ELDER_SIGN,
        Token.PLUS_ONE,
        Token.ZERO
      ]) && tokenEffects.isSuccess(tokensPulled, skillMinusDifficulty)
    );
  };
}

/**
 * Determine success and doing exactly 3 damage using .35 Winchester and Olive McBride.
 *
 * @param {number} skillMinusDifficulty The difference between the total skill
 *  value and the difficulty.
 * @return {OutcomeFunction}
 *    An outcome function determining success.
 */
export function oliveMcBrideAndWinchesterDoing1Damage(
  skillMinusDifficulty: number
): OutcomeFunction {
  return (tokensPulled, tokenEffects) => {
    const { redrawTokens, nonRedrawTokens } = tokenEffects.separateRedrawTokens(
      tokensPulled
    );
    const sorted: Token[] = tokenEffects.sortByBestOutcomeDesc(nonRedrawTokens);
    const chosen: Token[] = sorted.slice(0, 2);
    return (
      containsNoneOf(chosen, [Token.ELDER_SIGN, Token.PLUS_ONE, Token.ZERO]) &&
      tokenEffects.isSuccess(chosen.concat(redrawTokens), skillMinusDifficulty)
    );
  };
}

/**
 * Determine success and doing exactly 3 damage using .35 Winchester and Olive McBride.
 *
 * @param {number} skillMinusDifficulty The difference between the total skill
 *  value and the difficulty.
 * @return {OutcomeFunction}
 *    An outcome function determining success.
 */
export function oliveMcBrideAndWinchesterDoing3Damage(
  skillMinusDifficulty: number
): OutcomeFunction {
  return (tokensPulled, tokenEffects) => {
    const { redrawTokens, nonRedrawTokens } = tokenEffects.separateRedrawTokens(
      tokensPulled
    );
    const sorted: Token[] = tokenEffects.sortByBestOutcomeDesc(nonRedrawTokens);
    const chosen: Token[] = sorted.slice(0, 2);
    return (
      containsAtLeastOneAmong(chosen, [
        Token.ELDER_SIGN,
        Token.PLUS_ONE,
        Token.ZERO
      ]) &&
      tokenEffects.isSuccess(chosen.concat(redrawTokens), skillMinusDifficulty)
    );
  };
}

/**
 * Determine success using Jacqueline Fine's ability to draw 3 tokens and cancel
 * 2 non-tentacle tokens or a tentacle token.
 *
 * @param {number} skillMinusDifficulty The difference between the total skill
 *  value and the difficulty.
 * @return {OutcomeFunction}
 *    An outcome function determining success.
 */
export function jacqueline(skillMinusDifficulty: number): OutcomeFunction {
  return (tokensPulled, tokenEffects) => {
    if (tokensPulled.includes(Token.AUTOFAIL)) {
      return tokenEffects.isSuccess(
        tokensPulled.filter(t => t !== Token.AUTOFAIL),
        skillMinusDifficulty
      );
    } else {
      const {
        redrawTokens,
        nonRedrawTokens
      } = tokenEffects.separateRedrawTokens(tokensPulled);
      const sorted: Token[] = tokenEffects.sortByBestOutcomeDesc(
        nonRedrawTokens
      );
      return tokenEffects.isSuccess(
        sorted.slice(0, -2).concat(redrawTokens),
        skillMinusDifficulty
      );
    }
  };
}
