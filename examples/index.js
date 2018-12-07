$(function() {

  // Chaos bag
  var theBag = new ArkhamOdds.Bag(ArkhamOdds.Bags.TheForgottenAge.Standard)
    .addTokens([ArkhamOdds.Token.CULTIST, ArkhamOdds.Token.TABLET]);

  $("#bagContents").text(theBag.getTokens().join(", "));

  // Token effects
  var threadsOfFate = new ArkhamOdds.TokenEffects([
    [ArkhamOdds.Token.SKULL, new ArkhamOdds.Modifier(-1)],
    [ArkhamOdds.Token.CULTIST, new ArkhamOdds.Modifier(-2)],
    [ArkhamOdds.Token.TABLET, new ArkhamOdds.Modifier(-2)],
    [ArkhamOdds.Token.ELDER_THING, new ArkhamOdds.Modifier(-2)]
  ]);

  var investigator = new ArkhamOdds.TokenEffects([
    [ArkhamOdds.Token.ELDER_SIGN, new ArkhamOdds.Modifier(2)]
  ]);

  var theEffects = ArkhamOdds.DefaultTokenEffects
    .merge(threadsOfFate)
    .merge(investigator);

  // Odds
  var skillMinusDiff = [-4, -3, -2, -1, 0, 1, 2, 3, 4];

  // Chart
  Highcharts.chart('standardCurve', {
    title: { text: 'Odds of success' },
    subtitle: { text: 'The Forgotten Age / Standard / A Culist and a Tablet added to the bag / Threads of Fate with Skull = -1 and Elder sign = +2' },
    yAxis: {
      title: { text: 'Odds of success' },
      labels: { format: '{value:.2f}%'}
    },
    legend: {
      layout: 'vertical',
      align: 'right',
      verticalAlign: 'middle'
    },
    plotOptions: {
      series: {
        label: {
          connectorAllowed: false
        },
        pointStart: -4
      }
    },
    series: [
      {
        name: 'Odds',
        data: skillMinusDiff.map((d) => {
          return 100 * ArkhamOdds.odds(1, theBag, theEffects, ArkhamOdds.success(d));
        })
      },
      {
        name: 'Odds with Cultist removed',
        data: skillMinusDiff.map((d) => {
          return 100 * ArkhamOdds.odds(1, theBag.removeToken(ArkhamOdds.Token.CULTIST), theEffects, ArkhamOdds.success(d));
        })
      },
      {
        name: 'Odds with Ritual Candles',
        data: skillMinusDiff.map((d) => {
          return 100 * ArkhamOdds.odds(1, theBag, theEffects, ArkhamOdds.ritualCandles(d));
        })
      },
      {
        name: 'Odds with Recall the Future',
        data: skillMinusDiff.map((d) => {
          return 100 * ArkhamOdds.odds(1, theBag, theEffects, ArkhamOdds.recallTheFuture(d));
        })
      },
      {
        name: 'Odds with Olive McBride',
        data: skillMinusDiff.map((d) => {
          return 100 * ArkhamOdds.odds(3, theBag, theEffects, ArkhamOdds.oliveMcBride(d));
        })
      }
    ],
    responsive: {
      rules: [{
        condition: {
          maxWidth: 500
        },
        chartOptions: {
          legend: {
            layout: 'horizontal',
            align: 'center',
            verticalAlign: 'bottom'
          }
        }
      }]
    }
  });

});
