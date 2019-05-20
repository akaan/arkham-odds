import { Autofail } from "./Autofail";
import { Modifier } from "./Modifier";
import { Token } from "./Token";
import { TokenEffect } from "./TokenEffect";
import { TokenEffectType } from "./TokenEffectType";

type TokenEffectMapping = [Token, TokenEffect];

/**
 * A immutable mapping of token effects.
 */
export class TokenEffects {
  private _map: Map<Token, TokenEffect>;

  constructor(mappings?: TokenEffectMapping[]) {
    if (mappings) {
      this._map = new Map(mappings);
    } else {
      this._map = new Map<Token, TokenEffect>();
    }
  }

  /**
   * Get the effect of the specified token.
   *
   * @param {Token} token
   *   The token from which we want the effect.
   * @return {TokenEffect}
   *   The effect of the specified token.
   */
  public getEffect(token: Token): TokenEffect {
    return this._map.get(token);
  }

  /**
   * Sets the effect for the specified token and returns a new mapping (the
   * original mapping is untouched).
   *
   * @param {Token} token
   *   The token to set the effect for.
   * @param {TokenEffect} effect
   *   The effect.
   * @return {TokenEffects}
   *   The whole mapping.
   */
  public setEffect(token: Token, effect: TokenEffect): TokenEffects {
    const newMap = new Map(this._map);
    newMap.set(token, effect);

    const newEffects = new TokenEffects();
    newEffects._map = newMap;

    return newEffects;
  }

  /**
   * Sets multiple effects at once a returns a new mapping.
   *
   * @param {TokenEffectMapping[]} mappings
   *   An array of token/effect pairs.
   * @return {TokenEffects}
   *   A new mapping.
   */
  public setEffects(mappings: TokenEffectMapping[]): TokenEffects {
    const newMap = new Map(this._map);
    mappings.forEach(([token, effect]) => {
      newMap.set(token, effect);
    });

    const newEffects = new TokenEffects();
    newEffects._map = newMap;

    return newEffects;
  }

  /**
   * Constructs a new token effects map by adding or overriding effects from
   * another token effects map.
   *
   * @param {TokenEffects}
   *   The token effects map to add.
   * @return {TokenEffects}
   *   A new token effects map.
   */
  public merge(otherEffects: TokenEffects): TokenEffects {
    const newTokenEffects = new TokenEffects();
    this._map.forEach((effect, token) => {
      newTokenEffects._map.set(token, effect);
    });
    otherEffects._map.forEach((effect, token) => {
      newTokenEffects._map.set(token, effect);
    });
    return newTokenEffects;
  }

  /**
   * Indicate of the specified token is autosuccess for this bag.
   *
   * @method isTokenAutoSuccess
   * @param {Token} token
   *   The token.
   * @return {boolean} `true` if the token is autosuccess, `false` otherwise.
   */
  public isTokenAutoSuccess(token: Token): boolean {
    return this._map.get(token).getOutcome() === TokenEffectType.AUTOSUCCESS;
  }

  /**
   * Indicate of the specified token is autofail for this bag.
   *
   * @method isTokenAutoFail
   * @param {Token} token
   *   The token.
   * @return {boolean} `true` if the token is autofail, `false` otherwise.
   */
  public isTokenAutoFail(token: Token): boolean {
    return this._map.get(token).getOutcome() === TokenEffectType.AUTOFAIL;
  }

  /**
   * Get the modifier value of the specified token for this bag.
   *
   * @method getTokenModifier
   * @param {Token} token
   *   The token.
   * @return {number} The modifier value.
   * @throws {TypeError} if the specified token is an autosuccess or an autofail.
   */
  public getTokenModifier(token: Token): number {
    if (this._map.get(token).getOutcome() !== TokenEffectType.MODIFIER) {
      throw new TypeError(`token ${token} is not a modifier`);
    }
    return (this._map.get(token) as Modifier).getValue();
  }

  /**
   * Sort provided tokens from best outcome to worse.
   *
   * @method sortByBestOutcomeDesc
   * @param {Token[]} tokens
   *   The tokens to sort.
   * @return {Token[]} Sorted tokens.
   */
  public sortByBestOutcomeDesc(tokens: Token[]): Token[] {
    return tokens.sort((tokenA: Token, tokenB: Token) => {
      if (tokenA === tokenB) {
        return 0;
      }
      if (this.isTokenAutoSuccess(tokenA) && !this.isTokenAutoSuccess(tokenB)) {
        return -1;
      }
      if (this.isTokenAutoSuccess(tokenB) && !this.isTokenAutoSuccess(tokenA)) {
        return 1;
      }
      if (this.isTokenAutoFail(tokenA) && !this.isTokenAutoFail(tokenB)) {
        return 1;
      }
      if (this.isTokenAutoFail(tokenB) && !this.isTokenAutoFail(tokenA)) {
        return -1;
      }
      return this.getTokenModifier(tokenB) - this.getTokenModifier(tokenA);
    });
  }

  /**
   * Return wether or not pulling these tokens result in a success given the
   * difference between to total skill value and the test difficulty. If
   * several tokens are provided and none of them are autosuccess or autofails,
   * their modifier values are added.
   *
   * @method isSuccess
   * @param {Token[]} tokens
   *   The tokens pulled from the bag.
   * @param {number} skillMinusDifficulty
   *   The difference between the total skill value and the difficulty fo the
   *   test.
   */
  public isSuccess(tokens: Token[], skillMinusDifficulty: number): boolean {
    // Autofail prevails
    if (tokens.some(t => this.isTokenAutoFail(t))) {
      return false;
    }
    if (tokens.some(t => this.isTokenAutoSuccess(t))) {
      return true;
    }
    return (
      tokens.reduce((sum, t) => sum + this.getTokenModifier(t), 0) +
        skillMinusDifficulty >=
      0
    );
  }
}

export const DefaultTokenEffects: TokenEffects = new TokenEffects([
  [Token.PLUS_ONE, new Modifier(1)],
  [Token.PLUS_ONE, new Modifier(1)],
  [Token.ZERO, new Modifier(0)],
  [Token.MINUS_ONE, new Modifier(-1)],
  [Token.MINUS_TWO, new Modifier(-2)],
  [Token.MINUS_THREE, new Modifier(-3)],
  [Token.MINUS_FOUR, new Modifier(-4)],
  [Token.MINUS_FIVE, new Modifier(-5)],
  [Token.MINUS_SIX, new Modifier(-6)],
  [Token.MINUS_SEVEN, new Modifier(-7)],
  [Token.MINUS_EIGHT, new Modifier(-8)],
  [Token.AUTOFAIL, new Autofail()]
]);
