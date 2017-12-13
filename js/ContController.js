app.controller('ContController', ['$scope', function ($scope) {
    $scope.title = "Contact Us";
    $scope.setTitleProducts = function () {
        $scope.title = "Products";
    };
    $scope.setTitleContact = function () {
        $scope.title = "Contact Us"
    };
    $scope.initTabs = function () {
        var svg = d3.select("body");

        svg.selectAll("rect")
            .attr("fill", "MidnightBlue")
            .on("mouseover", function () {
                d3.select(this)
                    .transition()
                    .attr("fill", "Blue");
            })
            .on("mouseout", function () {
                d3.select(this)
                    .transition()
                    .attr("fill", "MidnightBlue");
            });
    };
}]);
