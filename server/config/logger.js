'use strict';

const { createLogger, format, transports } = require('winston');
require('winston-daily-rotate-file');

const fs = require('fs');
const path = require('path');

const env = process.env.NODE_ENV || 'development';
const logDir = 'log';

// Create the log directory if it does not exist
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

var dailyRotateFileTransport = new transports.DailyRotateFile({
  filename: `${logDir}/%DATE%-ES-Helper-server.log`,
  datePattern: 'YYYY-MM-DD'
});

var consoleTransport = new transports.Console({
    format: format.combine(format.prettyPrint())
});

const logger = createLogger({
  // change level if in dev environment versus production
  level:'info',
  format: format.combine(
    // format.label({ label: path.basename(process.mainModule.filename) }),
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.printf(
      info => `${info.timestamp} : ${info.message}`
    )
  ),
  transports: [
    consoleTransport,
    dailyRotateFileTransport
  ]
});

module.exports = logger;