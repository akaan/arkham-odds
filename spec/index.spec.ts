// tslint:disable:no-unused-expression
import { expect } from "chai";
import "mocha";
import {
  Bag,
  Modifier,
  odds,
  oddsWithRedraw,
  success,
  successChoosingBest,
  Token,
  TokenEffects
} from "../src";

let effects: TokenEffects;

const PRECISION = 0.0000000001;

describe("Odds functions", () => {
  before(() => {
    effects = new TokenEffects([
      [Token.PLUS_ONE, new Modifier(1)],
      [Token.MINUS_ONE, new Modifier(-1)],
      [Token.MINUS_TWO, new Modifier(-2)],
      [Token.CULTIST, new Modifier(-1, true)]
    ]);
  });

  describe("odds", () => {
    it("returns 0.5 when pulling 1 token if half the tokens results in a success", () => {
      const bag = new Bag([Token.PLUS_ONE, Token.MINUS_ONE]);
      const oddsOfSuccess = odds(1, bag, effects, success(0));
      expect(oddsOfSuccess).to.equal(0.5);
    });

    it("can compute odds even when there are no successful combinations", () => {
      const bag = new Bag([Token.PLUS_ONE, Token.MINUS_ONE]);
      const oddsOfSuccess = odds(1, bag, effects, success(-4));
      expect(oddsOfSuccess).to.equal(0);
    });

    it("takes into account tokens with a redraw effect", () => {
      const bag = new Bag([Token.PLUS_ONE, Token.MINUS_ONE, Token.CULTIST]);
      const oddsOfSuccess = odds(1, bag, effects, success(-1));
      /* Possible draws are :
       * - +1 with a probability of 1/3
       * - -1 with a probability of 1/3
       * - Cultist and +1 with a probability of 1/6 (1/3 x 1/2)
       * - Cultist and -1 with a probability of 1/6 (1/3 x 1/2)
       * If testing at -1, only +1 result in a success.
       */
      expect(oddsOfSuccess).to.be.closeTo(1 / 3, PRECISION);
    });

    it("takes into account tokens with a redraw effect when pulling multiple tokens", () => {
      const bag = new Bag([
        Token.PLUS_ONE,
        Token.MINUS_ONE,
        Token.MINUS_TWO,
        Token.CULTIST
      ]);

      /* Possible draws are in the table below
       *
       * | 1st pull | 2nd pull | 3rd pull | Result | Probability |
       * | +1       | -1       |          | +0     | 1/12        |
       * | +1       | -2       |          | -1     | 1/12        |
       * | +1       | Cultist  | -1       | -1     | 1/24        |
       * | +1       | Cultist  | -2       | -2     | 1/24        |
       * | -1       | +1       |          | +0     | 1/12        |
       * | -1       | -2       |          | -3     | 1/12        |
       * | -1       | Cultist  | +1       | -1     | 1/24        |
       * | -1       | Cultist  | -2       | -4     | 1/24        |
       * | -2       | +1       |          | -1     | 1/12        |
       * | -2       | -1       |          | -3     | 1/12        |
       * | -2       | Cultist  | +1       | -2     | 1/24        |
       * | -2       | Cultist  | -1       | -4     | 1/24        |
       * | Cultist  | +1       | -1       | -1     | 1/24        |
       * | Cultist  | +1       | -2       | -2     | 1/24        |
       * | Cultist  | -1       | +1       | -1     | 1/24        |
       * | Cultist  | -1       | -2       | -4     | 1/24        |
       * | Cultist  | -2       | +1       | -2     | 1/24        |
       * | Cultist  | -2       | -1       | -4     | 1/24        |
       *
       * Odds of success depending on difficulty is then :
       *
       * | Result | Probability |
       * | -4     | 4/24        |
       * | -3     | 4/24        |
       * | -2     | 4/24        |
       * | -1     | 8/24        |
       * | 0      | 4/24        |
       */
      expect(odds(2, bag, effects, success(0))).to.be.closeTo(
        4 / 24,
        PRECISION,
        "when equal"
      );
      expect(odds(2, bag, effects, success(1))).to.be.closeTo(
        12 / 24, // 4 / 24 + 8 / 24
        PRECISION,
        "when over by 1"
      );
      expect(odds(2, bag, effects, success(2))).to.be.closeTo(
        16 / 24, // 4 / 24 + 8 / 24 + 4 / 24
        PRECISION,
        "when over by 2"
      );
      expect(odds(2, bag, effects, success(3))).to.closeTo(
        20 / 24, // 4 / 24 + 8 / 24 + 4 / 24 + 4 / 24
        PRECISION,
        "when over by 3"
      );
      expect(odds(2, bag, effects, success(4))).to.be.closeTo(
        1,
        PRECISION,
        "when over by 4"
      );
    });
  });

  describe("oddsWithRedraw", () => {
    it("returns 0.5 when pulling 1 token if half the tokens results in a success", () => {
      const bag = new Bag([Token.PLUS_ONE, Token.MINUS_ONE]);
      const oddsOfSuccess = oddsWithRedraw(1, bag, effects, success(0));
      expect(oddsOfSuccess).to.equal(0.5);
    });

    it("returns 0.75 when pulling 2 tokens (putting back first token before second draw) if half the tokens results in a success", () => {
      const bag = new Bag([Token.PLUS_ONE, Token.MINUS_ONE]);
      const oddsOfSuccess = oddsWithRedraw(
        2,
        bag,
        effects,
        successChoosingBest(0)
      );
      expect(oddsOfSuccess).to.equal(0.75);
    });
  });
});
