var app = angular.module("myApp", []);



app.factory('factory', function () {
    //initialize grouping
    return {
        filter: function (dimension) {
            var grouping = dimension.group();

            //initialize reduce functions
            function reduceAdd(p, v) {
                return p + v.value;
            }

            function reduceRemove(p, v) {
                return p - v.value;
            }

            function reduceInitial() {
                return 0;
            }

            //reduce groupings
            return grouping.reduce(reduceAdd, reduceRemove, reduceInitial).all();
        }
    }
});
