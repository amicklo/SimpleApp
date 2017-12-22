app.directive('fourBars', ['factory', 'clickHandler', '$rootScope', function (factory, clickHandler, $rootScope, $scope) {

    return {
        restrict: 'E',
        scope: {
            param: '@',
            names: '=',
            index: '='
        },
        controller: function ($rootScope, $scope) {
            d3.json('data/dataFourCat.json', function (error, data) {
                if (error) throw error;
                //extract data
                if ($rootScope.dims == null) {
                    $rootScope.dims = [];
                }
                data = data.data;
                //initialize variables
                var names = ["color", "letter", "shape", "country"];
                var cf = crossfilter(data);
                var colorDimension;
                var letterDimension;
                var shapeDimension;
                var countryDimension;
                var set;
                var holder;
                //sets for determining chart scaling in factory
                var colorSet;
                var letterSet;
                var shapeSet;
                var countrySet;

                // resets the dimensions
                function initFilter() {
                    cf = crossfilter(data);
                    colorDimension = cf.dimension(function (d) {
                        return d[names[0]];
                    });

                    letterDimension = cf.dimension(function (d) {
                        return d[names[1]];
                    });

                    shapeDimension = cf.dimension(function (d) {
                        return d[names[2]];
                    });

                    countryDimension = cf.dimension(function (d) {
                        return d[names[3]];
                    });
                }
                initFilter();
                colorSet = factory.memberFilter(colorDimension);
                letterSet = factory.memberFilter(letterDimension);
                shapeSet = factory.memberFilter(shapeDimension);
                countrySet = factory.memberFilter(countryDimension);

                if ($scope.param == names[0]) {
                    set = colorSet;
                }
                if ($scope.param == names[1]) {
                    set = letterSet;
                }
                if ($scope.param == names[2]) {
                    set = shapeSet;
                }
                if ($scope.param == names[3]) {
                    set = countrySet;
                }

                //initialize chart style variables
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
                var heightMod = 3;

                /* ------- DRAW CHART BELOW THIS LINE ------- */

                d3.select("body").append("h1").html($scope.param);
                var svg = factory.addChart(margin, width, height);
                svg.attr('class', $scope.param);

                // draw the charts
                svg = factory.drawWithTags(svg, set, colorSet, letterSet, shapeSet, countrySet, data, x, y, height, heightMod, chartPad, $scope.index);

                /* ------ INTERACTIVITY BELOW THIS LINE ----- */

                var svg2;
                var dimension2;
                svg.selectAll(".bar")
                    .data(set)
                    .on("click", function (d) {
                        holder = {
                            "type": svg.attr("class"),
                            "key": d
                        };
                        $rootScope.dims.push(holder);
                        if ($rootScope.dims.length <= 4) {
                            for (var i in names) {
                                if (i != d3.select(this).attr("tag")) {
                                    svg2 = d3.select("." + names[i]);
                                    clickHandler.altFunc(set, colorDimension, letterDimension, shapeDimension, countryDimension, x, svg, svg2, $rootScope.dims);
                                    //initFilter($scope.param);
                                }
                            }

                            d3.select(this)
                                .transition()
                                .duration(1000)
                                .attr("fill", "black")
                                .attr("stroke", "yellow")
                                .attr("width", function (d) {
                                    return x(d.value);
                                });
                        } else {
                            alert("can't do more than four values");
                        }
                    });

            });
        }
    }
}]);
