import { Token } from '../tokens';

function toTokens(tokenList: string): Token[] {
  return tokenList.split(',').map((s) => {
    switch (s.trim()) {
      case 'Elder sign':
        return Token.ELDER_SIGN;
      case '+1':
        return Token.PLUS_ONE;
      case '0':
        return Token.ZERO;
      case '-1':
        return Token.MINUS_ONE;
      case '-2':
        return Token.MINUS_TWO;
      case '-3':
        return Token.MINUS_THREE;
      case '-4':
        return Token.MINUS_FOUR;
      case '-5':
        return Token.MINUS_FIVE;
      case '-6':
        return Token.MINUS_SIX;
      case '-8':
        return Token.MINUS_EIGHT;
      case 'Skull':
        return Token.SKULL;
      case 'Cultist':
        return Token.CULTIST;
      case 'Tablet':
        return Token.TABLET;
      case 'Elder thing':
        return Token.ELDER_THING;
      case 'Autofail':
        return Token.AUTOFAIL;
      default:
        return null;
    }
  });
}

// tslint:disable:object-literal-sort-keys max-line-length
export const Bags = {
    NightOfTheZealot: {
      Easy: toTokens('+1, +1, 0, 0, 0, -1, -1, -1, -2, -2, Skull, Skull, Cultist, Tablet, Autofail, Elder sign'),
      Standard: toTokens('+1, 0, 0, -1, -1, -1, -2, -2, -3, -4, Skull, Skull, Cultist, Tablet, Autofail, Elder sign'),
      Hard: toTokens('0, 0, 0, -1, -1, -2, -2, -3, -3, -4, -5, Skull, Skull, Cultist, Tablet, Autofail, Elder sign'),
      Expert: toTokens('0, -1, -1, -2, -2, -3, -3, -4, -4, -5, -6, -8, Skull, Skull, Cultist, Tablet, Autofail, Elder sign'),
    },
    TheDunwichLegacy: {
      Easy: toTokens('+1, +1, 0, 0, 0, -1, -1, -1, -2, -2, Skull, Skull, Cultist, Autofail, Elder sign'),
      Standard: toTokens('+1, 0, 0, -1, -1, -1, -2, -2, -3, -4, Skull, Skull, Cultist, Autofail, Elder sign'),
      Hard: toTokens('0, 0, 0, -1, -1, -2, -2, -3, -3, -4, -5, Skull, Skull, Cultist, Autofail, Elder sign'),
      Expert: toTokens('0, -1, -1, -2, -2, -3, -3, -4, -4, -5, -6, -8, Skull, Skull, Cultist, Autofail, Elder sign'),
    },
    ThePathToCarcosa: {
      Easy: toTokens('+1, +1, 0, 0, 0, -1, -1, -1, -2, -2, Skull, Skull, Skull, Autofail, Elder sign'),
      Standard: toTokens('+1, 0, 0, -1, -1, -1, -2, -2, -3, -4, Skull, Skull, Skull, Autofail, Elder sign'),
      Hard: toTokens('0, 0, 0, -1, -1, -2, -2, -3, -3, -4, -5, Skull, Skull, Skull, Autofail, Elder sign'),
      Expert: toTokens('0, -1, -1, -2, -2, -3, -3, -4, -4, -5, -6, -8, Skull, Skull, Skull, Autofail, Elder sign'),
    },
    TheForgottenAge: {
      Easy: toTokens('+1, +1, 0, 0, 0, -1, -1, -2, -3, Skull, Skull, Elder thing, Autofail, Elder sign'),
      Standard: toTokens('+1, 0, 0, 0, -1, -2, -2, -3, -5, Skull, Skull, Elder thing, Autofail, Elder sign'),
      Hard: toTokens('+1, 0, 0, -1, -2, -3, -3, -4, -6, Skull, Skull, Elder thing, Autofail, Elder sign'),
      Expert: toTokens('0, -1, -2, -2, -3, -3, -4, -4, -6, -8, Skull, Skull, Elder thing, Autofail, Elder sign'),
    },
  };
