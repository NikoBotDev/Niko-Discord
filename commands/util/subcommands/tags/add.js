const {
  Command,
  Argument: { validate }
} = require('discord-akairo');
const { Message, MessageEmbed } = require('discord.js');
const { UniqueConstraintError } = require('sequelize');
const { oneLine } = require('common-tags');

class TagAddCommand extends Command {
  constructor() {
    super('tag-add', {
      aliases: ['tag-add'],
      category: 'util',
      args: [
        {
          id: 'name',
          type: validate('string', name => name.length <= 20),
          prompt: {
            start: 'What will be the tag name?\n',
            retry: 'Sorry, the name cannot be greater than 20 characters.'
          }
        },
        {
          id: 'content',
          match: 'rest',
          type: validate(
            'string',
            content => content.length >= 10 && content.length <= 1000
          )
        }
      ]
    });
  }

  /**
   * @param {Message} msg
   * @param {Object} args
   * @param {string} args.name
   * @param {string} args.content
   */
  async exec(msg, { name, content }) {
    try {
      const { modules } = this.handler;
      if (modules.has(name)) {
        return msg.reply('The tag name cannot be a command name!');
      }
      await this.client.db.tags.create({
        name,
        content,
        guildId: msg.guild.id,
        userId: msg.author.id
      });
    } catch (err) {
      if (err instanceof UniqueConstraintError) {
        return msg.reply(`A tag with name \`${name}\` already exists`);
      }
    }
    const prefix = this.handler.prefix(msg);
    const embed = new MessageEmbed()
      .setColor(this.client.colors.ok)
      .setDescription(
        oneLine`Successfully created a tag with name **${name}** 
            you can check using \`${prefix}${name}\``
      );
    return msg.util.send(embed);
  }
}

module.exports = TagAddCommand;
