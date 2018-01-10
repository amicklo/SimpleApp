app.factory('taskBars', [function () {
    return {
        //attach bars
        addBars: function (svg, data, x, y, barOffset, labelOffset, fill, start, end) {

            var colorIndex = {
                Complete: "#20AA20",
                Progress: "#0000CC",
                Overdue: "#DD0000"
            };

            svg.selectAll(".chart")
                .append("g")
                .attr("id", "bars")
                .data(data)
                .enter()
                .append("rect")
                .attr("fill", function (d) {
                    if (start == "startActual") {
                        return colorIndex[d.status];
                    }
                    return fill;
                })
                .attr("rx", 5)
                .attr("ry", 5)
                .attr("y", 0)
                .attr("transform", function (d) {
                    return "translate(" + x(moment(d[start])) + "," + (y(d.person) + barOffset) + ")";
                })
                .on("mouseover", function () {
                    d3.select(this)
                        .attr("stroke", "yellow");
                })
                .on("mouseout", function () {
                    d3.select(this)
                        .attr("stroke", "none");
                })
                .attr("height", 35)
                .attr("width", function (d) {
                    return (x(moment(d[end])) - x(moment(d[start])));
                });
            //attach labels to the bars
            svg.selectAll(".chart")
                .append("g")
                .attr("id", "labels")
                .data(data)
                .enter()
                .append("text")
                .attr("fill", "white")
                .attr("font-size", "13px")
                .attr("font-weight", "600")
                .attr("y", 0)
                .attr("transform", function (d) {
                    return "translate(" + (x(moment(d[start])) + 5) + "," + (y(d.person) + labelOffset) + ")";
                })
                .text(function (d) {
                    return d.task;
                });
        }
    }
}]);
