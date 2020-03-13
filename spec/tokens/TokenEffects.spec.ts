// tslint:disable:no-unused-expression
import { expect } from "chai";
import {
  Autofail,
  Autosuccess,
  Modifier,
  Token,
  TokenEffect,
  TokenEffects
} from "../../src";

let sharedEffects: TokenEffects;

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

  describe("isTokenAutoSuccess", () => {
    it("is true when token is autosuccess", () => {
      const effects = new TokenEffects([[Token.ELDER_SIGN, new Autosuccess()]]);
      expect(effects.isTokenAutoSuccess(Token.ELDER_SIGN)).to.be.true;
    });

    it("is false when token is not autosuccess", () => {
      const effects = new TokenEffects([[Token.ELDER_SIGN, new Modifier(1)]]);
      expect(effects.isTokenAutoSuccess(Token.ELDER_SIGN)).to.be.false;
    });
  });

  describe("isTokenAutoFail", () => {
    it("is true when token is autosuccess", () => {
      const effects = new TokenEffects([[Token.AUTOFAIL, new Autofail()]]);
      expect(effects.isTokenAutoFail(Token.AUTOFAIL)).to.be.true;
    });

    it("is false when token is not autosuccess", () => {
      const effects = new TokenEffects([[Token.ELDER_SIGN, new Modifier(1)]]);
      expect(effects.isTokenAutoFail(Token.ELDER_SIGN)).to.be.false;
    });
  });

  describe("getTokenModifier", () => {
    it("returns the token modifier if the token is a modifier token", () => {
      const effects = new TokenEffects([[Token.ELDER_SIGN, new Modifier(2)]]);
      expect(effects.getTokenModifier(Token.ELDER_SIGN)).to.equal(2);
    });

    it("returns an error if the token effect is not a modifier token", () => {
      const effects = new TokenEffects([[Token.ELDER_SIGN, new Autosuccess()]]);
      expect(() => {
        effects.getTokenModifier(Token.ELDER_SIGN);
      }).to.throw();
    });
  });

  describe("sortByBestOutcomeDesc", () => {
    it("Autosuccess comes first", () => {
      const effects = new TokenEffects([
        [Token.ELDER_SIGN, new Autosuccess()],
        [Token.PLUS_ONE, new Modifier(1)],
        [Token.MINUS_ONE, new Modifier(-1)],
        [Token.MINUS_TWO, new Modifier(-2)]
      ]);
      const tokens = [
        Token.PLUS_ONE,
        Token.MINUS_ONE,
        Token.ELDER_SIGN,
        Token.PLUS_ONE
      ];
      expect(effects.sortByBestOutcomeDesc(tokens)[0]).to.equal(
        Token.ELDER_SIGN
      );
    });

    it("Autofail comes last", () => {
      const effects = new TokenEffects([
        [Token.PLUS_ONE, new Modifier(1)],
        [Token.MINUS_ONE, new Modifier(-1)],
        [Token.MINUS_TWO, new Modifier(-2)],
        [Token.AUTOFAIL, new Autofail()]
      ]);
      const tokens = [
        Token.PLUS_ONE,
        Token.MINUS_ONE,
        Token.AUTOFAIL,
        Token.PLUS_ONE
      ];
      expect(effects.sortByBestOutcomeDesc(tokens)[tokens.length - 1]).to.equal(
        Token.AUTOFAIL
      );
    });

    it("Modifier tokens are sorted by their modifier value from highest to lowest", () => {
      const effects = new TokenEffects([
        [Token.PLUS_ONE, new Modifier(1)],
        [Token.MINUS_ONE, new Modifier(-1)],
        [Token.MINUS_TWO, new Modifier(-2)],
        [Token.MINUS_FIVE, new Modifier(-5)]
      ]);
      const tokens = [
        Token.PLUS_ONE,
        Token.MINUS_ONE,
        Token.MINUS_FIVE,
        Token.PLUS_ONE,
        Token.MINUS_TWO
      ];
      const sorted = [
        Token.PLUS_ONE,
        Token.PLUS_ONE,
        Token.MINUS_ONE,
        Token.MINUS_TWO,
        Token.MINUS_FIVE
      ];
      expect(effects.sortByBestOutcomeDesc(tokens)).to.deep.equal(sorted);
    });
  });

  describe("isSuccess", () => {
    before(() => {
      sharedEffects = new TokenEffects([
        [Token.ELDER_SIGN, new Autosuccess()],
        [Token.MINUS_ONE, new Modifier(-1)],
        [Token.MINUS_TWO, new Modifier(-2)],
        [Token.AUTOFAIL, new Autofail()]
      ]);
    });

    describe("with a single token", () => {
      it("returns true whatever the difficulty if the token is an autosuccess", () => {
        expect(sharedEffects.isSuccess([Token.ELDER_SIGN], 3)).to.be.true;
        expect(sharedEffects.isSuccess([Token.ELDER_SIGN], -3)).to.be.true;
        expect(sharedEffects.isSuccess([Token.ELDER_SIGN], -20)).to.be.true;
      });

      it("returns false whatever the difficulty if the token is an autofail", () => {
        expect(sharedEffects.isSuccess([Token.AUTOFAIL], 3)).to.be.false;
        expect(sharedEffects.isSuccess([Token.AUTOFAIL], -3)).to.be.false;
        expect(sharedEffects.isSuccess([Token.AUTOFAIL], -20)).to.be.false;
      });

      it("returns true if the sum of (skill - difficulty) and modifier value is greater than or equal to 0", () => {
        expect(sharedEffects.isSuccess([Token.MINUS_ONE], 3)).to.be.true;
        expect(sharedEffects.isSuccess([Token.MINUS_ONE], 1)).to.be.true;
        expect(sharedEffects.isSuccess([Token.MINUS_TWO], 2)).to.be.true;
      });

      it("returns false if the sum of (skill - difficulty) and modifier value is lesser than 0", () => {
        expect(sharedEffects.isSuccess([Token.MINUS_ONE], -3)).to.be.false;
        expect(sharedEffects.isSuccess([Token.MINUS_ONE], 0)).to.be.false;
        expect(sharedEffects.isSuccess([Token.MINUS_TWO], 1)).to.be.false;
      });
    });

    describe("with multiple tokens", () => {
      it("returns true when 1 of the tokens is an autosuccess and there are no autofail", () => {
        expect(sharedEffects.isSuccess([Token.ELDER_SIGN, Token.MINUS_TWO], -8))
          .to.be.true;
      });

      it("returns true when 1 of the tokens is an autofail", () => {
        expect(sharedEffects.isSuccess([Token.AUTOFAIL, Token.MINUS_TWO], 10))
          .to.be.false;
      });

      it("returns false when there are both an autosuccess and an autofail among the tokens", () => {
        expect(
          sharedEffects.isSuccess(
            [Token.ELDER_SIGN, Token.MINUS_TWO, Token.AUTOFAIL],
            10
          )
        ).to.be.false;
      });

      it("returns true if the sum of (skill - difficulty) and all modifier values is lesser than 0", () => {
        expect(
          sharedEffects.isSuccess(
            [Token.MINUS_ONE, Token.MINUS_ONE, Token.MINUS_ONE],
            6
          )
        ).to.be.true;
        expect(
          sharedEffects.isSuccess(
            [Token.MINUS_ONE, Token.MINUS_TWO, Token.MINUS_ONE],
            4
          )
        ).to.be.true;
        expect(
          sharedEffects.isSuccess(
            [Token.MINUS_TWO, Token.MINUS_TWO, Token.MINUS_TWO],
            6
          )
        ).to.be.true;
      });

      it("returns false if the sum of (skill - difficulty) and all modifier values is lesser than 0", () => {
        expect(
          sharedEffects.isSuccess(
            [Token.MINUS_ONE, Token.MINUS_ONE, Token.MINUS_ONE],
            0
          )
        ).to.be.false;
        expect(
          sharedEffects.isSuccess(
            [Token.MINUS_ONE, Token.MINUS_ONE, Token.MINUS_ONE],
            2
          )
        ).to.be.false;
        expect(
          sharedEffects.isSuccess(
            [Token.MINUS_ONE, Token.MINUS_ONE, Token.MINUS_TWO],
            3
          )
        ).to.be.false;
      });
    });
  });
});
