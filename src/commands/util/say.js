const { Command } = require('discord-akairo');
const { Message, MessageEmbed } = require('discord.js');

class SayCommand extends Command {
  constructor() {
    super('say', {
      aliases: ['say'],
      category: 'util',
      description: {
        content: 'say something'
      },
      args: [
        {
          id: 'text',
          match: 'rest'
        }
      ]
    });
  }

  /**
   * @param {Message} msg
   * @param {Object} args
   */
  async exec(msg, { text }) {
    msg.channel.send(text);
  }
}

module.exports = SayCommand;
