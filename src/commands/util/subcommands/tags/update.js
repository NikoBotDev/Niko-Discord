const {
  Command,
  Argument: { validate }
} = require('discord-akairo');
const { Message, MessageEmbed } = require('discord.js');
const { oneLine } = require('common-tags');

class TagUpdateCommand extends Command {
  constructor() {
    super('tag-update', {
      aliases: ['tag-update'],
      category: 'util',
      args: [
        {
          id: 'name',
          type: validate('string', name => name.length <= 20),
          prompt: {
            start: 'What tag would you like to update?\n'
          }
        },
        {
          id: 'content',
          match: 'rest',
          type: validate(
            'string',
            content => content.length >= 10 && content.length <= 1000
          ),
          prompt: {
            start: "What'll be the new content for this tag?\n",
            retry:
              'Sorry, the content must be at least 10 characters long with a maximum of 1000 characters\n'
          }
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
    const [count] = await this.client.db.tags.update(
      { content },
      {
        where: {
          name,
          guildId: msg.guild.id
        }
      }
    );
    if (count === 0) {
      return msg.reply("I couldn't find a tag with that name.");
    }
    const prefix = this.handler.prefix(msg);
    const embed = new MessageEmbed()
      .setColor(this.client.colors.ok)
      .setDescription(
        oneLine`Successfully updated the tag **${name}** 
            you can check using \`${prefix}${name}\``
      );
    return msg.util.send(embed);
  }
}

module.exports = TagUpdateCommand;
