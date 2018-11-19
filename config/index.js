const config = require('./config.json');
const databaseConfig = require('./database.json');
const baseConfig = config.base;
const environment = process.env.NODE_ENV || 'development';
let environmentConfig = config[environment];
const environmentDatabaseConfig = databaseConfig[environment];
environmentConfig['database'] = environmentDatabaseConfig;
global.config = Object.assign(baseConfig, environmentConfig);
