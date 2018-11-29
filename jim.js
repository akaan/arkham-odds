$(function() {

  // A function to append HTML to the #results div
  function appendResult(someHtml) {
  	return $("<p></p>").html(someHtml.replace("\n", "<br/>")).appendTo("#results");
  }

  // A function to append a table to the #result div
  // First line is assumed to be the header
  function appendTableResult(lines) {
  	var table = $("<table class='table'><thead/><tbody/></table>");
  	lines.forEach(function(line, rank) {
  		if ( rank == 0 ) {
  			table.find("thead").append("<tr/>");
  			line.forEach(function(cell) {
  				$("<th/>").html(cell).appendTo(table.find("thead tr"));
  			});
  		} else {
  			table.find("tbody").append("<tr/>");
  			line.forEach(function(cell) {
  				$("<td/>").html(cell).appendTo(table.find("tbody tr:last"));
  			});
  		}
  	});
  	return table.appendTo("#results");
  }

  // Convert odds as percentage
  function asPercentage(prob) {
  	return (Math.round(prob * 10000) / 100) + "%";
  }

  // START YOUR OWN SCRIPT BELOW

  // Choose the best
  function chooseFromOlive (diff) {
    return function (threeTokens) {
      var twoBest = threeTokens.sort(ArkhamOdds.byTokenValueDesc).slice(0,2);
      if ( twoBest.some (t => ArkhamOdds.isTokenAutoFailure(t)) ) {
        return false;
      }
      if ( twoBest.some (t => ArkhamOdds.isTokenAutoSuccess(t)) ) {
        return true;
      }
      return twoBest.reduce ( (sum, t) => sum + ArkhamOdds.valueForToken(t), 0) >= -diff;
    }
  }

  var skillMinusDiff = [-4, -3, -2, -1, 0, 1, 2, 3, 4];

  // Bag setup
  var bag = ArkhamOdds.Bags.TheDunwichLegacy.Standard;

  // Values for Blood on the Altar
  Object.assign(ArkhamOdds.Tokens.Values, {
    "Elder sign": 1,
    "Skull": 0, // Jim
    "Cultist": -2,
    "Tablet": 0, // There's none
    "Elder thing": 0 // There's none
  });

  // Father Mateo
  var jim = skillMinusDiff.map(e => 100 * ArkhamOdds.oddsOfOutcome(bag, ArkhamOdds.isSuccess(e)));

  // Father Mateo with Olive
  var jim_with_olive = skillMinusDiff.map(e => 100 * ArkhamOdds.oddsOfOutcome(ArkhamOdds.combinations(3, bag), chooseFromOlive(e)));

  // Father Mateo with Olive and calling -3 with Recall the Future
  ArkhamOdds.Tokens.Values["-3"] = -1;
  var jim_olive_recall = skillMinusDiff.map(e => 100 * ArkhamOdds.oddsOfOutcome(ArkhamOdds.combinations(3, bag), chooseFromOlive(e)));

  Highcharts.chart('odds-olive', {
    title: { text: 'Odds of success depending on skill vs. difficulty' },
    subtitle: { text: 'The Dunwich Legacy / Blood on the Altar' },
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
    series: [{
        name: 'Jim',
        data: jim
    }, {
        name: 'Jim with Olive',
        data: jim_with_olive
    }, {
        name: 'Jim with Olive and calling -3 with Recall the Future',
        data: jim_olive_recall
    }],
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

  // Recall the Future
  ArkhamOdds.Tokens.Values["-3"] = -3;
  var no_recall = skillMinusDiff.map(e => 100 * ArkhamOdds.oddsOfOutcome(bag, ArkhamOdds.isSuccess(e)));

  ArkhamOdds.Tokens.Values["-4"] = -2;
  var calling_4 = skillMinusDiff.map(e => 100 * ArkhamOdds.oddsOfOutcome(bag, ArkhamOdds.isSuccess(e)));

  ArkhamOdds.Tokens.Values["-4"] = -4;
  ArkhamOdds.Tokens.Values["-3"] = -1;
  var calling_3 = skillMinusDiff.map(e => 100 * ArkhamOdds.oddsOfOutcome(bag, ArkhamOdds.isSuccess(e)));

  ArkhamOdds.Tokens.Values["-3"] = -3;
  ArkhamOdds.Tokens.Values["-1"] = 1;
  var calling_2 = skillMinusDiff.map(e => 100 * ArkhamOdds.oddsOfOutcome(bag, ArkhamOdds.isSuccess(e)));

  ArkhamOdds.Tokens.Values["-1"] = -1;
  ArkhamOdds.Tokens.Values["-2"] = 0;
  var calling_1 = skillMinusDiff.map(e => 100 * ArkhamOdds.oddsOfOutcome(bag, ArkhamOdds.isSuccess(e)));

  ArkhamOdds.Tokens.Values["-2"] = -2;
  ArkhamOdds.Tokens.Values["0"] = 2;
  var calling_0 = skillMinusDiff.map(e => 100 * ArkhamOdds.oddsOfOutcome(bag, ArkhamOdds.isSuccess(e)));

  Highcharts.chart('recall', {
    title: { text: 'Odds of success depending on skill vs. difficulty' },
    subtitle: { text: 'Using Recall the Future' },
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
    series: [{
        name: 'Without Recall the Future',
        data: no_recall
    }, {
        name: 'Calling -4',
        data: calling_4
    }, {
        name: 'Calling -3',
        data: calling_3
    }, {
        name: 'Calling -2',
        data: calling_2
    }, {
        name: 'Calling -1',
        data: calling_1
    }, {
        name: 'Calling 0',
        data: calling_0
    }],
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
