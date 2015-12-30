angular.module('angularWeb')
    .factory('User', ['$http', '$q', '$cookies', 'Authentication', 'APPCONSTANTS', 
        function($http, $q, $cookies, Authentication, APPCONSTANTS) {
            var o = {},
                profile;

            o.signin = function (usercode, password, rememberme) {
                var defer = $q.defer();

                signin(usercode, password, rememberme).then(function (result) {
                    Authentication.isAuthenticated = true;
                    if (rememberme) {
                        var date = new Date();
                        date.setFullYear(date.getFullYear() + 20);
                        $cookies.put('U9USS', result.data.token, {
                            expires: date
                        });
                    } else {
                        $cookies.put('U9USS', result.data.token);
                    }
                    o.queryMe().then(function () {
                        defer.resolve(result);
                    }, function (error) {
                        defer.reject(error);
                    });
                }, function (error) {
                    defer.reject(error);
                });

                return defer.promise;
            };
            o.signout = function () {
                $cookies.remove('U9USS');
                Authentication.isAuthenticated = false;
                profile = null;
            };
            o.queryMe = function () {
                var defer = $q.defer();

                queryMe().then(function (result) {
                    profile = {
                        username: result.data.username,
                        photo: result.data.photo
                    };
                    defer.resolve(result);
                }, function (error) {
                    profile = null;
                    defer.reject(error);
                });

                return defer.promise;
            };

            o.getProfile = function () {
                return profile ? angular.copy(profile) : null;
            };

            return o;

            function signin (usercode, password, rememberme) {
                var defer = $q.defer();

                $http({
                    method: 'POST',
                    url: APPCONSTANTS.signinURL,
                    data: {
                        usercode: usercode,
                        password: password,
                        rememberme: rememberme
                    },
                    timeout: APPCONSTANTS.httpTimeOut
                }).success(function (result) {
                    if (result.status === '0000') {
                        defer.resolve(result);
                    } else {
                        defer.reject(result);
                    }
                }).error(function (error) {
                    defer.reject(error);
                });

                return defer.promise;
            }
            function queryMe () {
                var defer = $q.defer();

                $http({
                    method: 'GET',
                    url: APPCONSTANTS.getmeURL,
                    timeout: APPCONSTANTS.httpTimeOut
                }).success(function (result) {
                    if (result.status === '0000') {
                        defer.resolve(result);
                    } else {
                        defer.reject(result);
                    }
                }).error(function (error) {
                    defer.reject(error);
                });

                return defer.promise;
            }
        }
    ]);
