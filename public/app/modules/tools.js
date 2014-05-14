

var requires = [

];

var tools = angular.module('th3Tools', requires);

tools.factory('Tools', function ($kinvey, $location) {
    var self = {
        /*
         * This allows kinvey (database system) to save properly
         * Angular adds values to object in ng-repeat that are not allowed
         * in kinvey.
         * */
        cleanupAngularObject: function (value) {
            if (value instanceof Array) {
                for (var i = 0; i < value.length; i++) {
                    self.cleanupAngularObject(value[i]);
                }
            }
            else if (value instanceof Object) {
                for (property in value) {
                    if (/^\$+/.test(property)) {
                        delete value[property];
                    }
                    else {
                        self.cleanupAngularObject(value[property]);
                    }
                }
            }
        }
    };
    return self;
});