const { Command } = require('discord-akairo');
const { Message, MessageEmbed } = require('discord.js');
const { stringify } = require('querystring');
const {
  requests: { getJSON }
} = require('../../util');

class MoeCommand extends Command {
  constructor() {
    super('anime-cute', {
      aliases: ['anime-cute', 'moe', 'cute', 'acte'],
      category: 'search',
      description: {
        content: 'Get a random hyper super duper cute image from awwnime',
        usage: '<tags>'
      },
      args: [
        {
          id: 'tags',
          match: 'separate',
          prompt: {
            start: [
              'What tags you want to search?\n',
              'Type `stop` when you are done.'
            ],
            infinite: true
          }
        }
      ]
    });
  }

  /**
   * @param {Message} msg
   * @param {Object} args
   * @param {string[]} args.tags
   */
  async exec(msg, { tags }) {
    const images = await getJSON(this.getUrl(tags));
    if (!images || images.length === 0) {
      return msg.reply('No images found');
    }
    const image = images[Math.floor(Math.random() * images.length)].cdnUrl;
    const embed = new MessageEmbed()
      .setColor(this.client.colors.ok)
      .setAuthor(msg.author.tag, msg.author.displayAvatarURL())
      .setDescription(tags.join(', '))
      .setImage(image)
      .setFooter('Powered by Awwnime');
    return msg.util.send(embed);
  }

  getUrl(tags) {
    const query = stringify({
      limit: 100,
      q: tags.join(' ')
    });
    return `https://awwnime.redditbooru.com/images/?${query}`;
  }
}

module.exports = MoeCommand;
