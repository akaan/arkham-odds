function gcd(a: number, b: number): number {
  if (b > a) {
    return gcd(b, a);
  }

  if (b === 0) {
    return a;
  } else {
    return gcd(b, a % b);
  }
}

/**
 * A fraction with a numerator and a denominator.
 */
export class Fraction {
  private _numerator: number;
  private _denominator: number;

  /**
   * Creates and immediately reduce the fraction using the greatest common
   * divider of the numerator and denominator.
   *
   * @param {number} numerator
   *   The numerator of this fraction.
   * @param {number} denominator
   *   The denominator of this fraction.
   */
  constructor(numerator: number, denominator: number) {
    this._numerator = numerator;
    this._denominator = denominator;
    this._reduce();
  }

  /**
   * Return a new fraction by adding the given fraction to this fraction.
   *
   * @param {Fraction} other
   *   The fraction to add to this one.
   * @return {Fraction}
   *   A new fraction obtained by adding the 2 fractions.
   */
  public add(other: Fraction): Fraction {
    return new Fraction(
      this._numerator * other._denominator +
        other._numerator * this._denominator,
      this._denominator * other._denominator
    );
  }

  /**
   * Returns the number value of this fraction.
   *
   * @return {number}
   *   The number value of this fraction
   */
  public valueOf(): number {
    return this._numerator / this._denominator;
  }

  /**
   * Checks if this fraction is equal to the provided fraction.
   *
   * @param {Fraction} other
   *   The fraction to compare to.
   * @return {boolean}
   *   `true` if the 2 fractions are equal, `false` else.
   */
  public sameAs(other: Fraction): boolean {
    this._reduce();
    other._reduce();
    return (
      this._numerator === other._numerator &&
      this._denominator === other._denominator
    );
  }

  /**
   * Reduce the fraction using the greatest common divider of the numerator
   * and the denominator.
   */
  private _reduce(): void {
    const div = gcd(this._numerator, this._denominator);
    if (div) {
      this._numerator = this._numerator / div;
      this._denominator = this._denominator / div;
    }
  }
}
