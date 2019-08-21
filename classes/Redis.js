'use strict';

const { createClient, RedisClient, Multi } = require('redis');
const { promisifyAll } = require('bluebird');

// Change methods to Async
promisifyAll(RedisClient.prototype);
promisifyAll(Multi.prototype);

const client = createClient();
const logger = require('./Logger');

class Redis {
  static get db() {
    return client;
  }

  static start() {
    client
      .once('ready', () => logger.info('[REDIS CLIENT READY!]'))
      .on('error', err => logger.error(err))
      .on('reconnecting', () => logger.warn('[RECONNECTING TO REDIS...]'))
      .once('end', () => logger.warn('[DISCONNECTED FROM REDIS]'));
  }
}

module.exports = Redis;
