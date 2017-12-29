app.factory('factory', [function () {
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
        memberFilter: function (dimension) {
            //initialize grouping
            var grouping = dimension.group();

            //initialize reduce functions
            function reduceAdd(p, v) {
                return p + v.members;
            }

            function reduceRemove(p, v) {
                return p - v.members;
            }

            function reduceInitial() {
                return 0;
            }

            //reduce groupings
            return grouping.reduce(reduceAdd, reduceRemove, reduceInitial).all();
        },
        fundFilter: function (dimension) {
            //initialize grouping
            var grouping = dimension.group();

            //initialize reduce functions
            function reduceAdd(p, v) {
                return p + v.funds;
            }

            function reduceRemove(p, v) {
                return p - v.funds;
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
                .attr("height", y.bandwidth() / heightMod);

            svg.selectAll(".bar")
                .data(set1)
                .transition()
                .duration(1000)
                .attr("width", function (d) {
                    return x(d.value);
                });

            return svg;
        },
        drawWithTags: function (svg, currSet, memberSets, fundSets, data, x, y, width, height, heightMod, chartPad, tag, name) {
            var allSets = memberSets[0];
            for (var i in memberSets) {
                allSets = allSets.concat(memberSets[i]);
            }
            x.domain([0, d3.max(allSets, function (d) {
                return d.value + chartPad;
            })]);
            y.domain(currSet.map(function (d) {
                return d.key;
            }));

            // append the x and y Axes
            svg.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + height + ")")
                .call(d3.axisBottom(x).ticks(7).tickSizeInner([-height]));

            svg.append("g")
                .style("font", "13px sans-serif")
                .call(d3.axisLeft(y));

            // append the Bars
            svg.selectAll(".bar")
                .data(currSet)
                .enter().append("rect")
                .attr("class", "bar")
                .attr("tag", tag)
                .attr("y", function (d) {
                    return y(d.key) + (y.bandwidth() / heightMod);
                })
                .attr("height", y.bandwidth() / heightMod)
                .append("title")
                .text(function (d, i) {
                    return (d.key + "\nMembers: " + d.value + "\nFunds: " + fundSets[tag][i].value);
                });

            svg.selectAll(".bar")
                .data(currSet)
                .transition()
                .duration(1000)
                .attr("width", function (d) {
                    return x(d.value);
                });

            name = name.charAt(0).toUpperCase() + name.substring(1, name.length);
            svg.append("text")
                .attr("x", (width / 2))
                .attr("y", (height + 25))
                .attr("text-anchor", "middle")
                .style("font-size", "16px")
                .text(name);

            return svg;
        },
        /*
         * This will pull the categories of data out of the first object in the data array
         */
        extractNames: function (data) {
            var val;
            var names = [];
            var s;
            var x = JSON.stringify(data[0]);
            while (s != "members") {
                val = x.search("\"");
                x = x.substring(val + 1, x.length);
                val = x.search("\"");
                s = x.substring(0, val);
                if (s == "members") {
                    break;
                }
                names.push(s);
                val = x.search(",");
                x = x.substring(val + 1, x.length);
            }
            return names;
        }
    }
}]);
