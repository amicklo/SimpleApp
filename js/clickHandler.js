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
        altFunc: function (set, names, dimensions, x, svg, svg2, dObj) {
            //filter by selected bar
            for (var i in dObj) {
                for (var j in names){
                    if (dObj[i].type == names[j]){
                        dimensions[j] = dimensions[j].filter(dObj[i].key.key);
                    }
                }
            }
            var vals;
            for (var i in names){
                if(svg2.attr("class") == names[i]){
                    vals = factory.memberFilter(dimensions[i]);
                }
            }
            //set deselected bars to be gray
            svg.selectAll(".bar")
                .data(set)
                .transition()
                .duration(1000)
                .attr("fill", "gray")
                //.attr("stroke", "none")
                .attr("width", function (d) {
                    return x(d.value);
                });

            //set bars in other chart to their new sizes
            svg2.selectAll(".bar")
                .transition()
                .duration(1000)
                //.attr("stroke", "none")
                .attr("width", function (d, i) {
                    return x(vals[i].value);
                })
                .attr("fill", "black");
        }
    }
}]);
