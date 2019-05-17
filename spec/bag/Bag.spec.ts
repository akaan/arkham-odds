// tslint:disable:no-unused-expression
import { Bag } from "bag";
import { expect } from "chai";
import "mocha";
import { Token } from "tokens";

describe("Bag", () => {
  it("should not be affected by changes to the passed array of tokens", () => {
    const someTokens = [Token.ZERO, Token.MINUS_ONE];
    const bag = new Bag(someTokens);
    expect(bag.getTokens()).to.deep.equal([Token.ZERO, Token.MINUS_ONE]);

    someTokens.push(Token.AUTOFAIL);
    expect(someTokens).to.deep.equal([
      Token.ZERO,
      Token.MINUS_ONE,
      Token.AUTOFAIL
    ]);
    expect(bag.getTokens()).to.deep.equal([Token.ZERO, Token.MINUS_ONE]);
  });

  describe("getTokens", () => {
    it("modifications to the returned array should not affect the Bag", () => {
      const bag = new Bag([Token.ELDER_SIGN, Token.AUTOFAIL]);
      const tokens = bag.getTokens();
      tokens.push(Token.TABLET);
      expect(tokens).to.deep.equal([
        Token.ELDER_SIGN,
        Token.AUTOFAIL,
        Token.TABLET
      ]);
      expect(bag.getTokens()).to.deep.equal([Token.ELDER_SIGN, Token.AUTOFAIL]);
    });
  });

  describe("addTokens", () => {
    it("should return a new Bag", () => {
      const bag = new Bag([Token.ELDER_SIGN]);
      const added = bag.addTokens([Token.AUTOFAIL]);
      expect(added).not.to.equal(bag);
    });

    it("should add the tokens", () => {
      const bag = new Bag([Token.ELDER_SIGN]);
      const added = bag.addTokens([Token.AUTOFAIL, Token.TABLET]);
      expect(added.getTokens()).to.deep.equal([
        Token.ELDER_SIGN,
        Token.AUTOFAIL,
        Token.TABLET
      ]);
    });

    it("should leave the original Bag untouched", () => {
      const bag = new Bag([Token.ELDER_SIGN]);
      bag.addTokens([Token.AUTOFAIL]);
      expect(bag.getTokens()).to.deep.equal([Token.ELDER_SIGN]);
    });
  });

  describe("removeToken", () => {
    it("should return a new Bag", () => {
      const bag = new Bag([Token.ELDER_SIGN, Token.AUTOFAIL]);
      const removed = bag.removeToken(Token.AUTOFAIL);
      expect(removed).not.to.equal(bag);
    });

    it("should remove the token", () => {
      const bag = new Bag([Token.ELDER_SIGN, Token.AUTOFAIL]);
      const removed = bag.removeToken(Token.AUTOFAIL);
      expect(removed.getTokens()).to.deep.equal([Token.ELDER_SIGN]);
    });

    it("should the original Bag untouched", () => {
      const bag = new Bag([Token.ELDER_SIGN, Token.AUTOFAIL]);
      bag.removeToken(Token.AUTOFAIL);
      expect(bag.getTokens()).to.deep.equal([Token.ELDER_SIGN, Token.AUTOFAIL]);
    });
  });
});
