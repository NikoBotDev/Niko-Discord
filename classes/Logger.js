'use strict';

const winston = require('winston');
const { inspect } = require('util');

// Setup Logger
const logger = winston.createLogger({
  format: winston.format.combine(
    winston.format.colorize({
      all: true
    }),
    winston.format.timestamp(),
    winston.format.splat(),
    winston.format.printf(i => {
      const isObject = typeof i.message === 'object';
      // eslint-disable-next-line max-len
      return `${i.timestamp} | [${i.level}] ${
        isObject ? inspect(i.message, { depth: 1 }) : i.message
      }`;
    })
  ),
  transports: [
    new winston.transports.File({
      level: 'error',
      colorize: false,
      filename: './.logs/app.log',
      handleExceptions: true,
      json: true,
      maxsize: 5242880, // 5MB
      maxFiles: 5
    }),
    new winston.transports.Console({
      level: 'info',
      handleExceptions: true,
      json: false
    })
  ],
  exitOnError: false
});

module.exports = logger;
