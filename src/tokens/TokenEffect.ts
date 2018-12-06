import { TokenEffectType } from './TokenEffectType';

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

}
