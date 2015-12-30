
angular.module('angularWeb')
    .controller('SignupController', ['$scope', '$state', 'User', 
        function ($scope, $state, User) {
            $scope.data = {
                usercode: '',
                password: '',
                rememberme: false
            };

            $scope.signup = function () {
            };
        }
    ]);