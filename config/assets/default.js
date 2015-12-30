'use strict';

module.exports = {
  server: {
    config: ['server/*/config/*.js'],
    models: ['server/*/models/*.js'],
    routes: ['server/!(core)/routes/**/*.js', 'server/core/routes/**/*.js'],
    policies: ['server/*/policies/*.js']
  }
};
