import { Token } from '../tokens';
import { removeFirst } from '../utils';

/**
 * A representation of a Chaos Bag with its tokens. A bag is immutable, each
 * modification (adding or removing tokens) creates a new bag and leave the
 * original bag unchanged.
 *
 * ## Examples
 * ### Creating a bag from scratch
 * ```javascript
 * const T = ArkhamOdds.Token;
 * const myBag = new ArkhamOdds.Bag([
 *   T.ELDER_SIGN, T.PLUS_ONE, T.ZERO, T.MINUS_ONE, T.AUTOFAIL
 * ]);
 * ```
 * ### Creating a bag from predefined bags
 * See [[Bags]].
 * ```javascript
 * const myBag = new ArkhamOdds.Bag(ArkhamOdds.Bags.ThePathToCarcosa.Standard);
 * ```
 */
export class Bag {

  private _tokens: Token[];

  /**
   * @param {Token[]} tokens
   *   The tokens to put in the bag. The bag will hold a copy of these tokens
   *   so that changes to the original array of tokens does not affect the bag.
   */
  constructor(tokens: Token[]) {
    this._tokens = tokens.slice(0);
  }

  /**
   * Get tokens in the bag.
   *
   * @return {Token[]}
   *   A copy of tokens in the bag (modification to it will not affect the bag).
   */
  public getTokens(): Token[] {
    return [...this._tokens];
  }

  /**
   * Create a new bag with the specified tokens added to it. The original bag is
   * unchanged which makes it handy to compare odds based on bag composition.
   *
   * ## Example
   * Comparing odds of success when a token is added to the bag.
   * ```javascript
   * const bag = new ArkhamOdds.Bag(ArkhamOdds.Bags.ThePathToCarcosa.Standard);
   * const bagWithTabletAdded = bag.addTokens([ArkhamOdds.Token.TABLET]);
   *
   * const effects = ArkhamOdds.DefaultTokenEffects
   *   .merge(new ArkhamOdds.TokenEffects([
   *     [ArkhamOdds.Token.SKULL, new ArkhamOdds.Modifier(-1)],
   *     [ArkhamOdds.Token.CULTIST, new ArkhamOdds.Modifier(-2)],
   *     [ArkhamOdds.Token.TABLET, new ArkhamOdds.Modifier(-2)],
   *     [ArkhamOdds.Token.ELDER_THING, new ArkhamOdds.Modifier(-2)],
   *     [ArkhamOdds.Token.ELDER_SIGN, new ArkhamOdds.Modifier(2)]
   * ]));
   *
   * const [odds, success] = [ArkhamOdds.odds, ArkhamOdds.success];
   * console.log(
   *   odds(1, bag, effects, success(2))
   *   - odds(1, bagWithTabletAdded, effects, success(2)));
   * ```
   *
   * @param {Token[]} tokens
   *   The tokens to add to the bag.
   * @return {Bag}
   *   A new bag.
   */
  public addTokens(tokens: Token[]): Bag {
    return new Bag(this._tokens.concat(tokens));
  }

  /**
   * Returns a new bag with the specified token removed. The original bag is
   * unchanged which makes it handy to compare odds based on bag composition.
   * This is the method to use for seal effects like
   * [The Chthonian Stone](https://arkhamdb.com/card/04030)
   *
   * ## Example
   * ```javascript
   * const bag = new ArkhamOdds.Bag(ArkhamOdds.Bags.ThePathToCarcosa.Standard);
   * const theChthonianStone = bag.removeToken(ArkhamOdds.Token.CULTIST);
   * ```
   *
   * @param {Token} token
   *   The token to remove.
   * @return {Bag}
   *   A new bag with the token removed. If the original bag does not contain
   *   an occurrence of the specified token, the method still returns a copy of
   *   the original bag even if there are no differences in their compositions.
   */
  public removeToken(token: Token): Bag {
    return new Bag(removeFirst(this._tokens, token));
  }

}
