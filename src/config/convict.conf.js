"use strict";
var convict = require("convict");
var config = convict({
    env: {
        doc: 'The application environment',
        format: ['production', 'development'],
        default: 'development',
        env: 'NODE_ENV'
    },
    jwtSecret: {
        doc: 'T secret',
        format: String,
        default: 'the_m0st_securly_encrypted_secret',
        env: 'JWT_SECRET'
    },
    mongoURI: {
        doc: 'Mongo URI',
        format: String,
        default: 'null',
        env: 'MONGO_URI'
    },
    mailAuth: {
        user: {
            doc: 'Mail authentication user',
            format: String,
            default: 'null'
        },
        pass: {
            doc: 'Mail authentication password',
            format: String,
            default: 'null'
        }
    }
});
// const env = config.get('env');
// if (env === 'development') {
//   config.loadFile(path.join(__dirname, 'keys', 'dev.json'));
// } else if (env === 'production') {
//   config.loadFile(path.join(__dirname, 'keys', 'prod.json'));
// }
// Perform validation
config.validate({ allowed: 'strict' });
module.exports = config;
