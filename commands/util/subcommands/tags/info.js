const {Command} = require('discord-akairo');
const {Message, MessageEmbed} = require('discord.js');
const format = require('date-fns/format');
class TagInfoCommand extends Command {
  constructor() {
    super('tag-info', {
      aliases: ['tag-info'],
      category: 'util',
      args: [
        {
          id: 'name',
          prompt: {
            start: 'What tag you want to get information about?\n',
          },
        },
      ],
    });
  }
  /**
  * @param {Message} msg
  * @param {Object} args
  * @param {string} args.name
  * @param {string} args.content
  */
  async exec(msg, {name}) {
    const tag = await this.client.db.tags.findOne({
      where: {
        name,
        guildId: msg.guild.id,
      },
    });
    if (!tag) return;
    const createdAt = format(tag.get('createdAt'), 'MM-dd-yyyy HH:mm:ss');
    const updatedAt = format(tag.get('updatedAt'), 'MM-dd-yyyy HH:mm:ss');
    const author = await this.client.users.fetch(tag.get('userId'));

    const embed = new MessageEmbed()
        .setColor(this.client.colors.ok)
        .setThumbnail(author.displayAvatarURL())
        .addField('Name', tag.get('name'), true)
        .addField('Creator', author.tag, true)
        .addField('Content', this.parseTagContent(tag.get('content')), true)
        .addField('Created At', createdAt, true)
        .addField('Updated At', updatedAt, true);
    return msg.util.send(embed);
  }
  parseTagContent(content) {
    if (content.length > 100) {
      return `${content.substring(0, 100)}...`;
    } else {
      return content;
    }
  }
}

module.exports = TagInfoCommand;