app.directive('drawClock', [function (factory, clickHandler, $rootScope, $scope) {
    console.log(moment().format("h:mm a"));
    var width = 250,
        height = 250,
        halfWidth = width / 2,
        halfHeight = height / 2;
    var svg = d3.select('body')
        .append('svg')
        .attr('width', width)
        .attr('height', height);
    var circle_count = 12;
    var big_radius = 110;
    var radius = 12;
    var angular_increment = 2.0 * Math.PI / circle_count;
    var jitterFunc = function () {
        var me = this;

        me.transition()
            .duration(100)
            .ease('in-out')
            .attr("cx", (Math.random() * 2.0 - 1.0))
            .attr("cy", (Math.random() * 2.0 - 1.0))
            .each("end", function () {
                jitterFunc.call(me);
            });
    }
    var animateSecondHand = function () {
        var currentSecond = new Date().getSeconds();
        var rotationAngle = currentSecond * 6;
        var me = this;
        me.transition()
            .duration(1000)
            .attr("transform", "rotate(" + rotationAngle + ")")
            .on("end", function () {
                animateSecondHand.call(me);
            });
    }
    var animateMinuteHand = function () {
        var currentMinute = new Date().getMinutes();
        var rotationAngle = currentMinute * 6;
        var me = this;
        me.transition()
            .duration(500)
            .attr("transform", "rotate(" + rotationAngle + ")")
            .on("end", function () {
                animateMinuteHand.call(me);
            });
    }
    var calculateHourAngle = function () {
        var currentDate = new Date();
        var currentHour = currentDate.getHours();
        var currentMinute = currentDate.getMinutes();
        return ((currentHour % 12) * 30) + Math.floor(currentMinute * 0.5);
    }
    var animateHourHand = function () {
        var rotationAngle = calculateHourAngle();
        var me = this;
        me.transition()
            .duration(500)
            .attr("transform", "rotate(" + rotationAngle + ")")
            .on("end", function () {
                animateHourHand.call(me);
            });
    }
    // let's draw 12 circles around a circle
    for (var i = 0; i < circle_count; i += 1) {
        var center_x = halfWidth + big_radius * Math.cos((i * angular_increment) - (Math.PI * 0.5));
        var center_y = halfHeight + big_radius * Math.sin((i * angular_increment) - (Math.PI * 0.5));
        var group = svg.append("g")
            .attr("transform", "translate(" + center_x + ", " + center_y + ")");
        /*
        var circle = group.append("circle")
            .attr("r", radius);
        */
        var text = group.append("text")
            .attr("class", "center-text")
            .text(i == 0 ? 12 : i);
    }
    var hourHand = svg.append("g")
        .attr("transform", "translate(" + halfWidth + ", " + halfHeight + ")")
        .append("path")
        .attr("d", "M 0 -80 L 3 0 L -3 0 L 0 -80")
        .attr("transform", "rotate(" + calculateHourAngle() + ")")
        .attr("class", "hour");
    animateHourHand.call(hourHand);
    var minuteHand = svg.append("g")
        .attr("transform", "translate(" + halfWidth + ", " + halfHeight + ")")
        .append("path")
        .attr("d", "M 0 -100 L 3 0 L -3 0 L 0 -100")
        .attr("class", "minute");
    animateMinuteHand.call(minuteHand);
    var secondHand = svg.append("g")
        .attr("transform", "translate(" + halfWidth + ", " + halfHeight + ")")
        .append("path")
        .attr("d", "M 0 -110 L 3 0 L -3 0 L 0 -110")
        .attr("class", "second");
    animateSecondHand.call(secondHand);
    svg.append("g")
        .attr("transform", "translate(" + halfWidth + ", " + halfHeight + ")")
        .append("circle")
        .attr("r", 4)
        .attr("class", "knob");
}]);
