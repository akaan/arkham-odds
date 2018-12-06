export enum Token {
  ELDER_SIGN = 'Elder sign',
  PLUS_ONE = '+1',
  ZERO = '0',
  MINUS_ONE = '-1',
  MINUS_TWO = '-2',
  MINUS_THREE = '-3',
  MINUS_FOUR = '-4',
  MINUS_FIVE = '-5',
  MINUS_SIX = '-6',
  MINUS_EIGHT = '-8',
  SKULL = 'Skull',
  CULTIST = 'Cultist',
  TABLET = 'Tablet',
  ELDER_THING = 'Elder thing',
  AUTOFAIL = 'Autofail',
}

export const BadTokens = [
  Token.SKULL, Token.CULTIST, Token.TABLET,
  Token.ELDER_THING, Token.AUTOFAIL,
];
