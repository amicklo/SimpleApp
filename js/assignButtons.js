app.directive('assignButtons', ['$rootScope', function ($scope, $rootScope) {
    return {
        controller: function ($scope, $rootScope) {
            d3.select("#twelve")
                .on("click", function () {
                    $rootScope.timeFormat = "hh" + $rootScope.timeFormat.substring(2, $rootScope.timeFormat.length);
                });

            d3.select("#twenty_four")
                .on("click", function () {
                    $rootScope.timeFormat = "HH" + $rootScope.timeFormat.substring(2, $rootScope.timeFormat.length);
                });

            d3.select("#seconds")
                .on("click", function () {
                    if ($rootScope.timeFormat.search("ss") < 0) {
                        $rootScope.timeFormat = $rootScope.timeFormat.substring(0, 5) + ":ss" + $rootScope.timeFormat.substring(5, $rootScope.timeFormat.length);
                    } else {
                        $rootScope.timeFormat = $rootScope.timeFormat.substring(0, 5) + $rootScope.timeFormat.substring(8, $rootScope.timeFormat.length);
                    }
                });

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
