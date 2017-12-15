app.controller('ContController', ['$scope', function ($scope) {
    $scope.title = "Contact Us";
    $scope.setTitleProducts = function () {
        $scope.title = "Products";
    };
    $scope.setTitleContact = function () {
        $scope.title = "Contact Us"
    };
    
}]);
