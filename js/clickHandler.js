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
        memberFunc: function (set, names, dimensions, x, svg, svg2, dObj, index, memberSets, fundSets, changingCat) {
            //filter by selected bar
            /*
            var allSets = memberSets[0];
            for (var i in memberSets) {
                allSets = allSets.concat(memberSets[i]);
            }
            
            x.domain([0, d3.max(allSets, function (d) {
                return d.value + 25;
            })]);
            */
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
                .attr("fill", "gray");
                //.attr("stroke", "none");
            /*
            .attr("width", function (d) {
                return x(d.value);
            });
            */
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
                    if (vals.length == 3 && i == 2) {
                        return;
                    }
                    return (d.key + "\nMembers: " + d.value + "\nFunds: " + fundSets[index][i].value);
                });
            if (!changingCat) {
                d3.select("#" + names[index])
                    .text(dObj[dObj.length - 1].key.key);
            }
        },
        fundFunc: function (set, names, dimensions, x, svg, svg2, dObj, index, memberSets, fundSets, changingCat) {
            //filter by selected bar
            /*
            var allSets = fundSets[0];
            for (var i in fundSets) {
                allSets = allSets.concat(fundSets[i]);
            }
            x.domain([0, d3.max(allSets, function (d) {
                return d.value + 250;
            })]);
            */

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
                    vals = factory.fundFilter(dimensions[i]);
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
                    if (vals.length == 3 && i == 2) {
                        return;
                    }
                    return (d.key + "\nMembers: " + memberSets[index][i].value + "\nFunds: " + d.value);
                });
            if (!changingCat) {
                d3.select("#" + names[index])
                    .text(dObj[dObj.length - 1].key.key);
            }
        },
        changeScale: function (param, x, fundSets, memberSets, height) {
            var allSets = memberSets[0];
            for (var i in memberSets) {
                allSets = allSets.concat(memberSets[i]);
            }
            if (param == "funds") {
                var allSets = fundSets[0];
                for (var i in fundSets) {
                    allSets = allSets.concat(fundSets[i]);
                }
                x.domain([0, d3.max(allSets, function (d) {
                    return d.value + 250;
                })]);
            }
            if (param == "members") {
                var allSets = memberSets[0];
                for (var i in memberSets) {
                    allSets = allSets.concat(memberSets[i]);
                }
                x.domain([0, d3.max(allSets, function (d) {
                    return d.value + 25;
                })]);
            }
            d3.selectAll(".x.axis")
                .transition()
                .duration(750)
                .call(d3.axisBottom(x).ticks(7).tickSizeInner([-height]));
            return x;
        }
    }
}]);
