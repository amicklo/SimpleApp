app.directive('drawBars', ['factory', function (factory, factoryColor) {

    //parse json for bar charts
    d3.json("data/dataCat.json", function (error, data) {
        if (error) throw error;
        //extract data
        data = data.data;

        //initialize filter of data
        var cf = crossfilter(data);

        function compare(a, b) {
            if (a.category1 < b.category1) {
                return -1;
            }
            if (a.category1 > b.category1) {
                return 1;
            }
            return 0;
        }

        data.sort(compare);

        //initialize dimensions
        var colorDimension = cf.dimension(function (d) {
            return d.category1;
        });

        var alphaDimension = cf.dimension(function (d) {
            return d.category2;
        });

        //extract arrays of grouped data
        var colors = factory.filter(colorDimension);
        var alphas = factory.filter(alphaDimension);

        var chartPad = 25;

        var margin = {
                top: 20,
                right: 20,
                bottom: 30,
                left: 75
            },
            width = 960 - margin.left - margin.right,
            height = 500 - margin.top - margin.bottom;

        // set the ranges
        var y = d3.scaleBand()
            .range([height, 0])
            .padding(0.1);

        var x = d3.scaleLinear()
            .range([0, width]);

        var heightMod = 3;

        // append the svg object to the body of the page
        // append a 'group' element to 'svg'
        // moves the 'group' element to the top left margin

        var svg = factory.addChart(margin, width, height);
        d3.select("body").append("h1").html("Alphabet");
        var svg2 = factory.addChart(margin, width, height);

        svg = factory.draw(svg, colors, alphas, data, x, y, height, height, heightMod, chartPad);
        svg2 = factory.draw(svg2, alphas, colors, data, x, y, height, height, heightMod, chartPad);

        svg.selectAll(".bar")
            .data(colors)
            .on("click", function (d) {
                var vals = [];
                for (var i = 0; i < data.length; i++) {
                    if (data[i].category1 == d.key) {
                        vals.push(data[i].value);
                    }
                }
                svg.selectAll(".bar")
                    .data(colors)
                    .transition()
                    .duration(1000)
                    .attr("fill", "gray")
                    .attr("width", function (d) {
                        return x(d.value);
                    });
                d3.select(this)
                    .transition()
                    .duration(1000)
                    .attr("fill", "black")
                    .attr("width", function (d) {
                        return x(d.value);
                    });
                svg2.selectAll(".bar")
                    .transition()
                    .duration(1000)
                    .attr("width", function (d, i) {
                        return x(vals[i]);
                    })
                    .attr("fill", "black");
            });

        svg.selectAll(".bar")
            .data(colors)
            .transition()
            .duration(1000)
            .attr("width", function (d) {
                return x(d.value);
            });

        // append the Bars
        svg2.selectAll(".bar")
            .data(alphas)
            .on("click", function (d) {
                var vals = [];
                for (var i = 0; i < data.length; i++) {
                    if (data[i].category2 == d.key) {
                        vals.push(data[i].value);
                    }
                }
                //fill the bars with gray
                svg2.selectAll(".bar")
                    .data(alphas)
                    .transition()
                    .duration(1000)
                    .attr("fill", "gray")
                    .attr("width", function (d) {
                        return x(d.value);
                    });
                //fill the selected bar with black and make sure the bars are at their full values
                d3.select(this)
                    .transition()
                    .duration(1000)
                    .attr("fill", "black")
                    .attr("width", function (d) {
                        return x(d.value);
                    });
                //set the bars at their filtered sizes, fill them with black
                svg.selectAll(".bar")
                    .transition()
                    .duration(1000)
                    .attr("width", function (d, i) {
                        return x(vals[i]);
                    })
                    .attr("fill", "black");
            });

        svg2.selectAll(".bar")
            .data(alphas)
            .transition()
            .duration(1000)
            .attr("width", function (d) {
                return x(d.value);
            });

    });

}]);
