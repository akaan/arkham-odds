// tslint:disable:no-unused-expression
import { expect } from "chai";
import {
  Autofail,
  Modifier,
  Token,
  TokenEffect,
  TokenEffects
} from "../../src";

describe("TokenEffects", () => {
  it("can be created from mapping", () => {
    const effects = new TokenEffects([
      [Token.ELDER_SIGN, new Modifier(1)],
      [Token.CULTIST, new Modifier(-2)]
    ]);
    expect(effects.getEffect(Token.ELDER_SIGN)).to.exist;
    expect(effects.getEffect(Token.AUTOFAIL)).to.not.exist;
  });

  it("is not affected by changes to provided mapping", () => {
    const mapping: Array<[Token, TokenEffect]> = [
      [Token.ELDER_SIGN, new Modifier(1)],
      [Token.CULTIST, new Modifier(-2)]
    ];
    const effects = new TokenEffects(mapping);
    expect(effects.getEffect(Token.AUTOFAIL)).to.not.exist;
    mapping.push([Token.AUTOFAIL, new Autofail()]);
    expect(effects.getEffect(Token.AUTOFAIL)).to.not.exist;
  });

  it("can be created empty", () => {
    const effects = new TokenEffects();
    expect(effects.getEffect(Token.ELDER_SIGN)).to.not.exist;
  });

  describe("setEffect", () => {
    it("should return a new TokenEffects", () => {
      const effects = new TokenEffects([
        [Token.ELDER_SIGN, new Modifier(1)],
        [Token.CULTIST, new Modifier(-2)]
      ]);
      const modifiedEffects = effects.setEffect(Token.CULTIST, new Autofail());
      expect(modifiedEffects).to.not.equal(effects);
    });

    it("should set the new effect", () => {
      const effects = new TokenEffects([
        [Token.ELDER_SIGN, new Modifier(1)],
        [Token.CULTIST, new Modifier(-2)]
      ]);
      const modifiedEffects = effects.setEffect(Token.CULTIST, new Autofail());
      expect(modifiedEffects.getEffect(Token.CULTIST).sameAs(new Autofail())).to
        .be.true;
    });

    it("should leave the original effects untouched", () => {
      const effects = new TokenEffects([
        [Token.ELDER_SIGN, new Modifier(1)],
        [Token.CULTIST, new Modifier(-2)]
      ]);
      effects.setEffect(Token.CULTIST, new Autofail());
      expect(effects.getEffect(Token.CULTIST).sameAs(new Modifier(-2))).to.be
        .true;
    });
  });

  describe("setEffects", () => {
    it("should return a new TokenEffects", () => {
      const effects = new TokenEffects([
        [Token.ELDER_SIGN, new Modifier(1)],
        [Token.CULTIST, new Modifier(-2)]
      ]);
      const modifiedEffects = effects.setEffects([
        [Token.AUTOFAIL, new Autofail()]
      ]);
      expect(modifiedEffects).to.not.equal(effects);
    });

    it("should set the new effects", () => {
      const effects = new TokenEffects([
        [Token.ELDER_SIGN, new Modifier(1)],
        [Token.CULTIST, new Modifier(-2)]
      ]);
      const modifiedEffects = effects.setEffects([
        [Token.TABLET, new Modifier(-3)],
        [Token.ELDER_THING, new Modifier(-4)]
      ]);
      expect(modifiedEffects.getEffect(Token.TABLET).sameAs(new Modifier(-3)))
        .to.be.true;
      expect(
        modifiedEffects.getEffect(Token.ELDER_THING).sameAs(new Modifier(-4))
      ).to.be.true;
    });

    it("should leave the original effects untouched", () => {
      const effects = new TokenEffects([
        [Token.ELDER_SIGN, new Modifier(1)],
        [Token.CULTIST, new Modifier(-2)]
      ]);
      effects.setEffects([
        [Token.CULTIST, new Modifier(-3)],
        [Token.TABLET, new Modifier(-4)]
      ]);
      expect(effects.getEffect(Token.CULTIST).sameAs(new Modifier(-2))).to.be
        .true;
    });
  });

  describe("merge", () => {
    it("should return a new TokenEffects", () => {
      const effects1 = new TokenEffects([
        [Token.ELDER_SIGN, new Modifier(1)],
        [Token.CULTIST, new Modifier(-2)]
      ]);
      const effects2 = new TokenEffects([
        [Token.TABLET, new Modifier(-3)],
        [Token.ELDER_THING, new Modifier(-4)]
      ]);
      const merged = effects1.merge(effects2);
      expect(merged).to.not.equal(effects1);
      expect(merged).to.not.equal(effects2);
    });

    it("should merge effects", () => {
      const [e1, e2, e3, e4] = [
        new Modifier(1),
        new Modifier(-2),
        new Modifier(-3),
        new Modifier(-4)
      ];
      const effects1 = new TokenEffects([
        [Token.ELDER_SIGN, new Modifier(1)],
        [Token.CULTIST, new Modifier(-2)]
      ]);
      const effects2 = new TokenEffects([
        [Token.CULTIST, new Modifier(-3)],
        [Token.TABLET, new Modifier(-4)]
      ]);
      const merged = effects1.merge(effects2);
      expect(merged.getEffect(Token.ELDER_SIGN).sameAs(new Modifier(1))).to.be
        .true;
      expect(merged.getEffect(Token.CULTIST).sameAs(new Modifier(-3))).to.be
        .true;
      expect(merged.getEffect(Token.TABLET).sameAs(new Modifier(-4))).to.be
        .true;
    });
  });
});
