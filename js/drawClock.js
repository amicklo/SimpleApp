app.directive('drawClock', [function ($scope, $rootScope) {

    return {
        restrict: 'E',
        scope: {
            param: '@',
            index: '='
        },
        controller: function ($scope, $rootScope) {
                var width = 320,
                height = 320,
                halfWidth = width / 2,
                halfHeight = height / 2,
                padding = 75;
            var svg = d3.select('body')
                .append('svg')
                .attr('width', width + padding)
                .attr('height', height + padding);
            var num_count = 12;
            var num_offset = 4;
            var big_radius = 150;
            var angular_increment = 2.0 * Math.PI / num_count;
            var timeOffset = 50;
            var labelOffset = 30;
            //recursively move the second hand
            var animateSecondHand = function () {
                var currentSecond = moment().tz($scope.param).seconds();
                var rotationAngle = currentSecond * 6;
                var me = this;
                me.transition()
                    .duration(1000)
                    .attr("transform", "rotate(" + rotationAngle + ")")
                    .on("end", function () {
                        animateSecondHand.call(me);
                    });
            }
            //recursively move the minute hand
            var animateMinuteHand = function () {
                var currentMinute = moment().tz($scope.param).minutes();
                var rotationAngle = currentMinute * 6;
                var me = this;
                me.transition()
                    .duration(500)
                    .attr("transform", "rotate(" + rotationAngle + ")")
                    .on("end", function () {
                        animateMinuteHand.call(me);
                    });
            }
            //function for calculating the position of the hour hand more precisely
            var calculateHourAngle = function () {
                var currentDate = moment().tz($scope.param);
                var currentHour = currentDate.hours();
                var currentMinute = currentDate.minutes();
                return ((currentHour % 12) * 30) + Math.floor(currentMinute * 0.5);
            }
            //recursively move the hour hand
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
            //recursively updates the label beneath each clock
            var animateLabel = function () {
                var me = this;
                me.transition()
                    .duration(50)
                    .text(moment().tz($scope.param).format($rootScope.timeFormat))
                    .on("end", function () {
                        animateLabel.call(me);
                    });
            }
            //the next two appends draw the circles that comprise the clock's face
            svg.append("circle")
                .attr("cx", halfWidth)
                .attr("cy", halfHeight)
                .attr("r", big_radius)
                .style("fill", "rgb(245, 245, 250)")
                .style("stroke-width", "6px")
                .style("stroke", "white");
            
            svg.append("circle")
                .attr("cx", halfWidth)
                .attr("cy", halfHeight)
                .attr("r", big_radius + 3)
                .style("fill", "none")
                .style("stroke-width", "1px")
                .style("stroke", "black");
            //draw 12 ticks around the clock's face
            for (var i = 0; i < num_count; i += 1) {
                var center_x = halfWidth + big_radius * Math.cos((i * angular_increment) - (Math.PI * 0.5));
                var center_y = halfHeight + big_radius * Math.sin((i * angular_increment) - (Math.PI * 0.5));
                var group = svg.append("g")
                    .attr("transform", "translate(" + (center_x) + ", " + (center_y) + ")");
                
                var tick = group.append("rect")
                    .attr("height", "8")
                    .attr("width", "1")
                    .attr("transform", "rotate(" + 30 * i + ")");
            }
            //append and start animation loop for hour hand
            var hourHand = svg.append("g")
                .attr("transform", "translate(" + halfWidth + ", " + halfHeight + ")")
                .append("path")
                .attr("d", "M 0 -80 L 3 0 L -3 0 L 0 -80")
                .attr("transform", "rotate(" + calculateHourAngle() + ")")
                .attr("class", "hour")
                .style("fill", "black");
            animateHourHand.call(hourHand);
            //append and start animation loop for minute hand
            var minuteHand = svg.append("g")
                .attr("transform", "translate(" + halfWidth + ", " + halfHeight + ")")
                .append("path")
                .attr("d", "M 0 -100 L 3 0 L -3 0 L 0 -100")
                .attr("class", "minute")
                .style("fill", "white")
                .style("stroke-width", "1px")
                .style("stroke", "black");
            animateMinuteHand.call(minuteHand);
            //append and start animation loop for second hand
            var secondHand = svg.append("g")
                .attr("transform", "translate(" + halfWidth + ", " + halfHeight + ")")
                .append("path")
                .attr("d", "M 0 -110 L 3 0 L -3 0 L 0 -110")
                .attr("class", "second")
                .style("fill", "red")
                .style("stroke", "black");
            animateSecondHand.call(secondHand);
            //place a circle over the center of the clock so the triangles look nicer
            svg.append("g")
                .attr("transform", "translate(" + halfWidth + ", " + halfHeight + ")")
                .append("circle")
                .attr("r", 4)
                .attr("class", "knob");
            //extract the place from the time zone identifier 
            var point = $scope.param.search("/") + 1;
            var name = $scope.param.substring(point, $scope.param.length);
            //attach the place name to the label
            svg.append("text")
                .attr("x", (halfWidth))
                .attr("y", (height + labelOffset))
                .attr("text-anchor", "middle")
                .style("font-size", "16px")
                .style("font-weight", "700")
                .text(name);
            //attach the time label and start the update loop
            var label = svg.append("text")
                .attr("x", (halfWidth))
                .attr("y", (height + timeOffset))
                .attr("text-anchor", "middle")
                .attr("id", "label")
                .style("font-size", "16px")
                .text(moment().tz($scope.param).format($rootScope.timeFormat));
            animateLabel.call(label);
        }
    }
}]);
