import { Token } from '../tokens';
import { removeFirst } from '../utils';

/**
 * A representation of a Chaos Bag. A bag is immutable.
 *
 * @class Bag
 */
export class Bag {

  private _tokens: Token[];

  /**
   * @constructor
   * @param {Token[]} tokens The tokens to put in the bag.
   */
  constructor(tokens: Token[]) {
    this._tokens = tokens.slice(0);
  }

  /**
   * Get tokens in the bag.
   *
   * @return {Token[]}
   *   Tokens in the bag.
   */
  public getTokens(): Token[] {
    return this._tokens;
  }

  /**
   * Create a new bag with the specified tokens added to it.
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
   * Returns a new bag with the specified token removed.
   *
   * @param {Token} token
   *   The token to remove.
   * @return {Bag}
   *   A new bag with the token removed.
   */
  public removeToken(token: Token): Bag {
    return new Bag(removeFirst(this._tokens, token));
  }

}
