const { Command } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');
const axios = require('axios');

class DogCommand extends Command {
  constructor() {
    super('dog', {
      aliases: ['dog'],
      category: 'search',
      clientPermissions: ['EMBED_LINKS'],
      description: {
        content: 'Get a random dog image from random.dog'
      }
    });
  }

  async exec(msg) {
    const res = await axios.get('http://random.dog/woof', {
      responseType: 'text'
    });
    if (res.status !== 200) return null;
    const { data: image } = res;
    const embed = new MessageEmbed()
      .setColor(this.client.colors.ok)
      .setImage(`http://random.dog/${image}`);
    return msg.util.send(msg.author, embed);
  }
}

module.exports = DogCommand;
