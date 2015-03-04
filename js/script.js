var margin = {top: 20, right: 20, bottom: 30, left: 100},
    width = $(".chart").width() - margin.left - margin.right,
    height = $(".chart").height() - margin.top - margin.bottom;

var x = d3.scale.linear()
    .range([0, width]);

var y = d3.scale.linear()
    .range([height, 0]);

var color = d3.scale.category10();

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

var svg = d3.select(".chart").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


var theData = {};
var currYear = 2014;



var teamColors = {
  "St. Louis Cardinals" : "red",
  "Kansas City Royals" : "blue"
}





d3.csv("js/mlb.csv", function(error, data) {

  console.log(data);

  data = data.filter(function(d) {
    return +d.Year >= 1985;
  });

  data.forEach(function(d) {
    d.wins = +d.W;
    d.attendance = +d.Attendance;

    if (!theData[d.Year]) {
      theData[d.Year] = [];
    }

    theData[d.Year].push(d);

  });

  x.domain(d3.extent(data, function(d) { return d.wins; })).nice();
  y.domain(d3.extent(data, function(d) { return d.attendance; })).nice();

  setNav();
  drawChart();

});





function setNav() {

  $(".btn").on("click", function() {
    var val = $(this).attr("val");
    currYear = val;

    updateChart();

  });

}






function drawChart() {

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
    .append("text")
      .attr("class", "label")
      .attr("x", width)
      .attr("y", -6)
      .style("text-anchor", "end")
      .text("Wins");

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("class", "label")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Season Attendance");

      updateChart();

}




function updateChart() {

    var data = theData[currYear];

    //The attached to our selected circles (".dot")s
    var teams = svg.selectAll(".dot")
        .data(data, function(d) {
          return d.Tm;
        });
      
    teams.enter()
      .append("circle")
        .attr("class", "dot")
        .attr("r", 10)
        .attr("cx", function(d) { return x(d.wins); })
        .attr("cy", function(d) { return y(d.attendance); })
        .style("fill", function(d) { return color(d.Tm); });

    teams.exit()
      .transition()
      .duration(200)
      .style("fill", "#000");
      //.remove();

    teams.transition()
      .duration(200)
      .attr("cx", function(d) { return x(d.wins); })
      .attr("cy", function(d) { return y(d.attendance); })
      .style("fill", function(d) { return color(d.Tm); });





    var labels = svg.selectAll(".lbl")
        .data(data, function(d) {
          return d.Tm;
        });
      
    labels.enter()
      .append("text")
        .attr("class", "lbl")
        .attr("x", function(d) { return x(d.wins); })
        .attr("y", function(d) { return y(d.attendance); })
        .text(function(d) {
          return d.Tm;
        });

    labels.exit()
      .remove();

    labels.transition()
      .duration(200)
      .attr("x", function(d) { return x(d.wins); })
      .attr("y", function(d) { return y(d.attendance); })





}





