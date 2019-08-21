const { Command } = require('discord-akairo');

class BlacklistAddCommand extends Command {
  constructor() {
    super('blacklist-add', {
      aliases: ['blacklist-add'],
      category: 'admin',
      clientPermissions: ['EMBED_LINKS'],
      userPermissions: ['MANAGE_GUILD'],
      description: {
        content: 'Add a user into server blacklist',
        usage: '<user>'
      },
      args: [
        {
          id: 'member',
          type: 'member',
          prompt: {
            start: 'What member you want to be blacklisted?\n'
          }
        }
      ]
    });
  }

  async exec(msg, { member }) {
    const blacklist = this.client.settings.get(msg.guild.id, 'blacklist', []);
    blacklist.push(member.id);
    await this.client.settings.set(msg.guild.id, 'blacklist', blacklist);
    return msg.reply(
      __('command.blacklist+add', {
        name: member.displayName,
        id: member.id
      })
    );
  }
}

module.exports = BlacklistAddCommand;
