import convict = require('convict');
import path = require('path');

const config = convict({
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
  }
});

const env = config.get('env');
if (env === 'development') {
  config.loadFile(path.join(__dirname, 'keys', 'dev.json'));
}

// Perform validation
config.validate({ allowed: 'strict' });
export = config;
