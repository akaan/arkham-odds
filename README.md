# ArkhamOdds

ArkhamOdds is a Javascript library for computing odds of outcome in Arkham
Horror : The Card Game.

## How to use

Clone this repository and start editing `index.js`. Then open `index.html`
in your favorite browser.

**NOTE** This project is work in progress. For now I didn't bother with old
browser compatibility so you should use an up to date browser.

## What's inside

ArkhamOdds provide 2 main functions for computing odds (`combinations`,
`oddsOfOutcome`), a set of utility functions and reference data.

`combinations` will generate all combinations of k elements from the given
population of elements. It will prove useful when pulling multiple tokens
from the chaos bag (Grotesque Statue, Dark Prophecy, Olive McBride...).
*Note that you shouldn't use this for Wendy's ability as the first token
is sent back to the bag.*

```javascript
ArkhamOdds.combinations(2, [1, 2, 3]); // [[1, 2], [1, 3], [2, 3]]
```

`oddsOfOutcome` will simply count all element satisfaying the provided outcome
and divide by the total number of arguments.

```javascript
ArkhamOdds.oddsOfOutcome([1, 2, 3], function(e) { return e == 2; }); // 0.3333333333333333
```

## Basic usage

The example below is the simplest usage of the library : it computes the odds
of pulling a specific token.

```javascript
var myBag = ArkhamOdds.Bags.NightOfTheZealot.Standard;
var prob = ArkhamOdds.oddsOfOutcome(myBag, function(e) { return e == "Skull"; });
appendResult("Odds of pulling Skull: " + asPercentage(prob));
```

As this is common usage, the outcome function can be replaced using the
`pulling` utility function :

```javascript
var prob = ArkhamOdds.oddsOfOutcome(myBag, ArkhamOdds.pulling("Skull"));
appendResult("Odds of pulling Skull: " + asPercentage(prob));
```

Another common use is computing your odds of success based on the difference
between your skill value and the test difficulty.
Before doing so, you want to set values for special tokens :

```javascript
Object.assign(ArkhamOdds.Tokens.Values, {
  "Elder sign": 1,
  "Skull": -1,
  "Cultist": -1,
  "Tablet": -2
});
```

You may also want to specify autosuccess and/or autofail tokens (by default
"Autofail" is the only autofail token and there are no autosuccess tokens) :

```javascript
// For Father Mateo :
ArkhamOdds.Tokens.AutosuccessTokens = ["Elder sign"];
```

Then, the `isSuccess` outcome function will take care of it : check for
autosuccess or autofail and if not compare token value to the difference
between the skill value and the test difficulty.

```javascript
var prob = ArkhamOdds.oddsOfOutcome(myBag, ArkhamOdds.isSuccess(2));
appendResult("Odds of success when (skill - difficulty) is 2: " + asPercentage(prob));
```

You can iterate to get an overview :

```javascript
var prob;
[-4, -3, -2, -1, 0, 1, 2, 3, 4].forEach(function (d) {
  prob = ArkhamOdds.oddsOfOutcome(myBag, ArkhamOdds.isSuccess(d));
  appendResult("Odds of success when (skill - difficulty) is " + d + ": " + asPercentage(prob));
});
```

## Grotesque Statue, Dark Prophecy and the like

Computing odds when using effects like Grotesque Statue is a bit more complex.
You first need to generate all possible combinations and then choose a token
for each combination.

For this first example, let's say you will always choose token with highest
value (which is the most common case).

```javascript
var grotesqueStatue = ArkhamOdds.combinations(2, myBag);
var chosenTokens = grotesqueStatue.map (function (twoTokens) {
  return twoTokens.sort ( ArkhamOdds.byTokenValueDesc )[0];
});
var prob = ArkhamOdds.oddsOfOutcome(chosenTokens, ArkhamOdds.isSuccess(2));
appendResult("Odds of success when (skill - difficulty) is 2 using Grotesque Statue: " + asPercentage(prob));
```

Dark Prophecy makes you pull 5 tokens and choose a special one if able.
We assume choosing the best special token if there are some.

```javascript
var darkProphecy = ArkhamOdds.combinations(5, myBag);
var chosenTokens = darkProphecy.map (function (fiveTokens) {
  var specialTokens = fiveTokens.filter(function (t) { return ArkhamOdds.isTokenSpecial(t); });
  if ( specialTokens.length != 0) {
    return specialTokens.sort ( ArkhamOdds.byTokenValueDesc )[0];
  } else {
    return fiveTokens.sort ( ArkhamOdds.byTokenValueDesc )[0];
  }
});
var prob = ArkhamOdds.oddsOfOutcome(chosenTokens, ArkhamOdds.isSuccess(2));
appendResult("Odds of success when (skill - difficulty) is 2 using Dark Prophecy: " + asPercentage(prob));
```

## A more complex usage

For now on, we used the `isSuccess` outcome function. Let's say we want to
compute the odds of dealing 3 damage using Jim, Song of the Dead and Olive
McBride whith total skill value equal to the test difficulty.
Basically, we want to get at least a Skull and another token with value >= 0.

```javascript
// Hey ! We're Jim !
ArkhamOdds.Tokens.Values["Skull"] = 0;

var oliveMcBride = ArkhamOdds.combinations(3, myBag);
var prob = ArkhamOdds.oddsOfOutcome(oliveMcBride, function (threeTokens) {
  // We assume Jim will treat his Elder Sign as a Skull so we just replace it
  var tokens = threeTokens.map(function (t) {
    return t == "Elder sign" ? "Skull" : t;
  });
  if ( tokens.includes("Skull")) {
    // remove the skull
    tokens.splice(tokens.indexOf("Skull"), 1);
    var secondToken = tokens.sort(ArkhamOdds.byTokenValueDesc)[0];
    return ArkhamOdds.isSuccess(0)(secondToken);
  } else {
    // No skull
    return false;
  }
});
appendResult("Dealing 3 damage with Jim, Song of the Dead and Olive McBride when (skill - difficulty) is 0: " + asPercentage(prob));
```

## What about Wendy's ability ?

When using Wendy's ability, the canceled token is returned to the bag. As such,
you must use a **cartesian product** instead of combinations. Then, for each pair
of token, you check if first is a success, if not, check is second is a success.
This will also illustrate the use of `appendTableResult` to present results as
a table.

```javascript
var myBag = ArkhamOdds.Bags.NightOfTheZealot.Standard;
Object.assign(ArkhamOdds.Tokens.Values, {
  "Elder sign": 0,
  "Skull": -1,
  "Cultist": -1,
  "Tablet": -2
});
var data;

appendResult("<h2>Wendy's ability</h2>");
data = [["Skill - Difficulty", "Odds of success without Wendy's ability", "Odds of success using Wendy's ability if needed"]];
var wendy = ArkhamOdds.product(myBag, myBag);
[-4, -3, -2, -1, 0, 1, 2, 3, 4].forEach(function (d) {
  var probWithout = ArkhamOdds.oddsOfOutcome(myBag, ArkhamOdds.isSuccess(d));
  var probWith = ArkhamOdds.oddsOfOutcome(wendy, function (tokenAndRedraw) {
    return ArkhamOdds.isSuccess(d)(tokenAndRedraw[0]) || ArkhamOdds.isSuccess(d)(tokenAndRedraw[1]);
  });
  data.push([d, asPercentage(probWithout), asPercentage(probWith)]);
});
appendTableResult(data);
```