app.directive('tasks', ['taskBars', function (taskBars, $scope) {

    return {
        restrict: 'E',
        scope: {},
        controller: function ($scope) {

            //read in the data from the JSON
            d3.json('data/taskData.json', function (error, data) {
                if (error) throw error;
                //assign the data array from the JSON to the variable 'data'
                data = data.data;
                //create margins for chart
                var margin = {
                    top: 20,
                    right: 40,
                    bottom: 20,
                    left: 150,
                }
                //initialize time domains
                var dayStart = "2018-01-01 03:00:00",
                    dayEnd = "2018-01-02 03:00:00";
                var timeDomainStart = d3.timeDay.offset(moment(dayStart), +0),
                    timeDomainEnd = d3.timeHour.offset(moment(dayEnd), +0);
                //create an array of individuals from the JSON
                var people = [];
                for (var i in data) {
                    if (!people.includes(data[i].person)) {
                        people.push(data[i].person);
                    }
                }
                //initialize the dimensions of the chart
                var rowHeight = 120,
                    height = (rowHeight * people.length),
                    width = 1000;
                //format string for the time labels of the x-axis
                var tickFormat = "%H:%M";
                //initialize the x scale
                var x = d3.scaleTime()
                    .domain([timeDomainStart, timeDomainEnd])
                    .range([0, width])
                    .clamp(true);
                //initialize the y scale
                var y = d3.scaleBand()
                    .domain(people)
                    .rangeRound([0, height - margin.bottom - margin.top]);
                //define the chart area
                var svg = d3.select("body")
                    .append("svg")
                    .attr("class", "chart")
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom)
                    .append("g")
                    .attr("class", "task-chart")
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom)
                    .attr("transform", "translate(" + margin.left + ", " + margin.top + ")");
                //define the x axis
                var xAxis = d3.axisBottom()
                    .scale(x)
                    .tickFormat(d3.timeFormat(tickFormat))
                    .ticks(24);
                //define axis functions for creating grid lines
                function makeHorizGridlines() {
                    return d3.axisLeft(y);
                }

                function makeVertGridlines() {
                    return d3.axisBottom(x);
                }
                //attach the x and y axes
                svg.append("g")
                    .attr("class", "x axis")
                    .attr("transform", "translate(0, " + (height - margin.top - margin.bottom) + ")")
                    .transition()
                    .call(xAxis);
                var yAxis = svg.append("g")
                    .style("font", "13px sans-serif")
                    .call(d3.axisLeft(y).tickSize(0));
                //attach the grid lines
                svg.append("g")
                    .attr("class", "gridH")
                    .attr("transform", "translate(0,-55)")
                    .call(makeHorizGridlines()
                        .tickSize(-width)
                        .tickFormat("")
                    );
                svg.append("g")
                    .attr("class", "gridV")
                    .attr("transform", "translate(0,0)")
                    .call(makeVertGridlines()
                        .tickSize(height - margin.top - margin.bottom)
                        .tickFormat("")
                        .ticks(24)
                    );
                /*--------------------------------------------------------------------------------------------*
                 * attach the labelled bars for the planned task times
                 * parameters in the order they are used:
                 * @svg         the svg element that will contain the bars (the chart so far)
                 * @data        the dataset parsed fromt the JSON
                 * @x           the x-axis scale function
                 * @y           the y axis scale function
                 * @barOffset   vertical amount to move the bar from the default calculated tow position
                 * @labelOffset vertical amount to move the label so it ends up in the center of the bar
                 * @fill color  that the bar will default to
                 * @start the   start time of bar
                 * @end the     time of bar
                 * @dayStart    the first hour of the day being represented
                 * @dayEnd      the last hour of the day being represented
                 *--------------------------------------------------------------------------------------------*/
                taskBars.addBars(svg, data, x, y, 10, 33, "#404040", "startPlan", "endPlan", dayStart, dayEnd);
                // attach labelled bars for the actual task times
                taskBars.addBars(svg, data, x, y, 65, 88, "black", "startActual", "endActual", dayStart, dayEnd);
                taskBars.addButtons(svg, data, x);

            });
        }
    }
}]);
