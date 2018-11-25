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
  var bag = ArkhamOdds.Bags.TheForgottenAge.Standard;
  
  // Values for Untamed Wilds
  Object.assign(ArkhamOdds.Tokens.Values, {
    "Elder sign": 2,
    "Skull": 0, // No vengeance point
    "Cultist": -3, // 3 locations in play
    "Tablet": -2
  });
  
  var no_mateo = skillMinusDiff.map(e => 100 * ArkhamOdds.oddsOfOutcome(bag, ArkhamOdds.isSuccess(e)));
  
  // Father Mateo
  ArkhamOdds.Tokens.AutosuccessTokens ="Elder sign";
  var mateo = skillMinusDiff.map(e => 100 * ArkhamOdds.oddsOfOutcome(bag, ArkhamOdds.isSuccess(e)));
  
  // Father Mateo with Olive
  var mateo_with_olive = skillMinusDiff.map(e => 100 * ArkhamOdds.oddsOfOutcome(ArkhamOdds.combinations(3, bag), chooseFromOlive(e)));
  
  // Father Mateo with Olive and calling -3 with Recall the Future
  ArkhamOdds.Tokens.Values["-3"] = -1;
  var mateo_olive_recall = skillMinusDiff.map(e => 100 * ArkhamOdds.oddsOfOutcome(ArkhamOdds.combinations(3, bag), chooseFromOlive(e)));

  Highcharts.chart('odds-olive', {
    title: { text: 'Odds of success depending on skill vs. difficulty' },
    subtitle: { text: 'The Forgotten Age / Untamed Wilds / No vengeance points, 3 locations in play, not poisoned' },
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
        name: 'Investigator with +2 Elder sign',
        data: no_mateo
    }, {
        name: 'Father Mateo',
        data: mateo
    }, {
        name: 'Father Mateo with Olive',
        data: mateo_with_olive
    }, {
        name: 'Father Mateo with Olive and calling -3 with Recall the Future',
        data: mateo_olive_recall
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
  ArkhamOdds.Tokens.Values["-5"] = -3;
  var calling_5 = skillMinusDiff.map(e => 100 * ArkhamOdds.oddsOfOutcome(bag, ArkhamOdds.isSuccess(e)));
  ArkhamOdds.Tokens.Values["-3"] = -1;
  var calling_3 = skillMinusDiff.map(e => 100 * ArkhamOdds.oddsOfOutcome(bag, ArkhamOdds.isSuccess(e)));
  ArkhamOdds.Tokens.Values["-1"] = 1;
  var calling_1 = skillMinusDiff.map(e => 100 * ArkhamOdds.oddsOfOutcome(bag, ArkhamOdds.isSuccess(e)));
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
        name: 'Calling -5',
        data: calling_5
    }, {
        name: 'Calling -3',
        data: calling_3
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