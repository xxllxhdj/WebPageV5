angular.module('angularWeb')
    .factory('User', ['$http', '$q', '$cookies', 'Authentication', 'APPCONSTANTS', 
        function($http, $q, $cookies, Authentication, APPCONSTANTS) {
            var o = {},
                profile;

            o.signup = function (usercode, password, verifyPassword) {
                return signup(usercode, password, verifyPassword);
            };
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
            o.getAuthCode = function (usercode) {
                return forgotPassword(usercode);
            };
            o.resetPassword = function (token, newPassword, verifyPassword) {
                return resetPassword(token, newPassword, verifyPassword);
            };

            o.getProfile = function () {
                return profile ? angular.copy(profile) : null;
            };

            return o;

            function signup (usercode, password, verifyPassword) {
                var defer = $q.defer();

                $http({
                    method: 'POST',
                    url: APPCONSTANTS.signupURL,
                    data: {
                        usercode: usercode,
                        password: password,
                        verifyPassword: verifyPassword
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
            function forgotPassword (usercode) {
                var defer = $q.defer();

                $http({
                    method: 'POST',
                    url: APPCONSTANTS.forgotPasswordURL,
                    data: {
                        usercode: usercode
                    },
                    timeout: 30000
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
            function resetPassword (token, newPassword, verifyPassword) {
                var defer = $q.defer();

                $http({
                    method: 'POST',
                    url: APPCONSTANTS.resetPasswordURL,
                    data: {
                        token: token,
                        newPassword: newPassword,
                        verifyPassword: verifyPassword
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
            function changePassword (oldPassword, newPassword, verifyPassword) {
                var defer = $q.defer();

                $http({
                    method: 'POST',
                    url: APPCONSTANTS.changePasswordURL,
                    data: {
                        oldPassword: oldPassword,
                        newPassword: newPassword,
                        verifyPassword: verifyPassword
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
        }
    ]);
