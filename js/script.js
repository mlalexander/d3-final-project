var margin = {top: 20, right: 30, bottom: 30, left: 60},
    width = $(".chart").width() - margin.left - margin.right,
    height = $(".chart").height() - margin.top - margin.bottom;

//formats commas into currency
var formatCurrency = d3.format(",");

var x = d3.scale.linear()
    .range([0, width]);

var y = d3.scale.linear()
    .range([height, 0]);

//adds $ to axis ticks and formats numbers with commas
var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom")
    .tickFormat( function(d) { return "$" + formatCurrency(d) } );

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .tickFormat( function(d) { return "$" + formatCurrency(d) } );

var svg = d3.select(".chart").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var tooltip = d3.select(".chart").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

var theData = {};

var currYear = 2014;

d3.csv("data.csv", function(error, data) {


  data.forEach(function(d) {
    d.loanavg = +d.loanavg;
    d.tuition = +d.tuition;
    d.type = +d.type;
    d.enroll = +d.enroll;

    if (!theData[d.Year]) {
      theData[d.Year] = [];
    }

    theData[d.Year].push(d);

  });

  x.domain(d3.extent(data, function(d) { return d.tuition; })).nice();
  y.domain(d3.extent(data, function(d) { return d.loanavg; })).nice();

  setNav();
  drawChart();

});


function setNav() {


    $(".slider .slider-target").slider({
      min: 2010, //First year in on slider
      max: 2014, //Last year on slider
      step: 1, //Incremental value
      value: 2014, //Starting value
      slide: function( event, ui ) {

        currYear = ui.value;
        $(".year").html(currYear);
        updateChart();


      }
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
      .text("Tuition");

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("class", "label")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", "1em")
      .style("text-anchor", "end")
      .text("Average Federal Student Loan");

      // color legend

                     var LYP = 20, LXP = 720;

                     svg.append("text")
                     .attr("class", "label")
                     .attr("x", LXP - 5)
                     .attr("y", LYP)
                     .text("Institution Type")
                     .style("font-weight", "bold");

      // public school label
                     svg.append("circle")
                     .attr("cx", LXP)
                     .attr("cy", LYP + 20)
                     .attr("r", 10)
                     .style("fill", "#9467bd")
                     .attr("stroke", "#000");

                     svg.append("text")
                     .attr("class", "label")
                     .attr("x", LXP + 15)
                     .attr("y", LYP + 25)
                     .style("text-anchor", "start")
                     .text(function(d) {
                       return "Public";
                     });


      // private school label
                     svg.append("circle")
                     .attr("cx", LXP)
                     .attr("cy", LYP + 50)
                     .attr("r", 10)
                     .style("fill", "#ff7f0e")
                     .attr("stroke", "#000");

                     svg.append("text")
                     .attr("class", "label")
                     .attr("x", LXP + 15)
                     .attr("y", LYP + 55)
                     .style("text-anchor", "start")
                     .text(function(d) {
                       return "Private";
                     });

      // for-profit school label

                     svg.append("circle")
                     .attr("cx", LXP)
                     .attr("cy", LYP + 80)
                     .attr("r", 10)
                     .style("fill", "#1f77b4")
                     .attr("stroke", "#000");

                     svg.append("text")
                     .attr("class", "label")
                     .attr("x", LXP + 15)
                     .attr("y", LYP + 85)
                     .style("text-anchor", "start")
                     .text(function(d) {
                       return "For-profit";
                     });

      updateChart();

}

function updateChart() {

    var data = theData[currYear];

    var colleges = svg.selectAll(".dot")
        .data(data, function(d) {
          return d.school;
        });

    colleges.enter()
      .append("circle")
        .attr("class", "dot")
        .attr("r", 5)
        .attr("cx", function(d) { return x(d.tuition); })
        .attr("cy", function(d) { return y(d.loanavg); })
        .style("fill", function(d) {
          if (d.type == 3) {
            return "#1f77b4";
          } else if (d.type == 2) {
            return "#ff7f0e";
          } else {
            return "#9467bd";
          }

        })


// tooltip on mouseover
        .on("mouseover", function(d) {
            tooltip.transition()
                 .duration(200)
                 .style("opacity", .9);
            tooltip.html("<p><b>" + d.school + "</b></p>" + "Tuition: " + "$" + formatCurrency(d.tuition) + "<br>Average Loan: $" + formatCurrency(d.loanavg) + "<br>Enrollment: " + formatCurrency(d.enroll))


            .style("left", (d3.event.pageX-200) + "px")
            .style("top", (d3.event.pageY-180) + "px");
        })
        .on("mouseout", function(d) {
            tooltip.transition()
                 .duration(500)
                 .style("opacity", 0);

               });


    colleges.exit()
      .transition()
      .duration(200)
      .style("fill", "#000");

    colleges.transition()
      .duration(200)
      .attr("cx", function(d) { return x(d.tuition); })
      .attr("cy", function(d) { return y(d.loanavg); })
      .style("fill", function(d) {
        if (d.type == 3) {
          return "#1f77b4";
        } else if (d.type == 2) {
          return "#ff7f0e";
        } else {
          return "#9467bd";
        }




      })
;

}
