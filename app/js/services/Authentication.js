angular.module('angularWeb')
    .factory('Authentication', function() {
        var auth = {
            isAuthenticated: false
        };

        return auth;
    });
