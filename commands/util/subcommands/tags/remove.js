const { Command } = require('discord-akairo');
const { Message } = require('discord.js');

class TagRemoveCommand extends Command {
  constructor() {
    super('tag-remove', {
      aliases: ['tag-remove'],
      category: 'util',
      args: [
        {
          id: 'name',
          prompt: {
            start: `What's the tag name that you want to delete?\n`
          }
        }
      ]
    });
  }

  /**
   * @param {Message} msg
   * @param {Object} args
   * @param {string} args.name
   */
  async exec(msg, { name }) {
    const isDestroyed = await this.client.db.tags.destroy({
      where: {
        name,
        guildId: msg.guild.id
      }
    });
    if (!isDestroyed) {
      return msg.reply(`Couldn't find a tag with name \`${name}\`...`);
    }
    return msg.reply(`The tag with name ${name} has been deleted!`);
  }
}

module.exports = TagRemoveCommand;
