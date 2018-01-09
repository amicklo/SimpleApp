app.directive('tasks', [function ($scope) {

    return {
        restrict: 'E',
        scope: {
        },
        controller: function ($scope) {
            d3.json('data/taskData.json', function (error, data) {
                if (error) throw error;

                data = data.data;
            })
        }
    }
}]);
