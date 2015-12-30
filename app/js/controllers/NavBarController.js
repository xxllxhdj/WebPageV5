
angular.module('angularWeb')
    .controller('NavBarController', ['$scope', 'User', 'Initialization', 
        function ($scope, User, Initialization) {
            $scope.data = {
                user: null
            };

            Initialization.initPromise.then(function () {
                $scope.data.user = User.getProfile();
            });

            $scope.signout = function () {
                User.signout();
            };
        }
    ]);