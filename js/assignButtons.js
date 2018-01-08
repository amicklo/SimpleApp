app.directive('assignButtons', ['$rootScope', function ($scope, $rootScope) {
    return {
        controller: function ($scope, $rootScope) {
            //set the label time to 12-hour time
            d3.select("#twelve")
                .on("click", function () {
                    $rootScope.timeFormat = "hh" + $rootScope.timeFormat.substring(2, $rootScope.timeFormat.length);
                });
            //set the label time to 24-hour time
            d3.select("#twenty_four")
                .on("click", function () {
                    $rootScope.timeFormat = "HH" + $rootScope.timeFormat.substring(2, $rootScope.timeFormat.length);
                });
            //include seconds in the time label
            d3.select("#seconds")
                .on("click", function () {
                    if ($rootScope.timeFormat.search("ss") < 0) {
                        $rootScope.timeFormat = $rootScope.timeFormat.substring(0, 5) + ":ss" + $rootScope.timeFormat.substring(5, $rootScope.timeFormat.length);
                    } else {
                        $rootScope.timeFormat = $rootScope.timeFormat.substring(0, 5) + $rootScope.timeFormat.substring(8, $rootScope.timeFormat.length);
                    }
                });
            //include the current date in the time label
            d3.select("#date")
                .on("click", function () {
                    if ($rootScope.timeFormat.search("-") < 0) {
                        $rootScope.timeFormat = $rootScope.timeFormat + " - MMM Do YYYY";
                    } else {
                        $rootScope.timeFormat = $rootScope.timeFormat.substring(0, $rootScope.timeFormat.search(" - "));
                    }
                });
        }
    }
}]);
