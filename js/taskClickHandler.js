app.factory('taskClickHandler', function () {
    return {
        barDisplay: function (svg, data, type, status, all) {
            svg.selectAll(type)
                .data(data)
                .transition()
                .ease(d3.easeQuadInOut)
                .duration(450)
                .style("opacity", function (d) {
                    if (d.status == status || all == true) {
                        return 1.0;
                    }
                    return 0;
                });
        }
    }
});
