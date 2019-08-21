const {Command, Argument: {validate}} = require('discord-akairo');
const {Message} = require('discord.js');
class BlacklistCommand extends Command {
  constructor() {
    super('blacklist', {
      aliases: ['blacklist', 'bckl'],
      category: 'admin',
      clientPermissions: ['EMBED_LINKS'],
      userPermissions: ['MANAGE_GUILD'],
      description: {
        content: 'Add or remove a user from server blacklist',
        usage: '<add|remove> <user>',
        examples: [
          'add @user',
          'remove @user',
        ],
      },
      args: [
        {
          id: 'type',
          type: validate('lowercase', type => {
            return ['add', 'remove'].includes(type);
          }),
          prompt: {
            start: 'You want to `remove` or `add` a user?\n',
          },
        },
        {
          id: 'args',
          match: 'rest',
          prompt: {
            start: 'What user you want to be blacklisted?\n',
          },
        },
      ],
    });
  }
  /**
     * @param {Message} msg
     * @param {Object} args
     * @param {string} args.type
     * @param {string} args.args
     */
  async exec(msg, {type, args}) {
    const command = this.handler.modules.get({
      add: 'blacklist-add',
      remove: 'blacklist-remove',
    }[type]);
    return this.handler.handleDirectCommand(msg, args, command);
  }
}

module.exports = BlacklistCommand;