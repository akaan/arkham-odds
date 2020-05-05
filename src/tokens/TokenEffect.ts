import { TokenEffectType } from "./TokenEffectType";

/**
 * Represent the effect of a token.
 */
export interface TokenEffect {
  /**
   * Get the effect type (autosuccess, autofail or modifier).
   *
   * @return {TokenEffectType}
   *   Token effect type.
   */
  getOutcome(): TokenEffectType;

  /**
   * Tells if this token effect asks for a redraw..
   *
   * @return {boolean}
   *   True if this token effect asks for a redraw.
   */
  isRedraw(): boolean;

  /**
   * Asserts if the other supplied effect represent the same effect.
   *
   * @param {T} other
   *   The other effect
   * @return {boolean}
   *   True if same, false otherwise.
   */
  sameAs(other: TokenEffect): boolean;
}
