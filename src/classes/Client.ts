'use strict';

import {
  AkairoClient,
  CommandHandler,
  ListenerHandler,
  InhibitorHandler,
  SequelizeProvider
} from 'discord-akairo';
import { Message, Guild } from 'discord.js';
import { join } from 'path';
import i18n from 'i18n';
import { RedisClient } from 'redis';
import { promises as fs } from 'fs';
import Redis from './Redis';
import Database from './Database';
import { importModels } from '../util';
import { hexCode } from '../types';
import { Model, Sequelize } from 'sequelize';
const { TOKEN } = process.env;
const settings: typeof Model = Database.db.import('../data/models/settings');

declare module 'discord-akairo' {
  // tslint:disable-next-line: interface-name
  interface AkairoClient {
    colors: any;
    commandHandler: CommandHandler;
    listenerHandler: ListenerHandler;
    inhibitorHandler: InhibitorHandler;
    settings: SequelizeProvider;
    db: any;
    redis: RedisClient;
  }
}

class Niko extends AkairoClient {
  constructor() {
    super(
      {
        ownerID: '272070510341259264'
      },
      {
        messageCacheMaxSize: 1e3,
        disableEveryone: true,
        disabledEvents: ['TYPING_START']
      }
    );

    this.colors = {
      ok: 0x28fc4f,
      error: 0xfc1e1e,
      warn: 0xfff466,
      bot: 0x36393e,
      love: 0xff42cc
    };

    this.commandHandler = new CommandHandler(this, {
      prefix: (msg: Message): string => {
        if (!msg.guild) return '!b';
        return this.settings.get(msg.guild.id, 'prefix', '!b');
      },
      defaultCooldown: 3e3,
      directory: join(__dirname, '..', 'commands'),
      aliasReplacement: /-/g,
      commandUtil: true,
      commandUtilLifetime: 3e5,
      storeMessages: true,
      handleEdits: true
    });

    this.listenerHandler = new ListenerHandler(this, {
      directory: join(__dirname, '..', 'listeners')
    });

    this.inhibitorHandler = new InhibitorHandler(this, {
      directory: join(__dirname, '..', 'inhibitors')
    });

    this.settings = new SequelizeProvider(settings, {
      idColumn: 'guildId',
      dataColumn: 'settings'
    });

    this.setup();
  }

  get redis() {
    return Redis.db;
  }

  get db() {
    return Database.db;
  }

  public start() {
    this.login(TOKEN);
  }

  private async setup() {
    Redis.start();
    Database.start();
    importModels(Database.db);
    this.settings.init();
    this.commandHandler.useListenerHandler(this.listenerHandler);
    this.commandHandler.useInhibitorHandler(this.inhibitorHandler);

    this.listenerHandler.setEmitters({
      commandHandler: this.commandHandler,
      listenerHandler: this.listenerHandler
    });

    this.inhibitorHandler.loadAll();
    this.commandHandler.loadAll();
    this.listenerHandler.loadAll();
    const files = await fs.readdir(join(process.cwd(), 'translations'));
    const locales = files.map((name) => name.split('.')[0]);
    i18n.configure({
      locales,
      directory: join(process.cwd(), 'translations'),
      defaultLocale: 'en-us',
      autoReload: true,
      updateFiles: true,
      syncFiles: true,
      register: global,
      objectNotation: '+'
    });
    this.registerCustomTypes();
  }

  private registerCustomTypes() {
    this.commandHandler.resolver.addType('hexCode', hexCode);
  }
}

export default Niko;
