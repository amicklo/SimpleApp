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
            data = colors.concat(alphas);

            var height = 300;
            var width = 400;

            var margin = {
                    top: 20,
                    right: 20,
                    bottom: 30,
                    left: 60
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

            /* format the data
            data.forEach(function (d) {
                d.value = +d.value;
            });*/

            // Scale the range of the data in the domains
            x.domain([0, d3.max(colors.concat(alphas), function (d) {
                return d.value;
            })]);
            y.domain(colors.map(function (d) {
                return d.key;
            }));

            // append the Bars
            svg.selectAll(".bar")
                .data(colors)
                .enter().append("rect")
                .attr("class", "bar")
                .attr("width", function (d) {
                    return x(d.value);
                })
                .attr("y", function (d) {
                    return y(d.key) + (y.bandwidth()/4);
                })
                .attr("height", y.bandwidth() / 2);

            // append the x and y Axes
            svg.append("g")
                .attr("transform", "translate(0," + height + ")")
                .call(d3.axisBottom(x).tickSizeInner([-height]));

            svg.append("g")
                .call(d3.axisLeft(y));
            
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
            
            // append the Bars
            svg2.selectAll(".bar")
                .data(alphas)
                .enter().append("rect")
                .attr("class", "bar")
                .attr("width", function (d) {
                    return x(d.value);
                })
                .attr("y", function (d) {
                    return y(d.key) + (y.bandwidth()/4);
                })
                .attr("height", y.bandwidth() / 2);

            // append the x and y Axes
            svg2.append("g")
                .attr("transform", "translate(0," + height + ")")
                .call(d3.axisBottom(x).tickSizeInner([-height]));

            svg2.append("g")
                .call(d3.axisLeft(y));

        });

    }
}]);
