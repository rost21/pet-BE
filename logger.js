const log4js = require('log4js'); 
log4js.configure({ 
  appenders: {
    everything:{ type: 'stdout' },
    file_log: { type: 'file', filename: 'logs/errors.log' },
    logLevelFilter: { type: 'logLevelFilter', level: 'error', appender: 'file_log' }   
  },
  categories: {
    default: {
     appenders: [ 'logLevelFilter','everything' ], level: 'all'
    },            
  }
});

const logger = log4js.getLogger();

module.exports = logger;