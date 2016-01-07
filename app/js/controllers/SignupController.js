
angular.module('angularWeb')
    .controller('SignupController', ['$scope', '$state', 'User', 'ExtDialog',
        function ($scope, $state, User, ExtDialog) {
            $scope.data = {
                usercode: '',
                password: '',
                verifyPassword: ''
            };

            $scope.signin = function () {
                $state.go('signin');
            };
            $scope.signup = function () {
                if ($scope.data.usercode === '') {
                    ExtDialog.alert('用户名不能为空');
                    return;
                }
                if ($scope.data.password === '') {
                    ExtDialog.alert('密码不能为空');
                    return;
                }
                if ($scope.data.password !== $scope.data.verifyPassword) {
                    ExtDialog.alert('两次输入的密码不一致');
                    return;
                }
                User.signup(
                    $scope.data.usercode, 
                    $scope.data.password, 
                    $scope.data.verifyPassword
                ).then(function () {
                    ExtDialog.confirm(
                        '恭喜您，注册成功！是否立即登录？'
                    ).then(function (result) {
                        if (result) {
                            $state.go('signin');
                        }
                    });
                });
            };
        }
    ]);