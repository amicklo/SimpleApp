/*-------------------------------------------------------------
 * Bar Chart
 * Color and Letter values separated then charted by weight
 *-------------------------------------------------------------
 */

app.controller('BarChartController', ['$scope', function ($scope) {

    $scope.initChart = function () {

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
                    return xScale(i) + 15;
                })
                .attr("y", function (d) {
                    return h - yScale(d.value);
                })
                .attr("width", xScale.bandwidth()/2)
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
                    return xScale(i) + 15;
                })
                .attr("y", function (d) {
                    return h - yScale(d.value);
                })
                .attr("width", xScale.bandwidth()/2)
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
                    return xScale(i) + xScale.bandwidth() / 4 + 15;
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
                    return xScale(i) + xScale.bandwidth() / 4 + 15;
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
