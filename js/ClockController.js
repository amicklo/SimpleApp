app.controller('ClockController', ['$scope', '$rootScope', function ($scope, $rootScope) {
    $scope.zones = ["America/Vancouver", "America/Denver", "America/Chicago", "America/Toronto", "Europe/London", "Asia/Tokyo"];
    $rootScope.timeFormat = "hh:mm a";
}]);
