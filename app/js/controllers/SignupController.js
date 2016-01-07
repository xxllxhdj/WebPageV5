
angular.module('angularWeb')
    .controller('SignupController', ['$scope', '$state', 'User', 
        function ($scope, $state, User) {
            $scope.data = {
                usercode: '',
                password: '',
                rememberme: false
            };

            $scope.signin = function () {
                $state.go('signin');
            };
            $scope.signup = function () {
            };
        }
    ]);