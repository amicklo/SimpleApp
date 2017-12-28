app.directive('fourBars', ['factory', 'clickHandler', '$rootScope', function (factory, clickHandler, $rootScope, $scope) {

    return {
        restrict: 'E',
        scope: {
            param: '@',
            names: '=',
            index: '='
        },
        controller: function ($rootScope, $scope) {
            d3.select("#reset")
                .on("click", function () {
                    location.reload(true);
                });
            d3.json('data/dataFourCat.json', function (error, data) {
                if (error) throw error;
                //extract data
                if ($rootScope.dims == null) {
                    $rootScope.dims = [];
                }
                data = data.data;
                //initialize variables
                var names = factory.extractNames(data); //["color", "letter", "shape", "country"]
                var cf = crossfilter(data);
                var holder;
                var dimensions = [];
                var memberSets = [];
                var fundSets = [];

                // resets the dimensions
                function initFilter() {
                    cf = crossfilter(data);
                    for (var i in names) {
                        dimensions.push(cf.dimension(function (d) {
                            return d[names[i]];
                        }));
                    }
                }
                initFilter();
                for (var i in dimensions) {
                    memberSets.push(factory.memberFilter(dimensions[i]));
                }
                for (var i in dimensions) {
                    fundSets.push(factory.fundFilter(dimensions[i]));
                }
                //initialize chart style variables
                var chartPad = 25;
                var margin = {
                        top: 20,
                        right: 20,
                        bottom: 40,
                        left: 75
                    },
                    width = 625 - margin.left - margin.right,
                    height = 400 - margin.top - margin.bottom;
                // set the ranges
                var y = d3.scaleBand()
                    .range([height, 0])
                    .padding(0.1);
                var x = d3.scaleLinear()
                    .range([0, width]);
                var heightMod = 3;

                /* ------- DRAW CHART BELOW THIS LINE ------- */

                //d3.select("body").append("h1").html($scope.param);
                var svg = factory.addChart(margin, width, height);
                svg.attr('class', $scope.param);

                // draw the charts
                svg = factory.drawWithTags(svg, memberSets[$scope.index], memberSets, fundSets, data, x, y, width, height, heightMod, chartPad, $scope.index, names[$scope.index]);

                /* ------ INTERACTIVITY BELOW THIS LINE ----- */

                var svg2;
                var dimension2;
                svg.selectAll(".bar")
                    .data(memberSets[$scope.index])
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
                                    clickHandler.memberFunc(memberSets[$scope.index], names, dimensions, x, svg, svg2, $rootScope.dims, $scope.index);
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
