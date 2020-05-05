// tslint:disable:no-unused-expression
import { expect } from "chai";
import "mocha";
import { Bag, Modifier, odds, success, Token, TokenEffects } from "../src";

let effects: TokenEffects;

describe("Odds functions", () => {
  before(() => {
    effects = new TokenEffects([
      [Token.PLUS_ONE, new Modifier(1)],
      [Token.MINUS_ONE, new Modifier(-1)],
      [Token.CULTIST, new Modifier(-1, true)]
    ]);
  });

  describe("odds", () => {
    it("returns 0.5 when pulling 1 token if half the tokens results in a success", () => {
      const bag = new Bag([Token.PLUS_ONE, Token.MINUS_ONE]);
      const oddsOfSuccess = odds(1, bag, effects, success(0));
      expect(oddsOfSuccess).to.equal(0.5);
    });

    it("takes into account tokens with a redraw effect", () => {
      const bag = new Bag([Token.PLUS_ONE, Token.MINUS_ONE, Token.CULTIST]);
      const oddsOfSuccess = odds(1, bag, effects, success(-1));
      /* Possible draws are :
       * - +1
       * - -1
       * - Cultist and +1
       * - Cultist and -1
       * If testing at -1, only +1 result in a success.
       */
      expect(oddsOfSuccess).to.equal(0.25);
    });
  });
});
