const { Command } = require('discord-akairo');
const { Message, MessageEmbed } = require('discord.js');
const {
  requests: { getJSON }
} = require('../../util');

class CatFactCommand extends Command {
  constructor() {
    super('cat-fact', {
      aliases: ['cat-fact', 'ctf'],
      category: 'search',
      description: {
        content: 'Get a random cat fact from catfact API'
      }
    });
  }

  /**
   * @param {Message} msg
   */
  async exec(msg) {
    const data = await getJSON('https://catfact.ninja/fact');
    if (!data) return;
    const embed = new MessageEmbed()
      .setColor(this.client.colors.ok)
      .setTitle(':cat2: fact')
      .setDescription(data.fact);
    msg.util.send('', embed);
  }
}

module.exports = CatFactCommand;
