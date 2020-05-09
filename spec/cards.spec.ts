// tslint:disable:no-unused-expression
import { expect } from "chai";
import "mocha";
import {
  Autofail,
  jacqueline,
  Modifier,
  oliveMcBrideAndWinchesterDoing1Damage,
  oliveMcBrideAndWinchesterDoing3Damage,
  oliveMcBrideWithSkull,
  success,
  successChoosingBest,
  Token,
  TokenEffects,
  winchesterDoing1Damage,
  winchesterDoing3Damage
} from "../src";

let effects: TokenEffects;

describe("cards", () => {
  before(() => {
    effects = new TokenEffects([
      [Token.ELDER_SIGN, new Modifier(1)],
      [Token.PLUS_ONE, new Modifier(1)],
      [Token.ZERO, new Modifier(0)],
      [Token.MINUS_ONE, new Modifier(-1)],
      [Token.MINUS_TWO, new Modifier(-2)],
      [Token.AUTOFAIL, new Autofail()]
    ]);
  });

  describe("success", () => {
    it("returns a function", () => {
      const returnValue = success(0);
      expect(returnValue).to.be.instanceof(Function);
    });

    it("returned function determine success resolving all pulled tokens", () => {
      expect(success(2)([Token.MINUS_ONE, Token.MINUS_TWO], effects)).to.be
        .false;
      expect(success(3)([Token.MINUS_ONE, Token.MINUS_TWO], effects)).to.be
        .true;
    });
  });

  describe("successChoosingBest", () => {
    it("returns a function", () => {
      const returnValue = successChoosingBest(0);
      expect(returnValue).to.be.instanceof(Function);
    });

    it("returns true if greater than difficulty when applying the best token", () => {
      expect(
        successChoosingBest(1)([Token.MINUS_ONE, Token.MINUS_TWO], effects)
      ).to.be.true;
    });

    it("returns false if lesser than difficulty when applying the best token", () => {
      expect(
        successChoosingBest(0)([Token.MINUS_ONE, Token.MINUS_TWO], effects)
      ).to.be.false;
    });
  });

  describe("oliveMcBrideWithSkull", () => {
    it("returns a function", () => {
      const returnValue = oliveMcBrideWithSkull(0);
      expect(returnValue).to.be.instanceof(Function);
    });

    it("returns false if there is no Skull token in the tokens pulled", () => {
      expect(
        oliveMcBrideWithSkull(0)(
          [Token.ZERO, Token.MINUS_ONE, Token.MINUS_TWO],
          effects
        )
      ).to.be.false;
    });

    it("should not modify the combination", () => {
      const myComb = [Token.SKULL, Token.MINUS_ONE, Token.MINUS_TWO];
      oliveMcBrideWithSkull(2)(
        myComb,
        effects.merge(new TokenEffects([[Token.SKULL, new Modifier(-1)]]))
      );
      expect(myComb).to.deep.equal([
        Token.SKULL,
        Token.MINUS_ONE,
        Token.MINUS_TWO
      ]);
    });

    it("returns true if there is a Skull token in the tokens pulled and if adding best of remaining tokens is still higher than difficulty", () => {
      expect(
        oliveMcBrideWithSkull(2)(
          [Token.SKULL, Token.MINUS_ONE, Token.MINUS_TWO],
          effects.merge(new TokenEffects([[Token.SKULL, new Modifier(-1)]]))
        )
      ).to.be.true;
    });

    it("returns false if there is a Skull token in the tokens pulled and if adding best of remaining tokens is lesser than difficulty", () => {
      expect(
        oliveMcBrideWithSkull(1)(
          [Token.SKULL, Token.MINUS_ONE, Token.MINUS_TWO],
          effects.merge(new TokenEffects([[Token.SKULL, new Modifier(-1)]]))
        )
      ).to.be.false;
    });
  });

  describe("winchesterDoing1Damage", () => {
    it("returns a function", () => {
      const returnValue = winchesterDoing1Damage(0);
      expect(returnValue).to.be.instanceof(Function);
    });

    it("returns true if greater than difficulty and pulled no Elder Sign, +1 or 0", () => {
      expect(winchesterDoing1Damage(1)([Token.MINUS_ONE], effects)).to.be.true;
      expect(winchesterDoing1Damage(2)([Token.MINUS_TWO], effects)).to.be.true;
    });

    it("returns false if greater than difficulty and pulled an Elder Sign, a +1 or a 0", () => {
      expect(winchesterDoing1Damage(0)([Token.ELDER_SIGN], effects)).to.be
        .false;
      expect(winchesterDoing1Damage(0)([Token.ZERO], effects)).to.be.false;
      expect(winchesterDoing1Damage(-1)([Token.PLUS_ONE], effects)).to.be.false;
    });

    it("returns false if lesser than difficulty", () => {
      expect(winchesterDoing1Damage(-2)([Token.ELDER_SIGN], effects)).to.be
        .false;
      expect(winchesterDoing1Damage(-1)([Token.ZERO], effects)).to.be.false;
      expect(winchesterDoing1Damage(-2)([Token.PLUS_ONE], effects)).to.be.false;
      expect(winchesterDoing1Damage(0)([Token.MINUS_ONE], effects)).to.be.false;
      expect(winchesterDoing1Damage(1)([Token.MINUS_TWO], effects)).to.be.false;
    });
  });

  describe("winchesterDoing3Damage", () => {
    it("returns a function", () => {
      const returnValue = winchesterDoing3Damage(0);
      expect(returnValue).to.be.instanceof(Function);
    });

    it("returns true if greater than difficulty and pulled an Elder Sign, a +1 or a 0", () => {
      expect(winchesterDoing3Damage(0)([Token.ELDER_SIGN], effects)).to.be.true;
      expect(winchesterDoing3Damage(0)([Token.ZERO], effects)).to.be.true;
      expect(winchesterDoing3Damage(-1)([Token.PLUS_ONE], effects)).to.be.true;
    });

    it("returns false if lesser than difficulty", () => {
      expect(winchesterDoing3Damage(-2)([Token.ELDER_SIGN], effects)).to.be
        .false;
      expect(winchesterDoing3Damage(-1)([Token.ZERO], effects)).to.be.false;
      expect(winchesterDoing3Damage(-2)([Token.PLUS_ONE], effects)).to.be.false;
    });

    it("returns false if greater than difficulty and pulled no Elder Sign, +1 or 0", () => {
      expect(winchesterDoing3Damage(1)([Token.MINUS_ONE], effects)).to.be.false;
    });
  });

  describe("oliveMcBrideAndWinchesterDoing1Damage", () => {
    it("returns a function", () => {
      const returnValue = oliveMcBrideAndWinchesterDoing1Damage(0);
      expect(returnValue).to.be.instanceof(Function);
    });

    it("returns true if greater than difficulty and pulled no Elder Sign, +1 or 0", () => {
      expect(
        oliveMcBrideAndWinchesterDoing1Damage(2)(
          [Token.MINUS_TWO, Token.MINUS_ONE, Token.MINUS_ONE],
          effects
        )
      ).to.be.true;
    });

    it("returns false if greater than difficulty and pulled an Elder Sign, a +1 or a 0", () => {
      expect(
        oliveMcBrideAndWinchesterDoing1Damage(0)(
          [Token.ELDER_SIGN, Token.MINUS_ONE, Token.MINUS_ONE],
          effects
        )
      ).to.be.false;
      expect(
        oliveMcBrideAndWinchesterDoing1Damage(1)(
          [Token.ZERO, Token.MINUS_ONE, Token.MINUS_ONE],
          effects
        )
      ).to.be.false;
      expect(
        oliveMcBrideAndWinchesterDoing1Damage(0)(
          [Token.PLUS_ONE, , Token.MINUS_ONE, Token.MINUS_ONE],
          effects
        )
      ).to.be.false;
    });

    it("returns false if lesser than difficulty", () => {
      expect(
        oliveMcBrideAndWinchesterDoing1Damage(-1)(
          [Token.ELDER_SIGN, Token.MINUS_ONE, Token.MINUS_ONE],
          effects
        )
      ).to.be.false;
      expect(
        oliveMcBrideAndWinchesterDoing1Damage(1)(
          [Token.MINUS_TWO, Token.MINUS_ONE, Token.MINUS_ONE],
          effects
        )
      ).to.be.false;
    });
  });

  describe("oliveMcBrideAndWinchesterDoing3Damage", () => {
    it("returns a function", () => {
      const returnValue = oliveMcBrideAndWinchesterDoing3Damage(0);
      expect(returnValue).to.be.instanceof(Function);
    });

    it("returns true if greater than difficulty and pulled an Elder Sign, a +1 or a 0", () => {
      expect(
        oliveMcBrideAndWinchesterDoing3Damage(0)(
          [Token.ELDER_SIGN, Token.MINUS_ONE, Token.MINUS_ONE],
          effects
        )
      ).to.be.true;
      expect(
        oliveMcBrideAndWinchesterDoing3Damage(1)(
          [Token.ZERO, Token.MINUS_ONE, Token.MINUS_ONE],
          effects
        )
      ).to.be.true;
      expect(
        oliveMcBrideAndWinchesterDoing3Damage(0)(
          [Token.PLUS_ONE, , Token.MINUS_ONE, Token.MINUS_ONE],
          effects
        )
      ).to.be.true;
    });

    it("returns false if lesser than difficulty", () => {
      expect(
        oliveMcBrideAndWinchesterDoing3Damage(-1)(
          [Token.ELDER_SIGN, Token.MINUS_ONE, Token.MINUS_ONE],
          effects
        )
      ).to.be.false;
      expect(
        oliveMcBrideAndWinchesterDoing3Damage(0)(
          [Token.ZERO, Token.MINUS_ONE, Token.MINUS_ONE],
          effects
        )
      ).to.be.false;
      expect(
        oliveMcBrideAndWinchesterDoing3Damage(-1)(
          [Token.PLUS_ONE, , Token.MINUS_ONE, Token.MINUS_ONE],
          effects
        )
      ).to.be.false;
    });

    it("returns false if greater than difficulty and pulled no Elder Sign, +1 or 0", () => {
      expect(
        oliveMcBrideAndWinchesterDoing3Damage(2)(
          [Token.MINUS_ONE, Token.MINUS_ONE, Token.MINUS_ONE],
          effects
        )
      ).to.be.false;
    });
  });

  describe("jacqueline", () => {
    it("returns a function", () => {
      const returnValue = jacqueline(0);
      expect(returnValue).to.be.instanceof(Function);
    });

    it("returns true if greater than difficulty when cancelling 2 non-tentacle tokens", () => {
      expect(
        jacqueline(1)(
          [Token.MINUS_ONE, Token.MINUS_ONE, Token.MINUS_ONE],
          effects
        )
      ).to.be.true;
    });

    it("returns true if greater than difficulty when cancelling tentacle", () => {
      expect(
        jacqueline(2)(
          [Token.MINUS_ONE, Token.MINUS_ONE, Token.AUTOFAIL],
          effects
        )
      ).to.be.true;
    });

    it("returns false if lesser than difficulty when cancelling 2 non-tentacle tokens", () => {
      expect(
        jacqueline(0)(
          [Token.MINUS_ONE, Token.MINUS_ONE, Token.MINUS_ONE],
          effects
        )
      ).to.be.false;
    });

    it("returns false if lesser than difficulty when cancelling tentacle", () => {
      expect(
        jacqueline(1)(
          [Token.MINUS_ONE, Token.MINUS_ONE, Token.AUTOFAIL],
          effects
        )
      ).to.be.false;
    });
  });
});
