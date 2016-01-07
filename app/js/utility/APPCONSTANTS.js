
angular.module('angularWeb')
    .constant('APPCONSTANTS', {
        tokenKey: 'XXLUSS',
        httpTimeOut: 5000, 
        signupURL: '/public/auth/signup',
        signinURL: '/public/auth/signin',
        getmeURL: '/api/users/me',
        forgotPasswordURL: '/public/password/forgot',
        resetPasswordURL: '/public/password/reset'
    });