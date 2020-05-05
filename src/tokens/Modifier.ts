import { TokenEffect } from "./TokenEffect";
import { TokenEffectType } from "./TokenEffectType";

/**
 * A token effect that modify the skill value for the test.
 */
export class Modifier implements TokenEffect {
  private _value: number;
  private _isRedraw: boolean;

  /**
   * Create a new modifier given the modifier value.
   */
  constructor(value: number, isRedraw = false) {
    this._value = value;
    this._isRedraw = isRedraw;
  }

  public getOutcome(): TokenEffectType {
    return TokenEffectType.MODIFIER;
  }

  public isRedraw() {
    return this._isRedraw;
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
      return (
        this.getValue() === (other as Modifier).getValue() &&
        this.isRedraw() === (other as Modifier).isRedraw()
      );
    } else {
      return false;
    }
  }
}
