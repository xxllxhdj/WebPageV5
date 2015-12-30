

angular.module('angularWeb', ['ngAnimate', 'ui.router', 'ngCookies', 'mgcrea.ngStrap'])

    .config(['$stateProvider', '$urlRouterProvider', '$locationProvider', '$httpProvider', 
        function ($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider) {

            $stateProvider
                .state('signin', {
                    url: '/signin',
                    templateUrl: 'tpls/signin.html',
                    controller: 'SigninController'
                })
                .state('index', {
                    url: '/index',
                    abstract: true,
                    views: {
                        '': {
                            templateUrl: 'tpls/index.html'
                        },
                        'navBar@index': {
                            templateUrl: 'tpls/navbar.html',
                            controller: 'NavBarController'
                        }
                    },
                    access: { requiredAuthentication: true }
                })
                .state('index.home', {
                    url: '/home',
                    templateUrl: 'tpls/home.html',
                    access: { requiredAuthentication: true }
                });

            $urlRouterProvider.otherwise('/index/home');

            $locationProvider.html5Mode(true).hashPrefix('!');
            $httpProvider.interceptors.push('AuthInterceptor');
        }
    ])
    .run(['$rootScope', '$location', '$cookies', 'Initialization', 'Authentication', 'ExtDialog',  
        function($rootScope, $location, $cookies, Initialization, Authentication, ExtDialog) {
            $rootScope.$on('$stateChangeStart', function(event, nextRoute, currentRoute) {
                if (nextRoute != null && nextRoute.access != null && nextRoute.access.requiredAuthentication &&
                    !Authentication.isAuthenticated && !$cookies.get('U9USS')
                ) {
                    $location.path('/signin');
                }
            });

            $rootScope.$on('responseError', function (event, rejection) {
                if (rejection.status === -1) {
                    ExtDialog.tip('连接超时，请稍后重试');
                } else {
                    if (angular.isObject(rejection) && rejection.desc) {
                        ExtDialog.tip(rejection.desc);
                    }
                }
            });

            // ExtDialog.confirm(
            //     '内容内容内容内容内容内容内容内容内容内容内容内容内容'
            // ).then(function (result) {
            //     if (result) {
            //         ExtDialog.tip('确认');
            //     } else {
            //         ExtDialog.tip('取消');
            //     }
            // });
            // ExtDialog.showLoading();
            // setTimeout(function() {
            //     ExtDialog.hideLoading();
            // }, 6000);
        }
    ]);

angular.element(document).ready(function() {
    angular.bootstrap(document, ['angularWeb']);
});