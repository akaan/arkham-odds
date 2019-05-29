import { TokenEffect } from "./TokenEffect";
import { TokenEffectType } from "./TokenEffectType";

/**
 * A token effect that modify the skill value for the test.
 */
export class Modifier implements TokenEffect {
  private _value: number;

  /**
   * Create a new modifier given the modifier value.
   */
  constructor(value: number) {
    this._value = value;
  }

  public getOutcome(): TokenEffectType {
    return TokenEffectType.MODIFIER;
  }

  /**
   * Get the value of this modifier effect.
   *
   * @return {number}
   *   The value of this modifier effect.
   */
  public getValue(): number {
    return this._value;
  }

  public sameAs(other: TokenEffect): boolean {
    if (other instanceof Modifier) {
      return this.getValue() === (other as Modifier).getValue();
    } else {
      return false;
    }
  }
}
