import { Command } from 'discord-akairo';
import { Message } from 'discord.js';
export default class AvatarCommand extends Command {
  constructor() {
    super('choice', {
      aliases: ['choice'],
      category: 'util',
      description: {
        content: 'Choose between things',
        usage: '<things>',
        examples: ['one|two|three']
      },
      args: [
        {
          id: 'choices',
          type: (_, phrase) => {
            const splitted: string[] = phrase.split('|');
            if (splitted.length > 1) return splitted;
            return false;
          },
          description: 'Available choices',
          prompt: {
            start: 'What will be the available choices?\n'
          }
        }
      ]
    });
  }

  public exec(msg: Message, { choices }: { choices: string[] }) {
    const choice = choices[Math.floor(Math.random() * choices.length)];
    msg.util!.send(`I choose **${choice}**`);
  }
}
