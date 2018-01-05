app.directive('drawClock', [function ($scope, $rootScope) {

    return {
        restrict: 'E',
        scope: {
            param: '@',
            index: '='
        },
        controller: function ($scope, $rootScope) {
            //console.log(moment().tz($scope.param).format($rootScope.timeFormat));
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
            //var radius = 15;
            var angular_increment = 2.0 * Math.PI / num_count;
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
            var calculateHourAngle = function () {
                var currentDate = moment().tz($scope.param);
                var currentHour = currentDate.hours();
                var currentMinute = currentDate.minutes();
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
            var animateLabel = function () {
                var me = this;
                me.transition()
                    .duration(500)
                    .text(moment().tz($scope.param).format($rootScope.timeFormat))
                    .on("end", function () {
                        animateLabel.call(me);
                    });
            }

            svg.append("circle")
                .attr("cx", halfWidth)
                .attr("cy", halfHeight)
                .attr("r", big_radius)
                .style("fill", "azure")
                .style("stroke-width", "6px")
                .style("stroke", "white");
            /* let's draw 12 circles around a circle
            for (var i = 0; i < num_count; i += 1) {
                var center_x = halfWidth + big_radius * Math.cos((i * angular_increment) - (Math.PI * 0.5));
                var center_y = halfHeight + big_radius * Math.sin((i * angular_increment) - (Math.PI * 0.5));
                var group = svg.append("g")
                    .attr("transform", "translate(" + (center_x - num_offset) + ", " + (center_y + num_offset) + ")");
                //var circle = group.append("circle")
                //    .attr("r", radius);
                var text = group.append("text")
                    .style("font-weight", "600")
                    .style("font-family", "monospace")
                    .style("font-size", "13px")
                    .text(i == 0 ? 12 : i);
            }
            */
            var hourHand = svg.append("g")
                .attr("transform", "translate(" + halfWidth + ", " + halfHeight + ")")
                .append("path")
                .attr("d", "M 0 -80 L 3 0 L -3 0 L 0 -80")
                .attr("transform", "rotate(" + calculateHourAngle() + ")")
                .attr("class", "hour")
                .style("fill", "black");
            animateHourHand.call(hourHand);
            var minuteHand = svg.append("g")
                .attr("transform", "translate(" + halfWidth + ", " + halfHeight + ")")
                .append("path")
                .attr("d", "M 0 -100 L 3 0 L -3 0 L 0 -100")
                .attr("class", "minute")
                .style("fill", "white")
                .style("stroke-width", "1px")
                .style("stroke", "black");
            animateMinuteHand.call(minuteHand);
            var secondHand = svg.append("g")
                .attr("transform", "translate(" + halfWidth + ", " + halfHeight + ")")
                .append("path")
                .attr("d", "M 0 -110 L 3 0 L -3 0 L 0 -110")
                .attr("class", "second")
                .style("fill", "red");
            animateSecondHand.call(secondHand);
            svg.append("g")
                .attr("transform", "translate(" + halfWidth + ", " + halfHeight + ")")
                .append("circle")
                .attr("r", 4)
                .attr("class", "knob");

            var point = $scope.param.search("/") + 1;
            var name = $scope.param.substring(point, $scope.param.length);
            svg.append("text")
                .attr("x", (halfWidth))
                .attr("y", (height + 30))
                .attr("text-anchor", "middle")
                .style("font-size", "16px")
                .style("font-weight", "700")
                .text(name);

            var label = svg.append("text")
                .attr("x", (halfWidth))
                .attr("y", (height + 50))
                .attr("text-anchor", "middle")
                .attr("id", "label")
                .style("font-size", "16px")
                .text(moment().tz($scope.param).format($rootScope.timeFormat));
            animateLabel.call(label);
        }
    }
}]);
