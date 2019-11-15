import { Inhibitor } from 'discord-akairo';
import { Message } from 'discord.js';
export default class BlacklistInhibitor extends Inhibitor {
  constructor() {
    super('blacklist', {
      reason: 'blacklist',
      type: 'all'
    });
  }

  public exec(msg: Message) {
    if (msg.channel.type === 'dm') return false;
    const blacklist: string[] = this.client.settings.get(
      msg.guild!.id,
      'blacklist',
      []
    );
    return blacklist.includes(msg.author.id);
  }
}
