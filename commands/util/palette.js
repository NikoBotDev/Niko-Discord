const {Command} = require('discord-akairo');
const {Message, MessageAttachment} = require('discord.js');
const {getJSON} = require('../../util/requests');
const {image: {getPalette}} = require('../../services');
class PaletteCommand extends Command {
  constructor() {
    super('palette', {
      aliases: ['palette', 'ptt'],
      category: 'util',
      description: {
        content: 'Send a random beautiful palette'
      },
      ratelimit: 2,

    });
  }
  /**
     * @param {Message} msg
     */
  async exec(msg) {
    const data = await getJSON('http://colormind.io/api/', {
      method: 'POST',
      data: {
        model: 'default'
      }
    });
    if (!data) return;

    const {result: colors} = data;
    const buffer = await getPalette(colors);
    const attachment = new MessageAttachment(buffer, 'palette.png');
    msg.channel.send(msg.author, attachment);
  }
}

module.exports = PaletteCommand;