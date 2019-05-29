import { TokenEffect } from "./TokenEffect";
import { TokenEffectType } from "./TokenEffectType";

/**
 * A token effect that is an autofail.
 */
export class Autofail implements TokenEffect {
  public getOutcome() {
    return TokenEffectType.AUTOFAIL;
  }

  public sameAs(other: TokenEffect): boolean {
    return other instanceof Autofail;
  }
}
