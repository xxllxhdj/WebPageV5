'use strict';

var defaultEnvConfig = require('./default');

module.exports = {
    db: {
        uri: process.env.MONGOHQ_URL || process.env.MONGOLAB_URI || 'mongodb://' + (process.env.DB_1_PORT_27017_TCP_ADDR || 'localhost') + '/WebPageV5-dev',
        // Enable mongoose debug mode
        debug: process.env.MONGODB_DEBUG || false
    },
    log: {
        // Can specify one of 'combined', 'common', 'dev', 'short', 'tiny'
        format: 'dev',
        // Stream defaults to process.stdout
        // Uncomment to enable logging to a log on the file system
        options: {
            //stream: 'access.log'
        }
    },
    mailer: {
        from: process.env.MAILER_FROM || 'XXL<2132047316@qq.com>',
        options: {
            service: process.env.MAILER_SERVICE_PROVIDER || 'QQ',
            auth: {
                user: process.env.MAILER_EMAIL_ID || '2132047316@qq.com',
                pass: process.env.MAILER_PASSWORD || 'sjiftidxiwnqchgc'
            }
        }
    }
};
