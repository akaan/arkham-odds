import { TokenEffect } from "./TokenEffect";
import { TokenEffectType } from "./TokenEffectType";

/**
 * A token effect that is an autosuccess.
 */
export class Autosuccess implements TokenEffect {
  public getOutcome() {
    return TokenEffectType.AUTOSUCCESS;
  }

  public isRedraw() {
    return false;
  }

  public sameAs(other: TokenEffect): boolean {
    return other instanceof Autosuccess;
  }
}
