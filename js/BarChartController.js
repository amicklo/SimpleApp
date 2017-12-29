/*-------------------------------------------------------------------
 * Bar Chart
 * Color and Letter values separated then charted by weight
 * some chart logic taken from:
 * https://bl.ocks.org/alandunning/7008d0332cc28a826b37b3cf6e7bd998
 * https://bl.ocks.org/caravinden/eb0e5a2b38c8815919290fa838c6b63b
 *-------------------------------------------------------------------
 */

app.controller('BarChartController', ['$rootScope', '$scope', 'factory', function ($scope, $rootScope, factory) {
    $scope.names = ["color", "letter", "shape", "country"];
    $rootScope.dims = [];
    $rootScope.filterOn = "members";
}]);
