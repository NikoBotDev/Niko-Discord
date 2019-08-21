const {Command} = require('discord-akairo');
const {Message, MessageEmbed} = require('discord.js');
const {requests: {getJSON}} = require('../../util');
const {GIPHY_KEY} = process.env;
const {stringify} = require('querystring');
const {oneLine} = require('common-tags');
class GiphyCommand extends Command {
  constructor() {
    super('giphy', {
      aliases: ['giphy', 'gpy'],
      category: 'search',
      description: {
        content: oneLine`Get a random gif from giphy which 
                can or not be related to te given tags`,
        usage: '<tags>',
      },
      args: [
        {
          id: 'tags',
          match: 'separate',
          prompt: {
            start: [
              'What tags you want to search?\n',
              'Type `stop` when you are done.',
            ],
            infinite: true,
          },
        },
      ],
    });
  }
  /**
     * @param {Message} msg
     * @param {Object} args
     * @param {string[]} args.tags
     */
  async exec(msg, {tags}) {
    const offset = Math.floor(Math.random() * 4 + 1);
    const query = stringify({
      q: tags.join(' '),
      api_key: GIPHY_KEY,
      limit: 30,
      offset,
    });
    let gifs = await getJSON(`http://api.giphy.com/v1/gifs/search?${query}`);
    if (!gifs || gifs.data.length === 0) return;
    gifs = gifs.data;
    const index = Math.floor(Math.random() * gifs.length);
    const gif = gifs[index];
    const embed = new MessageEmbed()
        .setColor(this.client.colors.ok)
        .setAuthor(msg.author.tag, msg.author.displayAvatarURL())
        .setImage(gif.images.original.url)
        .setFooter('Powered by Giphy api');
    return msg.util.send(embed);
  }
}

module.exports = GiphyCommand;