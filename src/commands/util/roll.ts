import { Command, Argument } from 'discord-akairo';
import { Message, MessageEmbed } from 'discord.js';

export default class RollCommand extends Command {
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
          type: Argument.range('integer', 1, Number.MAX_SAFE_INTEGER),
          prompt: {
            retry: `The value must be between **1** and **${Number.MAX_SAFE_INTEGER}**`
          },
          default: 100
        }
      ]
    });
  }

  public exec(msg: Message, { num }: { num: number }) {
    num = Math.floor(Math.random() * num) + 1;
    const embed = new MessageEmbed()
      .setColor(this.client.colors.bot)
      .setDescription(`You rolled ${num}`);
    msg.util!.send('', embed);
  }
}
