'use strict';

import winston from 'winston';
import { inspect } from 'util';

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
      filename: './.logs/app.log',
      handleExceptions: true,
      maxsize: 5242880, // 5MB
      maxFiles: 5
    }),
    new winston.transports.Console({
      level: 'info',
      handleExceptions: true
    })
  ],
  exitOnError: false
});

export default logger;
