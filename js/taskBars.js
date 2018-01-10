app.factory('taskBars', [function () {
    return {
        //attach bars
        addBars: function (svg, data, x, y, barOffset, labelOffset, fill, start, end) {
            svg.selectAll(".chart")
                .data(data)
                .enter()
                .append("rect")
                .attr("fill", fill)
                .attr("rx", 5)
                .attr("ry", 5)
                .attr("y", 0)
                .attr("transform", function (d) {
                    return "translate(" + x(moment(d[start])) + "," + (y(d.person) + barOffset) + ")";
                })
                .attr("height", 45)
                .attr("width", function (d) {
                    return (x(moment(d[end])) - x(moment(d[start])));
                })
            //attach labels to the bars
            svg.selectAll(".chart")
                .data(data)
                .enter()
                .append("text")
                .attr("fill", "white")
                .attr("font-size", "13px")
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
