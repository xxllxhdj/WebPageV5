'use strict';

module.exports = {
    port: process.env.PORT || 8085,
    templateEngine: 'swig',
    webDir: 'www',
    jwtTokenSecret: process.env.TOKEN_SECRET || 'WebPageV5'
};
