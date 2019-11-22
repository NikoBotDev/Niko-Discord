import { Command } from 'discord-akairo';
import { Message } from 'discord.js';
type PrefixCommandArguments = { prefix: string };
export default class PrefixCommand extends Command {
  constructor() {
    super('prefix', {
      aliases: ['prefix', 'px'],
      category: 'admin',
      userPermissions: ['MANAGE_GUILD'],
      channel: 'guild',
      description: {
        content: 'Displays or changes the prefix of the guild.',
        usage: '[prefix]',
        examples: ['>']
      },
      args: [
        {
          id: 'prefix',
          default: ''
        }
      ]
    });
  }

  public async exec(msg: Message, { prefix }: PrefixCommandArguments) {
    const oldPrefix: string = this.client.settings.get(
      msg.guild!.id,
      'prefix',
      '!b'
    );
    if (!prefix) {
      return msg.reply(__('command.prefix.nowPrefix', { prefix: oldPrefix }));
    }
    await this.client.settings.set(msg.guild!.id, 'prefix', prefix);
    msg.reply(__('command.prefix.changed', { oldPrefix, newPrefix: prefix }));
  }
}
