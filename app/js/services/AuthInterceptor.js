angular.module('angularWeb')
    .factory('AuthInterceptor', ['$rootScope', '$q', '$cookies', '$location', 'Authentication', 
        function($rootScope, $q, $cookies, $location, Authentication) {
            return {
                request: function(config) {
                    if (config.url.indexOf('/api') !== 0) {
                        return config; 
                    }
                    config.headers = config.headers || {};
                    if ($cookies.get('U9USS')) {
                        config.headers.Authorization = 'Bearer ' + $cookies.get('U9USS');
                    }
                    return config;
                },
                response: function (response) {
                    if (response != null && response.status === 200) {
                        var data = response.data;
                        if (data.status === '0000' && $cookies.get('U9USS') && !Authentication.isAuthenticated) {
                            Authentication.isAuthenticated = true;
                        }
                        if (data.status === '4001' && ($cookies.get('U9USS') || Authentication.isAuthenticated)) {
                            $cookies.remove('U9USS');
                            Authentication.isAuthenticated = false;
                            $location.path('/signin');
                        }
                        if (data.status !== '0000' && data.status !== '4001') {
                            $rootScope.$emit('responseError', data);
                        }
                    }
                    return response || $q.when(response);
                },
                responseError: function(rejection) {
                    if (rejection != null) {
                        $rootScope.$emit('responseError', {
                            status: rejection.status,
                            data: rejection.data
                        });
                    }
                    return $q.reject(rejection);
                }
            };
        }
    ]);
