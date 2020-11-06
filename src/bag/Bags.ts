import { Token } from "../tokens";

/**
 * @internal A function to facilitate the declaration of bag composition.
 *
 * @param {string} tokenList
 *   The comma-separated list of tokens.
 * @return {Token[]}
 *   The array of tokens parsed from the string.
 */
function toTokens(tokenList: string): Token[] {
  return tokenList.split(",").map(s => {
    switch (s.trim()) {
      case "Elder sign":
        return Token.ELDER_SIGN;
      case "+1":
        return Token.PLUS_ONE;
      case "0":
        return Token.ZERO;
      case "-1":
        return Token.MINUS_ONE;
      case "-2":
        return Token.MINUS_TWO;
      case "-3":
        return Token.MINUS_THREE;
      case "-4":
        return Token.MINUS_FOUR;
      case "-5":
        return Token.MINUS_FIVE;
      case "-6":
        return Token.MINUS_SIX;
      case "-7":
        return Token.MINUS_SEVEN;
      case "-8":
        return Token.MINUS_EIGHT;
      case "Skull":
        return Token.SKULL;
      case "Cultist":
        return Token.CULTIST;
      case "Tablet":
        return Token.TABLET;
      case "Elder thing":
        return Token.ELDER_THING;
      case "Autofail":
        return Token.AUTOFAIL;
      default:
        return null;
    }
  });
}

// tslint:disable:object-literal-sort-keys max-line-length
/**
 * Bag compositions for the different campaigns.
 */
export const Bags = {
  /**
   * Night of the Zealot
   */
  NightOfTheZealot: {
    Easy: toTokens(
      "+1, +1, 0, 0, 0, -1, -1, -1, -2, -2, Skull, Skull, Cultist, Tablet, Autofail, Elder sign"
    ),
    Standard: toTokens(
      "+1, 0, 0, -1, -1, -1, -2, -2, -3, -4, Skull, Skull, Cultist, Tablet, Autofail, Elder sign"
    ),
    Hard: toTokens(
      "0, 0, 0, -1, -1, -2, -2, -3, -3, -4, -5, Skull, Skull, Cultist, Tablet, Autofail, Elder sign"
    ),
    Expert: toTokens(
      "0, -1, -1, -2, -2, -3, -3, -4, -4, -5, -6, -8, Skull, Skull, Cultist, Tablet, Autofail, Elder sign"
    )
  },
  /**
   * The Dunwich Legacy
   */
  TheDunwichLegacy: {
    Easy: toTokens(
      "+1, +1, 0, 0, 0, -1, -1, -1, -2, -2, Skull, Skull, Cultist, Autofail, Elder sign"
    ),
    Standard: toTokens(
      "+1, 0, 0, -1, -1, -1, -2, -2, -3, -4, Skull, Skull, Cultist, Autofail, Elder sign"
    ),
    Hard: toTokens(
      "0, 0, 0, -1, -1, -2, -2, -3, -3, -4, -5, Skull, Skull, Cultist, Autofail, Elder sign"
    ),
    Expert: toTokens(
      "0, -1, -1, -2, -2, -3, -3, -4, -4, -5, -6, -8, Skull, Skull, Cultist, Autofail, Elder sign"
    )
  },
  /**
   * The Path to Carcosa
   */
  ThePathToCarcosa: {
    Easy: toTokens(
      "+1, +1, 0, 0, 0, -1, -1, -1, -2, -2, Skull, Skull, Skull, Autofail, Elder sign"
    ),
    Standard: toTokens(
      "+1, 0, 0, -1, -1, -1, -2, -2, -3, -4, Skull, Skull, Skull, Autofail, Elder sign"
    ),
    Hard: toTokens(
      "0, 0, 0, -1, -1, -2, -2, -3, -3, -4, -5, Skull, Skull, Skull, Autofail, Elder sign"
    ),
    Expert: toTokens(
      "0, -1, -1, -2, -2, -3, -3, -4, -4, -5, -6, -8, Skull, Skull, Skull, Autofail, Elder sign"
    )
  },
  /**
   * The Forgotten Age
   */
  TheForgottenAge: {
    Easy: toTokens(
      "+1, +1, 0, 0, 0, -1, -1, -2, -3, Skull, Skull, Elder thing, Autofail, Elder sign"
    ),
    Standard: toTokens(
      "+1, 0, 0, 0, -1, -2, -2, -3, -5, Skull, Skull, Elder thing, Autofail, Elder sign"
    ),
    Hard: toTokens(
      "+1, 0, 0, -1, -2, -3, -3, -4, -6, Skull, Skull, Elder thing, Autofail, Elder sign"
    ),
    Expert: toTokens(
      "0, -1, -2, -2, -3, -3, -4, -4, -6, -8, Skull, Skull, Elder thing, Autofail, Elder sign"
    )
  },
  /**
   * The Circle Undone
   */
  TheCircleUndone: {
    Easy: toTokens(
      "+1, +1, 0, 0, 0, -1, -1, -2, -3, Skull, Skull, Autofail, Elder sign"
    ),
    Standard: toTokens(
      "+1, 0, 0, -1, -1, -2, -2, -3, -4, Skull, Skull, Autofail, Elder sign"
    ),
    Hard: toTokens(
      "0, 0, -1, -1, -2, -2, -3, -4, -5, Skull, Skull, Autofail, Elder sign"
    ),
    Expert: toTokens(
      "0, -1, -1, -2, -2, -3, -4, -6, -8, Skull, Skull, Autofail, Elder sign"
    )
  },
  /**
   * The Dream-Eaters : The Dream-Quest
   */
  TheDreamEatersTheDreamQuest: {
    Easy: toTokens(
      "+1, +1, 0, 0, 0, –1, –1, –2, –2, Cultist, Tablet, Tablet, Autofail, Elder sign"
    ),
    Standard: toTokens(
      "+1, 0, 0, –1, –1, –2, –2, –3, –4, Cultist, Tablet, Tablet, Autofail, Elder sign"
    ),
    Hard: toTokens(
      "0, 0, –1, –1, –2, –2, –3, –3, –4, –5, Cultist, Tablet, Tablet, Autofail, Elder sign"
    ),
    Expert: toTokens(
      "0, –1, –1, –2, –2, –3, –4, –4, –5, –6, –8, Cultist, Tablet, Tablet, Autofail, Elder sign"
    )
  },
  /**
   * The Dream-Eaters : The Web of Dreams
   */
  TheDreamEatersTheWebOfDreams: {
    Easy: toTokens(
      "+1, +1, 0, 0, 0, –1, –1, –1, –2, –2, Skull, Skull, Cultist, Elder thing, Elder thing, Autofail, Elder sign"
    ),
    Standard: toTokens(
      "+1, 0, 0, –1, –1, –1, –2, –2, –3, –4, Skull, Skull, Cultist, Elder thing, Elder thing, Autofail, Elder sign"
    ),
    Hard: toTokens(
      "0, 0, 0, –1, –1, –2, –2, –3, –3, –4, –5, Skull, Skull, Cultist, Elder thing, Elder thing, Autofail, Elder sign"
    ),
    Expert: toTokens(
      "0, –1, –1, –2, –2, –3, –3, –4, –4, –5, –6, –8, Skull, Skull, Cultist, Elder thing, Elder thing, Autofail, Elder sign"
    )
  },
  /**
   * Curse of the Rougarou
   */
  CurseOfTheRougarou: {
    Standard: toTokens(
      "+1, +1, 0, 0, 0, -1, -1, -1, -2, -2, -3, -3, -4, -4, -5, -6, Skull, Skull, Cultist, Cultist, Tablet, Elder thing, Autofail, Elder sign"
    ),
    Hard: toTokens(
      "+1, 0, 0, 0, -1, -1, -1, -2, -2, -3, -3, -4, -4, -5, -5, -6, -8, Skull, Skull, Skull, Cultist, Cultist, Tablet, Elder thing, Autofail, Elder sign"
    )
  },
  /**
   * Carnevale of Horrors
   */
  CarnevaleOfHorrors: {
    Standard: toTokens(
      "+1, 0, 0, 0, -1, -1, -1, -2, -3, -4, -6, Skull, Skull, Skull, Cultist, Tablet, Elder thing, Autofail, Elder sign"
    ),
    Hard: toTokens(
      "+1, 0, 0, 0, -1, -1, -3, -4, -5, -6, -7, Skull, Skull, Skull, Cultist, Tablet, Elder thing, Autofail, Elder sign"
    )
  },
  /**
   * The Labyrinths of Lunacy
   */
  TheLabyrinthsOfLunacy: {
    Standard: toTokens(
      "+1, 0, 0, 0, –1, –1, –1, –2, –2, –3, –4, –5, Skull, Skull, Autofail, Elder sign"
    ),
    Hard: toTokens(
      "+1, 0, –1, –1, –1, –2, –2, –2, –3, –4, –5, –6, Skull, Skull, Autofail, Elder sign"
    )
  },
  /**
   * Guardians of the Abyss
   */
  GuardiansOfTheAbyss: {
    Standard: toTokens(
      "+1, +1, 0, 0, -1, -1, -1, -2, -2, -3, -3, -4, -6, Skull, Skull, Skull, Cultist, Tablet, Elder thing, Autofail, Elder sign"
    ),
    Hard: toTokens(
      "+1, 0, 0, -1, -1, -1, -2, -2, -2, -3, -3, -4, -4, -5, -7, Skull, Skull, Skull, Cultist, Tablet, Elder thing, Autofail, Elder sign"
    )
  },
  /**
   * Guardians of the Abyss
   */
  MurderAtTheExcelsiorHotel: {
    Standard: toTokens(
      "+1, 0, -1, -1, -2, -3, -3, -4, Skull, Skull, Cultist, Tablet, Elder thing, Autofail, Elder sign"
    ),
    Hard: toTokens(
      "0, -1, -2, -3, -4, -4, -5, -6, Skull, Skull, Cultist, Tablet, Elder thing, Autofail, Elder sign"
    )
  },
  /**
   * The Blob That Ate Everything
   */
  TheBlobThatAteEverything: {
    Standard: toTokens(
      "+1, 0, 0, 0, -1, -2, -2, -3, -4, -5, Skull, Skull, Cultist, Tablet, Elder thing, Autofail, Elder sign"
    ),
    Hard: toTokens(
      "0, 0, 0, -1, -1, -2, -3, -4, -5, -6, Skull, Skull, Cultist, Tablet, Elder thing, Autofail, Elder sign"
    )
  }
};
