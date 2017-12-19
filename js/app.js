var app = angular.module("myApp", []);

//factory for sorting values

app.factory('factory', function () {
    return {
        filter: function (dimension) {
            //initialize grouping
            var grouping = dimension.group();

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
            return grouping.reduce(reduceAdd, reduceRemove, reduceInitial).all();
        },
        addChart: function (margin, width, height) {
            // create an svg object with size based on the parameters
            var svg = d3.select("body").append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform",
                    "translate(" + margin.left + "," + margin.top + ")");
            return svg;
        },
        draw: function (svg, set1, set2, data, x, y, height, heightMod, chartPad) {
            x.domain([0, d3.max(set1.concat(set2), function (d) {
                return d.value + chartPad;
            })]);
            y.domain(set1.map(function (d) {
                return d.key;
            }));

            // append the x and y Axes
            svg.append("g")
                .attr("transform", "translate(0," + height + ")")
                .call(d3.axisBottom(x).ticks(5).tickSizeInner([-height]));

            svg.append("g")
                .style("font", "13px sans-serif")
                .call(d3.axisLeft(y));

            // append the Bars
            svg.selectAll(".bar")
                .data(set1)
                .enter().append("rect")
                .attr("class", "bar")
                .attr("y", function (d) {
                    return y(d.key) + (y.bandwidth() / heightMod);
                })
                .attr("height", y.bandwidth());

            svg.selectAll(".bar")
                .data(set1)
                .transition()
                .duration(1000)
                .attr("width", function (d) {
                    return x(d.value);
                });

            return svg;
        }
    }
});

app.factory('clickHandler', ['factory', function (factory) {
    return {
        clickFunc: function (set, dimension1, dimension2, x, svg, svg2, dObj) {
            //filter by selected bar
            dimension1 = dimension1.filter(dObj.key);
            var vals = factory.filter(dimension2); 
            //set deselected bars to be gray
            svg.selectAll(".bar")
                .data(set)
                .transition()
                .duration(1000)
                .attr("fill", "gray")
                .attr("width", function (d) {
                    return x(d.value);
                });
            //set bars in other chart to their new sizes
            svg2.selectAll(".bar")
                .transition()
                .duration(1000)
                .attr("width", function (d, i) {
                    return x(vals[i].value);
                })
                .attr("fill", "black");
        }
    }
}]);
