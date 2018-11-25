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
  
  // Bag setup
  var bag = ArkhamOdds.Bags.ThePathToCarcosa.Standard;
  Object.assign(ArkhamOdds.Tokens.Values, {
    "Elder sign": 1,
    "Skull": -1, // Jim
    "Cultist": -1,
    "Tablet": -1
  });
  
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
  
  appendResult("<div id='container' />");
  var skillMinusDiff = [-4, -3, -2, -1, 0, 1, 2, 3, 4];
  Highcharts.chart('container', {
    title: { text: 'Odds of success depending on skill vs. difficulty' },
    subtitle: { text: 'Night of the Zealot' },
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
        name: 'Without Olive',
        data: skillMinusDiff.map(e => 100 * ArkhamOdds.oddsOfOutcome(bag, ArkhamOdds.isSuccess(e)))
    }, {
        name: 'With Olive',
        data: skillMinusDiff.map(e => 100 * ArkhamOdds.oddsOfOutcome(ArkhamOdds.combinations(3, bag), chooseFromOlive(e)))
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