const {Command} = require('discord-akairo');
const {Message} = require('discord.js');
class PrefixCommand extends Command {
  constructor() {
    super('prefix', {
      aliases: ['prefix', 'px'],
      category: 'admin',
      userPermissions: ['MANAGE_GUILD'],
      channel: 'guild',
      description: {
        content: 'Displays or changes the prefix of the guild.',
        usage: '[prefix]',
        examples: ['>'],
      },
      args: [
        {
          id: 'prefix',
          default: '',
        },
      ],
    });
  }
  /**
     * @param {Message} msg
     * @param {Object} args
     * @param {string} args.prefix
     */
  async exec(msg, {prefix}) {
    const oldPrefix = this.client.settings.get(msg.guild.id, 'prefix', '!b');
    if (!prefix) {
      return msg.reply(__('command.prefix.nowPrefix', { prefix: oldPrefix }));
    }
    await this.client.settings.set(msg.guild.id, 'prefix', prefix);
    msg.reply(__('command.prefix.changed', { oldPrefix, newPrefix: prefix }));
  }
}

module.exports = PrefixCommand;