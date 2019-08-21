'use strict';

const {
  AkairoClient,
  CommandHandler,
  ListenerHandler,
  InhibitorHandler,
  SequelizeProvider
} = require('discord-akairo');
const { join } = require('path');
const i18n = require('i18n');
const { promises: fs } = require('fs');
const Redis = require('./Redis');
const Database = require('./Database');
const { importModels } = require('../util');
const { hexCode } = require('../types');

const { TOKEN } = process.env;
const settings = Database.db.import('../data/models/settings');

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
      prefix: msg => {
        if (!msg.guild) return '!b';
        return this.settings.get(msg.guild.id, 'prefix', '!b');
      },
      defaultCooldown: 3e3,
      directory: join(__dirname, '..', 'commands'),
      aliasReplacement: /-/g,
      commandUtil: true,
      commandUtilLifetime: 3e5,
      storeMessages: true,
      handleEdits: true,
      defaultPrompt: {
        modifyRetry: str => `${str}\n\nType \`cancel\` to cancel the command.`,
        timeout:
          'You took too long to respond, the command has been cancelled.',
        ended: 'No retries left, the command has been cancelled.',
        cancel: 'The command has been cancelled.',
        retries: 3,
        time: 3e4
      }
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

  async setup() {
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
    const locales = files.map(name => name.split('.')[0]);
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

  start() {
    this.login(TOKEN);
  }

  registerCustomTypes() {
    this.commandHandler.resolver.addType('hexCode', hexCode);
  }
}

module.exports = Niko;
