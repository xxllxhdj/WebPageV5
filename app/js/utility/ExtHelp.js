angular.module('angularWeb')
    .factory('ExtHelp', ['$http', '$q',
        function($http, $q) {
            var o = {};

            o.http = function (config) {
                var defer = $q.defer();

                $http(config).success(function (result) {
                    if (result.status === '0000') {
                        defer.resolve(result);
                    } else {
                        defer.reject(result);
                    }
                }).error(function (error) {
                    defer.reject(error);
                });

                return defer.promise;
            };

            return o;
        }
    ]);
