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

});