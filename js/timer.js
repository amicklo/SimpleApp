app.directive('timer', [function () {
    
    var w = 480,
        h = 100,
        padding = 50,
        barPad = 5,
        barW = 55,
        barH = 20,
        barsPerColumn = 4,
        barsPerRow = 8,
        numBars = barsPerColumn * barsPerRow;
        time = 0;
    
    var maskArray = [];
    for (var i = 0; i < numBars; i++){
        maskArray[i] = Math.pow(2, i);
    }
    
    var svg = d3.select("body")
        .append("svg")
        .attr("width", w)
        .attr("height", h + padding);
    
    var bars = [];
    for(var k = 0; k < barsPerRow; k++){
        for(var j = 0; j < barsPerColumn; j++){
            var bar = svg.append("rect")
                .attr("y", function(){
                    return (h - (j * barH + barH) - (j * barPad));
                })
                .attr("x", function(){
                    return (w - (k * barW + barW) - (k * barPad));
                })
                .attr("width", barW)
                .attr("height", barH)
                .attr("fill", "MidnightBlue");
            bars.push(bar);
        }
    }
    
    svg.append("text")
        .attr("x", w / 2)
        .attr("y", h + padding - 20)
        .text(time);
    
}]);
