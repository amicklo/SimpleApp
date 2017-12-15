/*-------------------------------------------------------------------
 * Bar Chart
 * Color and Letter values separated then charted by weight
 * some chart logic taken from:
 * https://bl.ocks.org/alandunning/7008d0332cc28a826b37b3cf6e7bd998
 * https://bl.ocks.org/caravinden/eb0e5a2b38c8815919290fa838c6b63b
 *-------------------------------------------------------------------
 */

app.controller('BarChartController', ['$scope', 'factory', function ($scope, factory) {

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

            //extract arrays of grouped data
            var colors = factory.filter(colorDimension);
            var alphas = factory.filter(alphaDimension);

            var chartPad = 25;

            var margin = {
                    top: 20,
                    right: 20,
                    bottom: 30,
                    left: 75
                },
                width = 960 - margin.left - margin.right,
                height = 500 - margin.top - margin.bottom;

            // set the ranges
            var y = d3.scaleBand()
                .range([height, 0])
                .padding(0.1);

            var x = d3.scaleLinear()
                .range([0, width]);

            // append the svg object to the body of the page
            // append a 'group' element to 'svg'
            // moves the 'group' element to the top left margin
            var svg = d3.select("body").append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform",
                    "translate(" + margin.left + "," + margin.top + ")");

            // Scale the range of the data in the domains
            x.domain([0, d3.max(colors.concat(alphas), function (d) {
                return d.value + chartPad;
            })]);
            y.domain(colors.map(function (d) {
                return d.key;
            }));

            // append the x and y Axes
            svg.append("g")
                .attr("transform", "translate(0," + height + ")")
                .call(d3.axisBottom(x).tickSizeInner([-height]));

            svg.append("g")
                .style("font", "13px sans-serif")
                .call(d3.axisLeft(y));

            // append the Bars
            svg.selectAll(".bar")
                .data(colors)
                .enter().append("rect")
                .attr("class", "bar")
                .attr("y", function (d) {
                    return y(d.key) + (y.bandwidth() / 4);
                })
                .attr("height", y.bandwidth() / 2)
                .append("title")
                .text(function (d) {
                    return d.value;
                });

            svg.selectAll(".bar")
                .data(colors)
                .transition()
                .duration(1000)
                .attr("width", function (d) {
                    return x(d.value);
                });

            d3.select("body").append("h1").html("Alphabet");

            y.domain(alphas.map(function (d) {
                return d.key;
            }));

            var svg2 = d3.select("body").append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform",
                    "translate(" + margin.left + "," + margin.top + ")");

            // append the x and y Axes
            svg2.append("g")
                .attr("transform", "translate(0," + height + ")")
                .call(d3.axisBottom(x).tickSizeInner([-height]));

            svg2.append("g")
                .style("font", "13px sans-serif")
                .call(d3.axisLeft(y));

            // append the Bars
            svg2.selectAll(".bar")
                .data(alphas)
                .enter().append("rect")
                .attr("class", "bar")
                .attr("y", function (d) {
                    return y(d.key) + (y.bandwidth() / 4);
                })
                .attr("height", y.bandwidth() / 2)
                .append("title")
                .text(function (d) {
                    return d.value;
                });

            svg2.selectAll(".bar")
                .data(alphas)
                .transition()
                .duration(1000)
                .attr("width", function (d) {
                    return x(d.value);
                });

        });

    }
}]);
