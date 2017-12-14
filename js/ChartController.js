app.controller('ChartController', ['$scope', function ($scope) {
    //styles the svg tabs at the top of the oage
    $scope.initTabs = function () {
        var svg = d3.select("body");

        svg.selectAll("rect")
            .attr("fill", "MidnightBlue")
            .on("mouseover", function () {
                d3.select(this)
                    .transition()
                    .attr("fill", "Blue");
            })
            .on("mouseout", function () {
                d3.select(this)
                    .transition()
                    .attr("fill", "MidnightBlue");
            });
    };
    //draws a line chart and two bar charts
    $scope.initChart = function () {
        var margin = {
                top: 20,
                right: 20,
                bottom: 30,
                left: 50
            },
            width = 960 - margin.left - margin.right,
            height = 500 - margin.top - margin.bottom;

        // parse date
        var parseTime = d3.timeParse("%m/%d/%Y");

        // ranges
        var x = d3.scaleTime().range([0, width]);
        var y = d3.scaleLinear().range([height, 0]);

        // line
        var valueline = d3.line()
            .x(function (d) {
                return x(d.date);
            })
            .y(function (d) {
                return y(d.value);
            });

        var line = d3.select("body").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");

        function draw(data, val) {

            var data = data[val];

            // format the data
            data.forEach(function (d) {
                d.date = parseTime(d.date);
                d.value = +d.value;
            });

            // sort years ascending
            data.sort(function (a, b) {
                return a["date"] - b["date"];
            });

            // Scale the range of the data
            x.domain(d3.extent(data, function (d) {
                return d.date;
            }));
            y.domain([0, d3.max(data, function (d) {
                return Math.max(d.value);
            })]);

            // Add the valueline path.
            line.append("path")
                .data([data])
                .attr("class", "line")
                .attr("d", valueline);
            // Add the X Axis
            line.append("g")
                .attr("transform", "translate(0," + height + ")")
                .call(d3.axisBottom(x));

            // Add the Y Axis
            line.append("g")
                .call(d3.axisLeft(y));
        }
        // Get the data
        d3.json("data/data.json", function (error, data) {
            if (error) throw error;

            // trigger render
            draw(data, "data");
        });
        
    }
}]);
