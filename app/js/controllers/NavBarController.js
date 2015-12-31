
angular.module('angularWeb')
    .controller('NavBarController', ['$scope', '$state', 'User', 'Initialization', 
        function ($scope, $state, User, Initialization) {
            $scope.data = {
                user: null
            };

            Initialization.initPromise.then(function () {
                $scope.data.user = User.getProfile();
            });

            $scope.signout = function () {
                User.signout();
                $state.go('signin');
            };
        }
    ]);