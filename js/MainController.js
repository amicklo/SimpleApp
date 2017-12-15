app.controller('MainController', ['$scope', function ($scope) {
    $scope.title = "Products";
    $scope.setTitleProducts = function () {
        $scope.title = "Products";

    };
    $scope.setTitleContact = function () {
        $scope.title = "Contact Us"
    };
    $scope.products = [
        {
            name: 'Plates',
            price: 14.99,
            image: 'image/plates.jpg'
        },
        {
            name: 'Knives',
            price: 20.49,
            image: 'image/knives.jpg'
  	    },
        {
            name: 'Mixer',
            price: 229.99,
            image: 'image/mixer.jpg'
  	    }
    ]
}]);

