const { Command } = require('discord-akairo');
const { Message, MessageEmbed } = require('discord.js');

class ShardsCommand extends Command {
  constructor() {
    super('shards', {
      aliases: ['shards'],
      category: 'owner',
      ownerOnly: true,
      clientPermissions: ['EMBED_LINKS']
    });
  }

  /**
   * @param {Message} msg
   * @param {Object} args
   */
  exec(msg) {
    const { shards } = this.client.ws;
    if (shards.size === 0) return;
    const embed = new MessageEmbed()
      .setColor(this.client.colors.ok)
      .setTitle('Shard Status');

    shards.map((shard, i) => {
      embed.addField(
        `Shard **${i}**`,
        `Status: **${this.resolveStatus(shard.status)}**`
      );
    });
    return msg.util.send(embed);
  }

  resolveStatus(status) {
    switch (status) {
      case 0:
        return 'Ready';
      case 1:
        return 'Connecting';
      case 2:
        return 'Reconnecting';
      case 3:
        return 'Idle';
      case 4:
        return 'Nearly';
      case 5:
        return 'Disconnected';
      default:
        return 'None';
    }
  }
}

module.exports = ShardsCommand;
