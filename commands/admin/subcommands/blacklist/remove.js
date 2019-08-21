const { Command } = require('discord-akairo');

class BlacklistRemoveCommand extends Command {
  constructor() {
    super('blacklist-remove', {
      aliases: ['blacklist-remove'],
      category: 'admin',
      clientPermissions: ['EMBED_LINKS'],
      userPermissions: ['MANAGE_GUILD'],
      description: {
        content: 'Remove a user from server blacklist',
        usage: '<user>'
      },
      args: [
        {
          id: 'member',
          type: 'member',
          prompt: {
            start: 'What member you want to remove?\n'
          }
        }
      ]
    });
  }

  async exec(msg, { member }) {
    const blacklist = this.client.settings.get(msg.guild.id, 'blacklist', []);
    const userIndex = blacklist.indexOf(member.id);
    blacklist.splice(userIndex, 1);
    await this.client.settings.set(msg.guild.id, 'blacklist', blacklist);
    return msg.reply(
      __('command.blacklist+remove', {
        name: member.displayName,
        id: member.id
      })
    );
  }
}

module.exports = BlacklistRemoveCommand;
