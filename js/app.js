var app = angular.module("myApp", []);

//factory for sorting values

app.factory('factory', function () {
    return {
        filter: function (dimension) {
            //initialize grouping
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
        },
        filterColor: function (dimension1, dimension2) {
            //initialize grouping
            var grouping1 = dimension1.group();
            var grouping2 = dimension2.group();

            //initialize reduce functions
            function reduceAdd(p, v) {
                if (v.category1 == name) {
                    return p + v.value
                }
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
