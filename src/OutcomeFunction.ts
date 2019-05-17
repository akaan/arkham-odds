import { Bag } from "./bag";
import { Token, TokenEffects } from "./tokens";

/**
 * An outcome function determine success based of the tokens pulled. The
 * function is passed the mapping of token effects and the bag in case they are
 * needed to determine success.
 *
 * The simplest example just check whether a particular token was pulled:
 * ```javascript
 * const elderSignPulled = (tokensPulled) => {
 *   return tokensPulled[0] === ArkhamOdds.Token.ELDER_SIGN;
 * }
 * ```
 * You can return an outcome function from another function :
 * ```javascript
 * const pulledAToken = (token) => {
 *   return (tokensPulled) => {
 *     return tokensPulled[0] === token;
 *   }
 * }
 * ```
 * A more complex example includes the token effects:
 * ```javascript
 * const isSuccessWhenOverByTwo = (tokensPulled, tokenEffects) => {
 *   return tokenEffects.isSuccess(tokensPulled, 2);
 * }
 * ```
 * See [[TokenEffects]].
 *
 * Finally, some complex cases may require access to the bag. For example an
 * outcome function for [Recall the Future](https://arkhamdb.com/card/04158) may
 * use the bag composition to determine which token to name based on bag
 * composition (see [[recallTheFuture]]).
 *
 * @param {Token[]} tokensPulled
 *   The tokens pulled from the bag.
 * @param {TokenEffects} tokenEffects
 *   Mapping of token effects
 * @param {Bag} bag
 *   The bag from which the tokens were pulled.
 */
export type OutcomeFunction = (
  tokensPulled: Token[],
  tokenEffects?: TokenEffects,
  bag?: Bag
) => boolean;
