
angular.module('angularWeb')
    .controller('SigninController', ['$scope', '$cookies', '$state', 'User', 'Authentication', 'APPCONSTANTS', 
        function ($scope, $cookies, $state, User, Authentication, APPCONSTANTS) {
            $scope.data = {
                usercode: '',
                password: '',
                rememberme: false
            };

            $scope.signin = function () {
                User.signin($scope.data.usercode, $scope.data.password, $scope.data.rememberme).then(function () {
                    $state.go('index.home');
                });
            };
        }
    ]);