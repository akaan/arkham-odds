$(function() {
  function makeChart(targetId, title, subtitle, series) {
    Highcharts.chart(targetId, {
      title: { text: title },
      subtitle: { text: subtitle },
      yAxis: {
        title: { text: "Odds of success" },
        labels: { format: "{value:.2f}%" }
      },
      legend: { layout: "vertical", align: "right", verticalAlign: "middle" },
      plotOptions: {
        series: {
          label: { connectorAllowed: false },
          pointStart: -4
        }
      },
      series: series,
      responsive: {
        rules: [
          {
            condition: {
              maxWidth: 500
            },
            chartOptions: {
              legend: {
                layout: "horizontal",
                align: "center",
                verticalAlign: "bottom"
              }
            }
          }
        ]
      }
    });
  }

  // Chaos bag
  const theBag = new ArkhamOdds.Bag(
    ArkhamOdds.Bags.TheForgottenAge.Standard
  ).addTokens([ArkhamOdds.Token.CULTIST, ArkhamOdds.Token.TABLET]);

  $("#bagContents").text(theBag.getTokens().join(", "));

  // Token effects
  const threadsOfFate = new ArkhamOdds.TokenEffects([
    [ArkhamOdds.Token.SKULL, new ArkhamOdds.Modifier(-1)],
    [ArkhamOdds.Token.CULTIST, new ArkhamOdds.Modifier(-2)],
    [ArkhamOdds.Token.TABLET, new ArkhamOdds.Modifier(-2)],
    [ArkhamOdds.Token.ELDER_THING, new ArkhamOdds.Modifier(-2)]
  ]);

  const investigator = new ArkhamOdds.TokenEffects([
    [ArkhamOdds.Token.ELDER_SIGN, new ArkhamOdds.Modifier(2)]
  ]);

  const theEffects = ArkhamOdds.DefaultTokenEffects.merge(threadsOfFate).merge(
    investigator
  );

  // Odds
  const skillMinusDiff = [-4, -3, -2, -1, 0, 1, 2, 3, 4];

  // Chart
  makeChart(
    "variousCards",
    "Odds of success",
    "The Forgotten Age / Standard / A Culist and a Tablet added to the bag \
    / Threads of Fate with Skull = -1 and Elder sign = +2",
    [
      {
        name: "Odds",
        data: skillMinusDiff.map(d => {
          return (
            100 * ArkhamOdds.odds(1, theBag, theEffects, ArkhamOdds.success(d))
          );
        })
      },
      {
        name: "Odds with Cultist removed",
        data: skillMinusDiff.map(d => {
          return (
            100 *
            ArkhamOdds.odds(
              1,
              theBag.removeToken(ArkhamOdds.Token.CULTIST),
              theEffects,
              ArkhamOdds.success(d)
            )
          );
        })
      },
      {
        name: "Odds with Ritual Candles",
        data: skillMinusDiff.map(d => {
          return (
            100 *
            ArkhamOdds.odds(1, theBag, theEffects, ArkhamOdds.ritualCandles(d))
          );
        })
      },
      {
        name: "Odds with Recall the Future",
        data: skillMinusDiff.map(d => {
          return (
            100 *
            ArkhamOdds.odds(
              1,
              theBag,
              theEffects,
              ArkhamOdds.recallTheFuture(d)
            )
          );
        })
      },
      {
        name: "Odds with Olive McBride",
        data: skillMinusDiff.map(d => {
          return (
            100 *
            ArkhamOdds.odds(3, theBag, theEffects, ArkhamOdds.oliveMcBride(d))
          );
        })
      },
      {
        name: "Odds with Dark Prophecy",
        data: skillMinusDiff.map(d => {
          return (
            100 *
            ArkhamOdds.odds(5, theBag, theEffects, ArkhamOdds.darkProphecy(d))
          );
        })
      }
    ]
  );

  // Olive McBride with Father Mateo and Jim Culver

  const mateo = new ArkhamOdds.TokenEffects([
    [ArkhamOdds.Token.ELDER_SIGN, new ArkhamOdds.Autosuccess()]
  ]);
  const jim = new ArkhamOdds.TokenEffects([
    [ArkhamOdds.Token.SKULL, new ArkhamOdds.Modifier(0)]
  ]);

  makeChart(
    "oliveWithMateoAndJim",
    "Olive McBride with Father Mateo and Jim Culver",
    "The Forgotten Age / Standard / A Culist and a Tablet added to the bag \
    / Threads of Fate with Skull = -1",
    [
      {
        name: "Investigator with Elder Sign = +2",
        data: skillMinusDiff.map(d => {
          return (
            100 * ArkhamOdds.odds(1, theBag, theEffects, ArkhamOdds.success(d))
          );
        })
      },
      {
        name: "Father Mateo and Olive McBride",
        data: skillMinusDiff.map(d => {
          return (
            100 *
            ArkhamOdds.odds(
              3,
              theBag,
              theEffects.merge(mateo),
              ArkhamOdds.oliveMcBride(d)
            )
          );
        })
      },
      {
        name: "Jim Culver and Olive McBride",
        data: skillMinusDiff.map(d => {
          return (
            100 *
            ArkhamOdds.odds(
              3,
              theBag,
              theEffects.merge(jim),
              ArkhamOdds.oliveMcBride(d)
            )
          );
        })
      }
    ]
  );

  // Song of the Dead
  makeChart(
    "songOfTheDead",
    "Jim Culver using Song of the Dead with Olive McBride",
    "The Forgotten Age / Standard / A Culist and a Tablet added to the bag \
    / Threads of Fate with Skull = -1",
    [
      {
        name: "Hitting",
        data: skillMinusDiff.map(d => {
          return (
            100 *
            ArkhamOdds.odds(
              3,
              theBag,
              theEffects.merge(jim),
              ArkhamOdds.oliveMcBride(d)
            )
          );
        })
      },
      {
        name: "Hitting with +2 damage",
        data: skillMinusDiff.map(d => {
          return (
            100 *
            ArkhamOdds.odds(
              3,
              theBag,
              theEffects.merge(jim),
              ArkhamOdds.oliveMcBrideWithSkull(d)
            )
          );
        })
      }
    ]
  );

  // Shards of the Void and Olive McBride
  const shardsOfTheVoid = (diff, numOfZerosWished) => {
    return (tokensPulled, tokenEffects) => {
      const numOfZerosPulled = tokensPulled.filter(
        t => t === ArkhamOdds.Token.ZERO
      ).length;

      if (numOfZerosPulled < numOfZerosWished) {
        return false;
      }

      if (numOfZerosWished === 1) {
        const zero = tokensPulled.splice(
          tokensPulled.indexOf(ArkhamOdds.Token.ZERO),
          1
        );
        const secondToken = tokenEffects
          .sortByBestOutcomeDesc(tokensPulled)
          .slice(0, 1);
        return tokenEffects.isSuccess(zero.concat(secondToken), diff);
      } else {
        return tokenEffects.isSuccess(
          [ArkhamOdds.Token.ZERO, ArkhamOdds.Token.ZERO],
          diff
        );
      }
    };
  };
  makeChart(
    "shardsOfTheVoid",
    "Jim Culver using Shards of the Void with Olive McBride",
    "The Forgotten Age / Standard / A Cultist and a Tablet added to the bag \
    / Threads of Fate with Skull = -1",
    [
      {
        name: "Hitting",
        data: skillMinusDiff.map(d => {
          return (
            100 *
            ArkhamOdds.odds(
              3,
              theBag,
              theEffects.merge(jim),
              ArkhamOdds.oliveMcBride(d)
            )
          );
        })
      },
      {
        name: "Hitting with 3+ damage",
        data: skillMinusDiff.map(d => {
          return (
            100 *
            ArkhamOdds.odds(
              3,
              theBag,
              theEffects.merge(jim),
              shardsOfTheVoid(d, 1)
            )
          );
        })
      },
      {
        name: "Hitting with 4 damage",
        data: skillMinusDiff.map(d => {
          return (
            100 *
            ArkhamOdds.odds(
              3,
              theBag,
              theEffects.merge(jim),
              shardsOfTheVoid(d, 2)
            )
          );
        })
      }
    ]
  );

  makeChart(
    "winchester",
    "Jim Culver using .35 Winchester with Olive McBride",
    "The Forgotten Age / Standard / A Cultist and a Tablet added to the bag \
    / Threads of Fate with Skull = -1",
    [
      {
        name: "Hitting (1 or 3 damage) without Olive",
        data: skillMinusDiff.map(d => {
          return (
            100 *
            ArkhamOdds.odds(
              1,
              theBag,
              theEffects.merge(jim),
              ArkhamOdds.success(d)
            )
          );
        })
      },
      {
        name: "Using Olive",
        data: skillMinusDiff.map(d => {
          return (
            100 *
            ArkhamOdds.odds(
              3,
              theBag,
              theEffects.merge(jim),
              ArkhamOdds.oliveMcBride(d)
            )
          );
        })
      },
      {
        name: "Using Olive and hitting for exactly 1 damage",
        data: skillMinusDiff.map(d => {
          return (
            100 *
            ArkhamOdds.odds(
              3,
              theBag,
              theEffects.merge(jim),
              ArkhamOdds.oliveMcBrideAndWinchesterDoing1Damage(d)
            )
          );
        })
      },
      {
        name: "Using Olive and hitting for exactly 3 damage",
        data: skillMinusDiff.map(d => {
          return (
            100 *
            ArkhamOdds.odds(
              3,
              theBag,
              theEffects.merge(jim),
              ArkhamOdds.oliveMcBrideAndWinchesterDoing3Damage(d)
            )
          );
        })
      }
    ]
  );
});
