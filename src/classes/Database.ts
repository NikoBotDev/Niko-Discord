import { Sequelize } from 'sequelize';
import { join } from 'path';
import fs from 'fs-nextra';
import logger from './Logger';

const path: string = join(__dirname, '..', '.data', 'db.sqlite3');

// Check if the database file exists
fs.pathExists(path).then(async (exists: boolean) => {
  if (!exists) await fs.createFile(path);
});

const db = new Sequelize({
  dialect: 'sqlite',
  storage: path,
  logging: false,
  retry: {
    max: 3
  }
});
class Database {
  static get db() {
    return db;
  }

  static async start() {
    try {
      logger.info('[SETUPING PRAGMAS...]');
      await db.query('PRAGMA journal_mode=WAL; PRAGMA synchronous=OFF');
      logger.info('[DONE SETUPING PRAGMAS...]');
      await db.authenticate();
      logger.info('[DATABASE AUTHENTICATED]');
      logger.info('[SYNCING DATABASE...]');
      await db.sync();
      logger.info('[DATABASE SYNC SUCCESSFULLY!]');
    } catch (err) {
      logger.info(`[DATABASE ERRORED] (${err})\nRETRYING IN 5 SECS...`);
      setTimeout(Database.start, 5e3);
    }
  }
}

export default Database;
