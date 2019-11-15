import { Listener, PrefixSupplier } from 'discord-akairo';
import { Message } from 'discord.js';

export default class MessageInvalidListener extends Listener {
  constructor() {
    super('messageInvalid', {
      emitter: 'commandHandler',
      event: 'messageInvalid',
      category: 'commandHandler'
    });
  }

  public async exec(msg: Message) {
    const getPrefix = this.client.commandHandler.prefix as PrefixSupplier;
    const prefix = getPrefix(msg) as string;
    if (!msg.content.startsWith(prefix)) return;
    let tag: any = msg.content.slice(prefix.length);
    tag = await this.client.db.tags.findOne({
      where: {
        name: tag,
        guildId: msg.guild!.id
      }
    });
    if (!tag) return;
    msg.channel.send(tag.get('content'));
  }
}
