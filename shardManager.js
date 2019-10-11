const { config: setupEnvironment } = require('dotenv');
const logger = require('./classes/Logger');

setupEnvironment();
const { ShardingManager } = require('discord.js');

const manager = new ShardingManager('./main.js', { token: process.env.TOKEN });

manager.spawn();

manager.on('shardCreate', shard => {
  logger.info(`Starting shard ${shard.id}`);
});
