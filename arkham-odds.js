(function() {

  // Baseline setup
  // --------------

  // Establish the root object, `window` (`self`) in the browser, `global`
  // on the server, or `this` in some virtual machines. We use `self`
  // instead of `window` for `WebWorker` support.
  var root = typeof self == 'object' && self.self === self && self ||
            typeof global == 'object' && global.global === global && global ||
            this ||
            {};

  var ArkhamOdds = {};

  // Export the ArkhamOdds object for **Node.js**, with
  // backwards-compatibility for their old module API. If we're in
  // the browser, add `ArkhamOdds` as a global object.
  // (`nodeType` is checked to ensure that `module`
  // and `exports` are not HTML elements.)
  if (typeof exports != 'undefined' && !exports.nodeType) {
    if (typeof module != 'undefined' && !module.nodeType && module.exports) {
      exports = module.exports = ArkhamOdds;
    }
    exports.ArkhamOdds = ArkhamOdds;
  } else {
    root.ArkhamOdds = ArkhamOdds;
  }

  // Utilitary functions
  // -------------------

  function splitAndTrim (someString) {
    return someString.split(",").map ( function (s) { return s.trim(); } );
  }

  // tails(elems: [a]): [[a]]
  // ex: tails( [1, 2, 3] ) => [ [1, 2, 3], [2, 3], [3], [] ]
  function tails (elems) {
    if ( elems.length == 0 ) { return [ [] ]; }

    var a = tails (elems.slice(1)); // recursion
    a.unshift(elems.slice(0));
    return a;
  }

  // flatten(elems: [a]): [a]
  // ex: flatten([[1, 2], 3]) => [1, 2, 3]
  function flatten (elems) {
    return [].concat.apply([], elems);
  }

  // Functions to compute outcomes
  // -----------------------------

  // Combinations of `k` elements among `elems` elements
  // combinations(k: number, elems: [a]): [[a]]
  // ex: combinations(2, [1, 2, 3]) => [ [1, 2], [1, 3], [2, 3] ]
  ArkhamOdds.combinations = function (k, elems) {
    if ( k <= 0 ) { return [ [] ]; }

    // Get all tails
    return (tails (elems)).reduce ( function ( acc, tailOfElems ) {
      // For each tail ...
      if ( tailOfElems.length == 0 ) { return acc; }

      // Recursion : get all combinations of (k-1) elements with end elements
      var tailCombinations = ArkhamOdds.combinations (k - 1, tailOfElems.slice(1) );
      
      // Prepend first element to all combinations
      var comb = tailCombinations.map ( function (tailCombination) {
        tailCombination.unshift ( tailOfElems[0] );
        return tailCombination;
      } );

      // Add to result
      return acc.concat (comb);
    }, []);
  };

  // Cartesian product of arrays.
  // product (...sets: [a]): [[a]]
  // ex: product([1, 2], [3, 4]) => [[1,3],[1,4],[2,3],[2,4]]
  ArkhamOdds.product = function ( ...sets ) {
    return sets.reduce(function (acc, set) {
      return flatten(acc.map(function(x) {
        return set.map(function(y) {
          return [ ...x, y ];
        });
      }))
    }, [[]]);
  };

  // Probability of favorable outcomes among all possible outcomes.
  // oddsOfOutcome (elems: [a], outcomeFunction: a -> boolean): number
  // ex: oddsOfOutcome([1, 2, 3], function (e) { return e == 1; }) => 0.33
  ArkhamOdds.oddsOfOutcome = function ( elems, outcomeFunction ) {
    return elems.filter ( outcomeFunction ).length / elems.length
  };

  // Reference data
  // --------------

  ArkhamOdds.Tokens = {
    Values: {
      "Elder sign": null,
      "+1": 1,
      "0": 0,
      "-1": -1,
      "-2": -2,
      "-3": -3,
      "-4": -4,
      "-5": -5,
      "-6": -6,
      "-8": -8,
      "Skull": null,
      "Cultist": null,
      "Tablet": null,
      "Elder thing": null,
      "Autofail": null
    },
    SpecialTokens: ["Skull", "Cultist", "Tablet", "Elder thing", "Autofail"],
    AutofailTokens: ["Autofail"],
    AutosuccessTokens: []
  };

  ArkhamOdds.valueForToken = function ( token ) {
    return ArkhamOdds.Tokens.Values[token];
  };

  ArkhamOdds.isTokenSpecial = function ( token ) {
    return ArkhamOdds.Tokens.SpecialTokens.includes( token );
  };

  ArkhamOdds.isTokenAutoFailure = function ( token ) {
    return ArkhamOdds.Tokens.AutofailTokens.includes( token );
  };

  ArkhamOdds.isTokenAutoSuccess = function ( token ) {
    return ArkhamOdds.Tokens.AutosuccessTokens.includes( token );
  };

  ArkhamOdds.Bags = {
    NightOfTheZealot: {
      Easy: splitAndTrim("+1, +1, 0, 0, 0, -1, -1, -1, -2, -2, Skull, Skull, Cultist, Tablet, Autofail, Elder sign"),
      Standard: splitAndTrim("+1, 0, 0, -1, -1, -1, -2, -2, -3, -4, Skull, Skull, Cultist, Tablet, Autofail, Elder sign"),
      Hard: splitAndTrim("0, 0, 0, -1, -1, -2, -2, -3, -3, -4, -5, Skull, Skull, Cultist, Tablet, Autofail, Elder sign"),
      Expert: splitAndTrim("0, -1, -1, -2, -2, -3, -3, -4, -4, -5, -6, -8, Skull, Skull, Cultist, Tablet, Autofail, Elder sign")
    },
    TheDunwichLegacy: {
      Easy: splitAndTrim("+1, +1, 0, 0, 0, -1, -1, -1, -2, -2, Skull, Skull, Cultist, Autofail, Elder sign"),
      Standard: splitAndTrim("+1, 0, 0, -1, -1, -1, -2, -2, -3, -4, Skull, Skull, Cultist, Autofail, Elder sign"),
      Hard: splitAndTrim("0, 0, 0, -1, -1, -2, -2, -3, -3, -4, -5, Skull, Skull, Cultist, Autofail, Elder sign"),
      Expert: splitAndTrim("0, -1, -1, -2, -2, -3, -3, -4, -4, -5, -6, -8, Skull, Skull, Cultist, Autofail, Elder sign")
    },
    ThePathToCarcosa: {
      Easy: splitAndTrim("+1, +1, 0, 0, 0, -1, -1, -1, -2, -2, Skull, Skull, Skull, Autofail, Elder sign"),
      Standard: splitAndTrim("+1, 0, 0, -1, -1, -1, -2, -2, -3, -4, Skull, Skull, Skull, Autofail, Elder sign"),
      Hard: splitAndTrim("0, 0, 0, -1, -1, -2, -2, -3, -3, -4, -5, Skull, Skull, Skull, Autofail, Elder sign"),
      Expert: splitAndTrim("0, -1, -1, -2, -2, -3, -3, -4, -4, -5, -6, -8, Skull, Skull, Skull, Autofail, Elder sign")
    },
    TheForgottenAge: {
      Easy: splitAndTrim("+1, +1, 0, 0, 0, -1, -1, -2, -3, Skull, Skull, Elder thing, Autofail, Elder sign"),
      Standard: splitAndTrim("+1, 0, 0, 0, -1, -2, -2, -3, -5, Skull, Skull, Elder thing, Autofail, Elder sign"),
      Hard: splitAndTrim("+1, 0, 0, -1, -2, -3, -3, -4, -6, Skull, Skull, Elder thing, Autofail, Elder sign"),
      Expert: splitAndTrim("0, -1, -2, -2, -3, -3, -4, -4, -6, -8, Skull, Skull, Elder thing, Autofail, Elder sign")
    }
  };

  // Handy functions when computing odds
  // -----------------------------------

  // Outcome function for pulling a specific token
  ArkhamOdds.pulling = function ( aToken ) {
    return function (token) {
      return token == aToken;
    };
  };

  // Success function based on difference between skill value and difficulty value
  // It returns a function so you can use it as an outcome function :
  //  oddsOfOutcome(Bags.NightOfTheZealot.Standard, isSuccess(2));
  // But it can also be used outside outcome function :
  //  isSuccess(2)("Skull");
  ArkhamOdds.isSuccess = function ( skillMinusDifficulty ) {
    return function (token) {
      return ArkhamOdds.isTokenAutoSuccess ( token) || ( !ArkhamOdds.isTokenAutoFailure ( token ) && ArkhamOdds.valueForToken ( token ) >= -skillMinusDifficulty);
    };
  };

  // Sort tokens by their values (from best to worst)
  ArkhamOdds.byTokenValueDesc = function ( tokenA, tokenB ) {
    if ( tokenA == tokenB ) { return 0; }
    if ( ArkhamOdds.isTokenAutoSuccess ( tokenA ) && !ArkhamOdds.isTokenAutoSuccess ( tokenB ) ) { return -1; }
    if ( ArkhamOdds.isTokenAutoSuccess ( tokenB ) && !ArkhamOdds.isTokenAutoSuccess ( tokenA ) ) { return 1; }
    if ( ArkhamOdds.isTokenAutoFailure ( tokenA ) && !ArkhamOdds.isTokenAutoFailure ( tokenB ) ) { return 1; }
    if ( ArkhamOdds.isTokenAutoFailure ( tokenB ) && !ArkhamOdds.isTokenAutoFailure ( tokenA ) ) { return -1; }
    return ArkhamOdds.valueForToken( tokenB ) - ArkhamOdds.valueForToken ( tokenA );
  };

}());