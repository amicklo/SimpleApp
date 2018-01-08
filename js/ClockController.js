app.controller('ClockController', ['$scope', '$rootScope', function ($scope, $rootScope) {
    //array of places for which a clock will be created
    $scope.zones = ["America/Vancouver", "America/Denver", "America/Chicago", "America/Toronto", "Europe/London", "Asia/Tokyo"];
    //global variable to hold the format string for the time labels
    $rootScope.timeFormat = "hh:mm a";
}]);
