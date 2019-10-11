const {
  Command,
  Argument: { range }
} = require('discord-akairo');
const { Message, MessageEmbed } = require('discord.js');

class RollCommand extends Command {
  constructor() {
    super('roll', {
      aliases: ['roll'],
      category: 'util',
      ratelimit: 2,
      description: {
        content: 'Generates a random number based in the given max range',
        usage: '[range=100]',
        examples: ['89042']
      },
      args: [
        {
          id: 'num',
          description: 'Max value to be considered while rolling the dices.',
          type: range('integer', 1, Number.MAX_SAFE_INTEGER),
          prompt: {
            retry: `The value must be between **1** and **${Number.MAX_SAFE_INTEGER}**`
          },
          default: 100
        }
      ]
    });
  }

  /**
   * @param {Message} msg
   * @param {Object} args
   * @param {Number} args.num
   */
  exec(msg, { num }) {
    num = Math.floor(Math.random() * num) + 1;
    const embed = new MessageEmbed()
      .setColor(this.client.colors.bot)
      .setDescription(`You rolled ${num}`);
    msg.util.send('', embed);
  }
}

module.exports = RollCommand;
