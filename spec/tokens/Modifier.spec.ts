// tslint:disable:no-unused-expression
import { expect } from "chai";
import "mocha";
import {
  Autofail,
  Autosuccess,
  Modifier,
  TokenEffect,
  TokenEffectType
} from "../../src";

describe("Modifier", () => {
  describe("getOutcome", () => {
    it("outcome is of type MODIFIER", () => {
      expect(new Modifier(0).getOutcome()).to.equal(TokenEffectType.MODIFIER);
    });
  });

  describe("sameAs", () => {
    it("is true when representing a modifier with same value", () => {
      const [mod1, mod2] = [new Modifier(1), new Modifier(1)];
      expect(mod1.sameAs(mod2)).to.be.true;
    });

    it("is false when representing a modifier with different value", () => {
      const [mod1, mod2] = [new Modifier(1), new Modifier(2)];
      expect(mod1.sameAs(mod2)).to.be.false;
    });

    it("is false when compared to another type of effect", () => {
      const mod1 = new Modifier(1);
      expect((mod1 as TokenEffect).sameAs(new Autofail())).to.be.false;
      expect((mod1 as TokenEffect).sameAs(new Autosuccess())).to.be.false;
    });
  });
});
