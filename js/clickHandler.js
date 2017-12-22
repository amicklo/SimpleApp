app.factory('clickHandler', ['factory', function (factory) {
    return {
        clickFunc: function (set, dimension1, dimension2, x, svg, svg2, dObj) {
            //filter by selected bar
            dimension1 = dimension1.filter(dObj.key);
            var vals = factory.filter(dimension2);

            //set bars in other chart to their new sizes
            svg2.selectAll(".bar")
                .transition()
                .duration(1000)
                .attr("width", function (d, i) {
                    return x(vals[i].value);
                })
                .attr("fill", "black");
            //set deselected bars to be gray
            svg.selectAll(".bar")
                .data(set)
                .transition()
                .duration(1000)
                .attr("fill", "gray")
                .attr("width", function (d) {
                    return x(d.value);
                });
        },
        altFunc: function (set, colorDimension, letterDimension, shapeDimension, countryDimension, x, svg, svg2, dObj, dims) {
            //filter by selected bar
            for (var i in dims) {
                if (dims[i] == "color") {
                    colorDimension = colorDimension.filter(dObj.key);
                }
                if (dims[i] == "letter") {
                    letterDimension = letterDimension.filter(dObj.key);
                }
                if (dims[i] == "shape") {
                    shapeDimension = shapeDimension.filter(dObj.key);
                }
                if (dims[i] == "country") {
                    countryDimension = countryDimension.filter(dObj.key);
                }
            }
            var vals;
            if (svg2.attr("class") == "color") {
                vals = factory.memberFilter(colorDimension);
            }
            if (svg2.attr("class") == "letter") {
                vals = factory.memberFilter(letterDimension);
            }
            if (svg2.attr("class") == "shape") {
                vals = factory.memberFilter(shapeDimension);
            }
            if (svg2.attr("class") == "country") {
                vals = factory.memberFilter(countryDimension);
            }

            //set deselected bars to be gray
            svg.selectAll(".bar")
                .data(set)
                .transition()
                .duration(1000)
                .attr("fill", "gray")
                .attr("stroke", "none")
                .attr("width", function (d) {
                    return x(d.value);
                });

            //set bars in other chart to their new sizes
            svg2.selectAll(".bar")
                .transition()
                .duration(1000)
                .attr("stroke", "none")
                .attr("width", function (d, i) {
                    return x(vals[i].value);
                })
                .attr("fill", "black");
        }
    }
}]);
