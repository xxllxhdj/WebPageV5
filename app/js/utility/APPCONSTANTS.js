
angular.module('angularWeb')
    .constant('APPCONSTANTS', {
        tokenKey: 'XXLUSS',
        httpTimeOut: 5000, 
        signinURL: '/public/auth/signin',
        getmeURL: '/api/users/me',
    });