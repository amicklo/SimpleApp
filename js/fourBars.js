app.directive('fourBars', ['factory', 'clickHandler', function (factory, clickHandler, factoryColor) {

    return {
        restrict: 'E',
        scope: {
            param: '@',
            names: '=',
            index: '='
        },
        controller: function ($scope) {
            d3.json('data/dataFourCat.json', function (error, data) {
                if (error) throw error;
                //extract data
                data = data.data;
                //initialize variables
                var names = ["color","letter","shape","country"];
                var cf = crossfilter(data);
                var dimension;
                var set;
                var holder;
                var vals = [];
                //sets for determining chart scaling in factory
                var colorSet;
                var letterSet;
                var shapeSet;
                var countrySet;
                
                // initializes the array of desired data from the filter
                function initFilter(attrib) {
                    cf = crossfilter(data);
                    dimension = cf.dimension(function (d) {
                        return d[attrib];
                    });

                    //extract arrays of grouped data
                    return set = factory.memberFilter(dimension);
                }
                
                colorSet = initFilter("color");
                letterSet = initFilter("letter");
                shapeSet = initFilter("shape");
                countrySet = initFilter("country");

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

                initFilter($scope.param);
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
                        for (i in names) {
                            if (i != d3.select(this).attr("tag")) {
                                svg2 = d3.select("." + names[i]);
                                dimension2 = cf.dimension(function (p) {
                                    return p[names[i]];
                                });
                                holder = d;
                                clickHandler.altFunc(set, dimension, dimension2, x, svg, svg2, holder);
                                initFilter($scope.param);
                            }
                        }

                        d3.select(this)
                            .transition()
                            .duration(1000)
                            .attr("fill", "black")
                            .attr("width", function (d) {
                                return x(d.value);
                            });
                    });

            });
        }
    }
}]);
