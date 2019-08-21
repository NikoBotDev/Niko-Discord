const {Command} = require('discord-akairo');
const {Message, MessageEmbed} = require('discord.js');
const {requests: {getJSON}} = require('../../util');
class NekoCommand extends Command {
  constructor() {
    super('neko', {
      aliases: ['neko'],
      category: 'search',
      description: {
        content: 'Get a random nekomimi image from nekos.life',
      },
    });
  }
  /**
     * @param {Message} msg
     */
  async exec(msg) {
    const data = await getJSON('https://nekos.life/api/neko');
    if (!data) return;
    const embed = new MessageEmbed()
        .setColor(this.client.colors.ok)
        .setImage(data.neko);
    return msg.util.send('', embed);
  }
}

module.exports = NekoCommand;