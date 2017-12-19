app.directive('drawBars', ['factory', 'clickHandler', function (factory, clickHandler, factoryColor) {

    //parse json for bar charts
    d3.json("data/dataCat.json", function (error, data) {
        if (error) throw error;
        //extract data
        data = data.data;

        //initialize filter of data
        var cf = crossfilter(data);
        var alphaDimension;
        var colorDimension;
        var colors;
        var alphas;
        var holder;

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

        var vals = [];
        
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

        // append the svg object to the body of the page
        // append a 'group' element to 'svg'
        // moves the 'group' element to the top left margin

        var svg = factory.addChart(margin, width, height);
        d3.select("body").append("h1").html("Alphabet");
        var svg2 = factory.addChart(margin, width, height);

        svg = factory.draw(svg, colors, alphas, data, x, y, height, height, heightMod, chartPad);
        svg2 = factory.draw(svg2, alphas, colors, data, x, y, height, height, heightMod, chartPad);

        //svg = clickHandler.clickFunc(colors, colorDimension, alphaDimension, x, svg, svg2);

        svg.selectAll(".bar")
            .data(colors)
            .on("click", function (d) {
                holder = d;
                clickHandler.clickFunc(colors, colorDimension, alphaDimension, x, svg, svg2, holder);
                d3.select(this)
                    .transition()
                    .duration(1000)
                    .attr("fill", "black")
                    .attr("width", function (d) {
                        return x(d.value);
                    });
                initFilters();
            });

        svg.selectAll(".bar")
            .data(colors)
            .transition()
            .duration(1000)
            .attr("width", function (d) {
                return x(d.value);
            });

        svg2.selectAll(".bar")
            .data(alphas)
            .on("click", function (d) {
                holder = d;
                clickHandler.clickFunc(alphas, alphaDimension, colorDimension, x, svg2, svg, holder);
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
            .transition()
            .duration(1000)
            .attr("width", function (d) {
                return x(d.value);
            });

    });

}]);
