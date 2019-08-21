const {Command} = require('discord-akairo');
const {Message, MessageEmbed, MessageAttachment} = require('discord.js');
const axios = require('axios');
const {extname} = require('path');
class CatCommand extends Command {
  constructor() {
    super('cat', {
      aliases: ['cat'],
      category: 'search',
      clientPermissions: ['EMBED_LINKS'],
      description: {
        content: 'Get a random cat image from thecatapi',
      },
    });
  }
  /**
     * @param {Message} msg
     */
  async exec(msg) {
    const res = await axios.get('http://thecatapi.com/api/images/get', {
      responseType: 'arraybuffer',
    });
    if (res.status !== 200) return;
    const {data: image, request: {res: {responseUrl}}} = res;
    const ext = extname(responseUrl);
    const name = `cat.${ext}`;
    const embed = new MessageEmbed()
        .setColor(this.client.colors.ok)
        .attachFiles([new MessageAttachment(image, name)])
        .setImage(`attachment://${name}`);
    msg.util.send('', embed);
  }
}

module.exports = CatCommand;