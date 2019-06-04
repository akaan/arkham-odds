// tslint:disable:no-unused-expression
import { expect } from "chai";
import "mocha";
import { Autofail, Modifier, success, Token, TokenEffects } from "../src";

let effects: TokenEffects;

describe("cards", () => {
  before(() => {
    effects = new TokenEffects([
      [Token.ELDER_SIGN, new Modifier(1)],
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
});
