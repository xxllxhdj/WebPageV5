angular.module('angularWeb')
    .factory('Initialization', ['$q', '$cookies', 'User', 
        function($q, $cookies, User) {
            var defer = $q.defer();

            init();

            return {
                initPromise: defer.promise
            };

            function init () {
                User.queryMe().finally(function () {
                    defer.resolve();
                });
            }
        }
    ]);
