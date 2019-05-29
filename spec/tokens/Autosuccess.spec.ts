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

describe("Autofail", () => {
  describe("getOutcome", () => {
    it("outcome is of type AUTOSUCCESS", () => {
      expect(new Autosuccess().getOutcome()).to.equal(
        TokenEffectType.AUTOSUCCESS
      );
    });
  });

  describe("sameAs", () => {
    it("is true when compared to another Auofail", () => {
      const [succ1, succ2] = [new Autosuccess(), new Autosuccess()];
      expect(succ1.sameAs(succ2)).to.be.true;
    });

    it("is false when compared to another type of effect", () => {
      const succ = new Autosuccess();
      expect((succ as TokenEffect).sameAs(new Modifier(-1))).to.be.false;
      expect((succ as TokenEffect).sameAs(new Autofail())).to.be.false;
    });
  });
});
