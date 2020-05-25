function gcd(a: number, b: number): number {
  if (a === 0 || b === 0) {
    return 0;
  }
  if (a === b) {
    return a;
  }
  if (a > b) {
    return gcd(a - b, b);
  }
  return gcd(a, b - a);
}

export class Fraction {
  private _numerator: number;
  private _denominator: number;

  constructor(numerator: number, denominator: number) {
    this._numerator = numerator;
    this._denominator = denominator;
    this._reduce();
  }

  public add(other: Fraction): Fraction {
    return new Fraction(
      this._numerator * other._denominator +
        other._numerator * this._denominator,
      this._denominator * other._denominator
    );
  }

  public valueOf(): number {
    return this._numerator / this._denominator;
  }

  public sameAs(other: Fraction): boolean {
    this._reduce();
    other._reduce();
    return (
      this._numerator === other._numerator &&
      this._denominator === other._denominator
    );
  }

  private _reduce(): void {
    const div = gcd(this._numerator, this._denominator);
    if (div) {
      this._numerator = this._numerator / div;
      this._denominator = this._denominator / div;
    }
  }
}
