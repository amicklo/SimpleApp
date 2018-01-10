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
                var dayOne = "2018-01-01 03:00:00",
                    dayTwo = "2018-01-02 03:00:00";

                var timeDomainStart = d3.timeDay.offset(moment(dayOne), +0),
                    timeDomainEnd = d3.timeHour.offset(moment(dayTwo), +0);
                //create an array of individuals from the JSON
                var people = [];
                for (var i in data) {
                    if (!people.includes(data[i].person)) {
                        people.push(data[i].person);
                    }
                }
                //initialize the dimensions of the chart
                var height = (120 * people.length),
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
                //define the x axis
                var xAxis = d3.axisBottom()
                    .scale(x)
                    .tickFormat(d3.timeFormat(tickFormat))
                    .ticks(24);
                //define the y axis
                var yAxis = d3.axisLeft()
                    .scale(y)
                    .tickSize(0);
                //define axis functions for creating grid lines
                function makeHorizGridlines() {
                    return d3.axisLeft(y);
                }

                function makeVertGridlines() {
                    return d3.axisBottom(x);
                }
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
                //attach the x and y axes
                svg.append("g")
                    .attr("class", "x axis")
                    .attr("transform", "translate(0, " + (height - margin.top - margin.bottom) + ")")
                    .transition()
                    .call(xAxis);
                svg.append("g")
                    .attr("class", "y axis")
                    .transition()
                    .call(yAxis);
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
                //attach the bars for the planned task times
                taskBars.addBars(svg, data, x, y, 5, 35, "midnightblue", "startPlan", "endPlan");
                //attach bars for the actual task times
                taskBars.addBars(svg, data, x, y, 60, 87, "darkred", "startActual", "endActual");

            });
        }
    }
}]);
