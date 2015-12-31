
angular.module('angularWeb')
    .controller('ResetPasswordController', ['$scope', '$state', 'User', 'ExtDialog', 
        function ($scope, $state, User, ExtDialog) {
            $scope.data = {
                usercode: '',
                authcode: '',
                newpassword: '',
                verifypassword: ''
            };

            $scope.signup = function () {
                $state.go('signup');
            };
            $scope.signin = function () {
                $state.go('signin');
            };
            $scope.getAuthCode = function () {
                ExtDialog.showLoading();
                User.getAuthCode($scope.data.usercode).then(function (data) {
                    ExtDialog.alert(data.desc);
                }).finally(function () {
                    ExtDialog.hideLoading();
                });
            };
            $scope.resetPassword = function () {
                if ($scope.data.newpassword !== $scope.data.verifypassword) {
                    ExtDialog.tip('两次输入的密码不一样，请重新输入');
                    return;
                }
                ExtDialog.showLoading();
                User.resetPassword(
                    $scope.data.authcode, 
                    $scope.data.newpassword, 
                    $scope.data.verifypassword
                ).then(function () {
                    ExtDialog.alert('密码重置成功，前往登录？').then(function (result) {
                        if (result) {
                            $state.go('UserLogin');
                        }
                    });
                }).finally(function () {
                    ExtDialog.hideLoading();
                });
            };
        }
    ]);