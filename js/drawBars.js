app.directive('drawBars', ['factory', 'clickHandler', function (factory, clickHandler, factoryColor) {

    //parse json for bar charts
    d3.json("data/dataCat.json", function (error, data) {
        if (error) throw error;
        //extract data
        data = data.data;

        //initialize variables
        var cf = crossfilter(data);
        var alphaDimension;
        var colorDimension;
        var colors;
        var alphas;
        var holder;
        var vals = [];
        //initialize filters
        function initFilters() {
            cf = crossfilter(data);
            colorDimension = cf.dimension(function (d) {
                return d.category1;
            });

            alphaDimension = cf.dimension(function (d) {
                return d.category2;
            });

            //extract arrays of grouped data
            colors = factory.filter(colorDimension);
            alphas = factory.filter(alphaDimension);
        }

        initFilters();
        //initialize chart style variables
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
        //sort the data alphabetically
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

        // append the svg objects to the body of the page
        var svg1 = factory.addChart(margin, width, height);
        d3.select("body").append("h1").html("Alphabet");
        var svg2 = factory.addChart(margin, width, height);

        // draw the charts
        svg1 = factory.draw(svg1, colors, alphas, data, x, y, height, heightMod, chartPad); //color chart
        svg2 = factory.draw(svg2, alphas, colors, data, x, y, height, heightMod, chartPad); //alpha chart

        // animate the initial sizes of the bars
        svg1.selectAll(".bar")
            .data(colors)
            .transition()
            .duration(1000)
            .attr("width", function (d) {
                return x(d.value);
            });

        svg2.selectAll(".bar")
            .data(alphas)
            .transition()
            .duration(1000)
            .attr("width", function (d) {
                return x(d.value);
            });

        //assign click functions
        svg1.selectAll(".bar")
            .data(colors)
            .on("click", function (d) {
                holder = d;
                // adjust the bars based on which bar is clicked
                clickHandler.clickFunc(colors, colorDimension, alphaDimension, x, svg1, svg2, holder);
                // set the bar that was clicked to be black
                d3.select(this)
                    .transition()
                    .duration(1000)
                    .attr("fill", "black")
                    .attr("width", function (d) {
                        return x(d.value);
                    });
                initFilters();
            });

        svg2.selectAll(".bar")
            .data(alphas)
            .on("click", function (d) {
                holder = d;
                clickHandler.clickFunc(alphas, alphaDimension, colorDimension, x, svg2, svg1, holder);
                d3.select(this)
                    .transition()
                    .duration(1000)
                    .attr("fill", "black")
                    .attr("width", function (d) {
                        return x(d.value);
                    });
                initFilters();
            });

    });
}]);
