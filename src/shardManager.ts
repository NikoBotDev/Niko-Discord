import { config as setupEnvironment } from 'dotenv';
import logger from './classes/Logger';
import { ShardingManager } from 'discord.js';
setupEnvironment();
const manager = new ShardingManager('./main.js', { token: process.env.TOKEN });

manager.spawn();

manager.on('shardCreate', (shard) => {
  logger.info(`Starting shard ${shard.id}`);
});
