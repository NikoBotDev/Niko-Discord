const { Listener } = require('discord-akairo');

class MessageInvalidListener extends Listener {
  constructor() {
    super('messageInvalid', {
      emitter: 'commandHandler',
      event: 'messageInvalid',
      category: 'commandHandler'
    });
  }

  async exec(msg) {
    const prefix = this.client.commandHandler.prefix(msg);
    if (!msg.content.startsWith(prefix)) return;
    let tag = msg.content.slice(prefix.length);
    tag = await this.client.db.tags.findOne({
      where: {
        name: tag,
        guildId: msg.guild.id
      }
    });
    if (!tag) return;
    msg.channel.send(tag.get('content'));
  }
}

module.exports = MessageInvalidListener;
