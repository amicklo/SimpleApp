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
        /*-------------------------------------------------------------
         * Bar Chart
         * Color and Letter values separated then charted by weight
         *-------------------------------------------------------------
         */

        //parse json for bar charts
        d3.json("data/dataCat.json", function (error, data) {
            if (error) throw error;
            //extract data
            data = data.data;

            //initialize filter of data
            var cf = crossfilter(data);

            //initialize dimensions
            var colorDimension = cf.dimension(function (d) {
                return d.category1;
            });

            var alphaDimension = cf.dimension(function (d) {
                return d.category2;
            });

            //initialize groupings
            var colorGrouping = colorDimension.group();
            var alphaGrouping = alphaDimension.group();

            //initialize reduce functions
            function reduceAdd(p, v) {
                return p + v.value;
            }

            function reduceRemove(p, v) {
                return p - v.value;
            }

            function reduceInitial() {
                return 0;
            }

            //reduce groupings
            colorGrouping.reduce(reduceAdd, reduceRemove, reduceInitial);
            alphaGrouping.reduce(reduceAdd, reduceRemove, reduceInitial);

            //extract arrays of grouped data
            var colors = colorGrouping.all();
            var alphas = alphaGrouping.all();

            //put data into arrays
            var colorVals = [];
            for (var i = 0; i < colors.length; i++) {
                colorVals.push(colors[i].value);
            }
            var alphaVals = [];
            for (i = 0; i < alphas.length; i++) {
                alphaVals.push(alphas[i].value);
            }

            //initialize bar chart scales
            var w = 300;
            var h = 300;

            //initialize pads
            var chartGap = 4;
            var textIndent = 18;

            var xScale = d3.scaleBand()
                .domain(d3.range(colorVals.length))
                .rangeRound([0, w])
                .paddingInner(0.05);
            var yScale = d3.scaleLinear()
                .domain([0, d3.max([d3.max(colorVals), d3.max(alphaVals)])])
                .range([0, h]);

            //initialize bar chart svg elements
            var bar1 = d3.select("body")
                .append("svg")
                .attr("float", "right")
                .attr("width", w + chartGap)
                .attr("height", h);

            var bar2 = d3.select("body")
                .append("svg")
                .attr("width", w)
                .attr("height", h);

            //initalize bars
            bar1.selectAll("rect")
                .data(colors)
                .enter()
                .append("rect")
                .attr("x", function (d, i) {
                    return xScale(i);
                })
                .attr("y", function (d) {
                    return h - yScale(d.value);
                })
                .attr("width", xScale.bandwidth())
                .attr("height", function (d) {
                    return yScale(d.value);
                })
                .attr("fill", function (d) {
                    return d.key;
                })
                .append("title")
                .text(function (d) {
                    return d.key;
                });

            bar2.selectAll("rect")
                .data(alphas)
                .enter()
                .append("rect")
                .attr("x", function (d, i) {
                    return xScale(i);
                })
                .attr("y", function (d) {
                    return h - yScale(d.value);
                })
                .attr("width", xScale.bandwidth())
                .attr("height", function (d) {
                    return yScale(d.value);
                })
                .attr("fill", function (d) {
                    return "rgb(0, 0, " + Math.round(d.value / 2) + ")";
                })
                .append("title")
                .text(function (d) {
                    return d.key;
                });

            //append number labels
            bar1.selectAll("text")
                .data(colors)
                .enter()
                .append("text")
                .text(function (d) {
                    return d.value;
                })
                .attr("text-anchor", "middle")
                .attr("x", function (d, i) {
                    return xScale(i) + xScale.bandwidth() / 2;
                })
                .attr("y", function (d) {
                    return h - yScale(d.value) + textIndent;
                })
                .attr("font-family", "sans-serif")
                .attr("font-size", "12px")
                .attr("fill", "black");

            bar2.selectAll("text")
                .data(alphas)
                .enter()
                .append("text")
                .text(function (d) {
                    return d.value;
                })
                .attr("text-anchor", "middle")
                .attr("x", function (d, i) {
                    return xScale(i) + xScale.bandwidth() / 2;
                })
                .attr("y", function (d) {
                    return h - yScale(d.value) + textIndent;
                })
                .attr("font-family", "sans-serif")
                .attr("font-size", "12px")
                .attr("fill", "white");

        });
    }
}]);
