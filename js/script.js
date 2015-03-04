
/* ------------------------------------------------------- */
/* D3.js Global Variables ----------------------------------- */
/* ------------------------------------------------------- */

//By now, this block of code shoudl be pretty familiar.
//We set our margins, define our scales and types
//And append our SVG somewhere on our chart
//Most bl.ocks examples append to "body", but we append to our .chart div.

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

/* End of D3.js Global Variables ------------------------------- */




// theData is a global variable we'll use hold our stats for each season.
var theData = {};

// currYear will be the "key" we'll use to access an individual year in the data.
//2014 is our default year and the one we'll see whent he page loads.
var currYear = 2014;



// Our data is in the csv format this time,
// so we'll use d3.csv to to load it.
d3.csv("js/mlb.csv", function(error, data) {

  //the raw data object will appear in our console window as one (very) long array.
  console.log(data);

  // Here we filter out the years we don't want.
  // We do this by redefining the value to be an array of objects
  // where the d.Year is greater than or equal to 1985
  data = data.filter(function(d) {
    return +d.Year >= 1985;
  });

  // Two things happen in our .forEach loop:
  // 1) Since we're loading csv, we need to indicate which fields are integers.
  //    In this case, we're defining two new properties. "wins" and "attendance".
  //    We define them as the numberical value of "d.W" and "d.Attendance"
  // 2) As we loop through our data, we're recreating a item in the theData object for each year.
  //    We do this by checking to see if "theData[d.Year]"" exists. 
  //    The if statement below can be read as:
  //        "if not theData[d.Year], create theData[d.Year] and define it as an empty array"
  //    Then, we push the item into that array.
  //    A metaphor: It's like sorting a box of M&Ms. Each M&M goes in a pile of like colors.
  //    If you come across an M&M with no pile, you create a new pile.


  data.forEach(function(d) {
    d.wins = +d.W;
    d.attendance = +d.Attendance;

    if (!theData[d.Year]) {
      theData[d.Year] = [];
    }

    theData[d.Year].push(d);

  });


  //Here we define the domains of the X and Y scales...
  //... as everything between the lowest and highest values of wins and attendance.
  x.domain(d3.extent(data, function(d) { return d.wins; })).nice();
  y.domain(d3.extent(data, function(d) { return d.attendance; })).nice();

  //Once our data is set, we're safe to call our functions.
  setNav();
  drawChart();

});





// setNav is where we assign our button events.
// When any element with the class "btn" is clicked,
// We ask what it's "val" property is.
// Since "val" is defined as a corresponding year in our index.html file,
// We can directly assign that to be the new value of currYear.
// Then, we update our chart.

function setNav() {

  $(".btn").on("click", function() {
    var val = $(this).attr("val");
    currYear = val;

    updateChart();

  });

}




// We separated our chart into two fucntions: drawChart() and updateChart()
// drawChart will only be called once — when the page is loaded.
// This is where we draw our x and y axis.
// And since we're not clicking any buttons when the page loads,
// We'll directly call updateChart(), which is where the circles get drawn on the chart.
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



// At last, this is where our data gets drawn on the chart.

function updateChart() {


  /* -------------- */
  /* Circles
  /* -------------- */

    // First, we define our data element as the value of theData[currYear].
    // Remember, this is simply an array of objects taht all have the same value for the property "Year".
    var data = theData[currYear];

    // Select all elements classed ".dot"
    // Assign the data as the value of "data" and match each element to d.Tm.
    var teams = svg.selectAll(".dot")
        .data(data, function(d) {
          return d.Tm;
        });
      
    // If d.Tm does match any elements classed ".dot",
    // We create a new one. In other words, it "enters" the chart.
    // The first time our page loads, no circles with the class name "dot" exist
    // So we append a new one and give it an cx, cy position based on wins and attendance.
    // If the circle already exists for that team, we do nothing here.
    teams.enter()
      .append("circle")
        .attr("class", "dot")
        .attr("r", 10)
        .attr("cx", function(d) { return x(d.wins); })
        .attr("cy", function(d) { return y(d.attendance); })
        .style("fill", function(d) { return color(d.Tm); });

    // By the same token, if an "circle" element with the class name "dot" is already on the page
    // But the d.Tm property doesn't match anything in the new data,
    // It "exits".
    // Exit doesn't actually remove it though.
    // Exit is just what we use to select the elements that aren't represented in our data.
    // If we'd like to remove it, we use .remove().
    // I've left the transition to black in place so you can see it in action.
    teams.exit()
      .transition()
      .duration(200)
      .style("fill", "#000");
      //.remove();


    // Finally, we want to reassign the position of all elements that alredy exist on the chart
    // AND are represented in the current batch of data.
    // Here we transition (animate) them to new x,y positions on the page.
    teams.transition()
      .duration(200)
      .attr("cx", function(d) { return x(d.wins); })
      .attr("cy", function(d) { return y(d.attendance); })
      .style("fill", function(d) { return color(d.Tm); });






  /* -------------- */
  /* Labels
  /* -------------- */

    //Everything we did above we'll also do with labels.
    //It is literally the exact same pattern.

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





