app.factory('taskBars', [function () {
    return {
        /*--------------------------------------------------------------------------------------------*
         * Attach the labelled bars for the task times to the chart
         * parameters in the order they are used:
         * @svg         the svg element that will contain the bars (the chart so far)
         * @data        the dataset parsed fromt the JSON
         * @x           the x-axis scale function
         * @y           the y axis scale function
         * @barOffset   vertical amount to move the bar from the default calculated tow position
         * @labelOffset vertical amount to move the label so it ends up in the center of the bar
         * @fill        color that the bar will default to
         * @start       the start time of bar (planned or actual)
         * @end         the end time of bar (planned or actual)
         * @dayStart    the first hour of the day being represented
         * @dayEnd      the last hour of the day being represented
         *--------------------------------------------------------------------------------------------*/
        addBars: function (svg, data, x, y, barOffset, labelOffset, fill, start, end, dayStart, dayEnd) {
            //list colors to be used in actual time bars depending on the status of the task
            var colorIndex = {
                Complete: "#20AA20",
                Progress: "#0000CC",
                Overdue: "#DD0000"
            };
            //attach a bar for each task
            svg.selectAll(".chart")
                .append("g")
                .attr("id", "bars")
                .data(data)
                .enter()
                .append("rect")
                .attr("class", function (d) {
                    if (start == "startActual") {
                        return "actual";
                    }
                    return "plan";
                })
                .attr("id", function (d) {
                    return d.status;
                })
                .attr("start", start)
                .attr("end", end)
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
                        .attr("stroke", "yellow")
                        .attr("stroke-width", "2px");
                })
                .on("mouseout", function () {
                    d3.select(this)
                        .attr("stroke", "none");
                })
                .attr("height", 35)
                .attr("width", 0)
                //.style("opacity", 0)
                .transition()
                .duration(750)
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
                .attr("class", function (d) {
                    if (start == "startActual") {
                        return "actualLabel";
                    }
                    return "planLabel";
                })
                .attr("fill", "white")
                .attr("font-size", function (d) {
                    if ((moment(d[start]) < moment(dayStart)) || (moment(d[end]) > moment(dayEnd))) {
                        return "0px";
                    }
                    return "13px";
                })
                .attr("font-weight", "700")
                .attr("y", 0)
                .attr("transform", function (d) {
                    return "translate(" + (x(moment(d[start])) + 5) + "," + (y(d.person) + labelOffset) + ")";
                })
                //.style("opacity", 0)
                .text(function (d) {
                    return d.task;
                });
        },
        addButtons: function (svg, data, x) {

            d3.select("#comp")
                .on("click", function () {
                    //svg.selectAll()
                });

            d3.select("#prog")
                .on("click", function () {
                    //svg.selectAll()
                });

            d3.select("#over")
                .on("click", function () {
                    //svg.selectAll()
                });

            d3.select("#all")
                .on("click", function () {
                    svg.selectAll(".plan")
                        .data(data)
                        .transition()
                        .duration(750)
                        .style("opacity", 1.0);

                    svg.selectAll(".actual")
                        .data(data)
                        .transition()
                        .duration(750)
                        .style("opacity", 1.0);

                    svg.selectAll(".planLabel")
                        .data(data)
                        .transition()
                        .duration(750)
                        .style("opacity", 1.0);

                    svg.selectAll(".actualLabel")
                        .data(data)
                        .transition()
                        .duration(750)
                        .style("opacity", 1.0);
                });
        }
    }
}]);
