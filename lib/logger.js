const	winston = require('winston'),
		fs = require('fs-extra'),
		logDir = __dirname + '/../logs';

fs.ensureDir(logDir).catch(err => { // Create the log directory if it does not exist
 	console.error(err);
})

const tsFormat = () => (new Date()).toLocaleTimeString(); // Create time stamp

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  timestamp: tsFormat,
  colorize: true,
  transports: [
//    new winston.transports.Console({ timestamp: tsFormat, colorize: true, level: 'info' }), // Outputs to the console
    new winston.transports.File({ filename: logDir + '/error.log', level: 'error' }), // - Write all logs error (and below) to `error.log`.
    new winston.transports.File({ filename: logDir + '/combined.log' }) // - Write to all logs with level `info` and below to `combined.log` 
  ]
});

module.exports = logger;