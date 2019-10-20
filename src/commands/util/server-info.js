const { Command } = require('discord-akairo');
const { Message, MessageEmbed } = require('discord.js');
const format = require('date-fns/format');

class ServerInfoCommand extends Command {
  constructor() {
    super('server-info', {
      aliases: ['server-info', 'sinfo'],
      category: 'util',
      description: {
        content: 'Fetch server information and send it in a fashion way.'
      },
      channel: 'guild',
      ratelimit: 2
    });
  }

  /**
   * @param {Message} msg
   */
  exec(msg) {
    const { channels } = msg.guild;
    const textChannels = channels.filter(ch => ch.type === 'text');
    const voiceChannels = channels.filter(ch => ch.type === 'voice');
    const createdAt = format(msg.guild.createdAt, 'MM-dd-yyyy HH:mm:ss');
    const emojis = msg.guild.emojis.map(emoji => {
      return `\`${emoji.name}\` <${emoji.animated ? 'a' : ''}:${emoji.name}:${
        emoji.id
      }>`;
    });
    const embed = new MessageEmbed()
      .setColor(this.client.colors.ok)
      .setAuthor(msg.guild.name)
      .setImage(msg.guild.iconURL() || '')
      .addField('ID', msg.guild.id, true)
      .addField('Owner', msg.guild.owner.user.tag, true)
      .addField('Members', msg.guild.memberCount, true)
      .addField('Text Channels', textChannels.size, true)
      .addField('Voice Channels', voiceChannels.size, true)
      .addField('Created At', createdAt, true)
      .addField('Region', msg.guild.region, true)
      .addField('Roles', msg.guild.roles.size - 1, true)
      .addField('Features', msg.guild.features.join(', ') || '-', true)
      .addField(
        `Emojis(${emojis.length})`,
        emojis.length ? emojis.splice(0, 10).join(' ') : '-',
        true
      );
    msg.util.send(embed);
  }
}

module.exports = ServerInfoCommand;
