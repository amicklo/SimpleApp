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
        memberFunc: function (set, names, dimensions, x, svg, svg2, dObj, index, memberSets, fundSets) {
            //filter by selected bar
            for (var i in dObj) {
                for (var j in names) {
                    if (dObj[i].type == names[j]) {
                        dimensions[j] = dimensions[j].filter(dObj[i].key.key);
                    }
                }
            }
            var vals;
            for (var i in names) {
                if (svg2.attr("class") == names[i]) {
                    vals = factory.memberFilter(dimensions[i]);
                }
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
                .data(vals)
                .transition()
                .duration(1000)
                //.attr("stroke", "none")
                .attr("width", function (d, i) {
                    return x(vals[i].value);
                })
                .attr("fill", "black")
                .select("title")
                .text(function (d, i) {
                    if(index == 3 && i == 2){
                        return;
                    }
                    return (d.key + "\nMembers: " + d.value + "\nFunds: " + fundSets[index][i].value);
                });

            d3.select("#" + names[index])
                .text(dObj[dObj.length - 1].key.key);
        },
        changeScale: function (param, x, fundSets, memberSets, chartPad, height) {
            if (param == "funds") {
                x.domain([0, d3.max(fundSets[3], function (d) {
                    return d.value + chartPad;
                })]);
            }
            if (param == "members") {
                x.domain([0, d3.max(memberSets[3], function (d) {
                    return d.value + chartPad;
                })]);
            }
            d3.selectAll(".x.axis")
                .transition()
                .duration(500)
                .call(d3.axisBottom(x).ticks(7).tickSizeInner([-height]));

        }
    }
}]);
