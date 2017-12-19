app.directive('fourBars', ['factory', 'clickHandler', function (factory, clickHandler, factoryColor) {
    d3.json('data/dataFourCat.json', function(error, data){
        if (error) throw error;
        //extract data
        data = data.data;
        //initialize variables
        var cf = crossfilter(data);
        var dimension;
        var set;
        var holder;
        var vals = [];
        // initializes the array of desired data from the filter
        function initFilter() {
            cf = crossfilter(data);
            dimension = cf.dimension(function (d) {
                return d.color; //TODO pass a parameter and return d[param]
            });

            //extract arrays of grouped data
            set = factory.memberFilter(dimension);
        }
        initFilter();
        
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
        
        /* ------- DRAW CHART BELOW THIS LINE ------- */
        
        d3.select("body").append("h1").html("top text");
        var svg = factory.addChart(margin, width, height);

        // draw the charts
        svg = factory.draw(svg, set, vals, data, x, y, height, heightMod, chartPad);
        
        /* ------ INTERACTIVITY BELOW THIS LINE ----- */
    });
}]);
