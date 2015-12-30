
angular.module('angularWeb')
    .controller('SigninController', ['$scope', '$state', 'User', 
        function ($scope, $state, User) {
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
            $scope.signup = function () {
                $state.go('signup');
            };
        }
    ]);