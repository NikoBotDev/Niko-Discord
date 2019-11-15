import { createClient, RedisClient, Multi } from 'redis';
import { promisifyAll } from 'bluebird';
import logger from './Logger';
// Change methods to Async
promisifyAll(RedisClient.prototype);
promisifyAll(Multi.prototype);
const client = createClient();

class Redis {
  static get db() {
    return client;
  }

  public static start() {
    client
      .once('ready', () => logger.info('[REDIS CLIENT READY!]'))
      .on('error', (err) => logger.error(err))
      .on('reconnecting', () => logger.warn('[RECONNECTING TO REDIS...]'))
      .once('end', () => logger.warn('[DISCONNECTED FROM REDIS]'));
  }
}

export default Redis;
