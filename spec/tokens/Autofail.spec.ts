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
    it("outcome is of type AUTOFAIL", () => {
      expect(new Autofail().getOutcome()).to.equal(TokenEffectType.AUTOFAIL);
    });
  });

  describe("isRedraw", () => {
    it("is not a redraw token", () => {
      expect(new Autofail().isRedraw()).to.equal(false);
    });
  });

  describe("sameAs", () => {
    it("is true when compared to another Auofail", () => {
      const [fail1, fail2] = [new Autofail(), new Autofail()];
      expect(fail1.sameAs(fail2)).to.be.true;
    });

    it("is false when compared to another type of effect", () => {
      const fail = new Autofail();
      expect((fail as TokenEffect).sameAs(new Modifier(-1))).to.be.false;
      expect((fail as TokenEffect).sameAs(new Autosuccess())).to.be.false;
    });
  });
});
