const {Command} = require('discord-akairo');
const {Message, MessageEmbed} = require('discord.js');
class TrackStreamListCommand extends Command {
  constructor() {
    super('stream-list', {
      aliases: ['stream-list'],
      category: 'admin',
      clientPermissions: ['EMBED_LINKS'],
      description: {
        content: 'List all streams that are being tracked in this channel.',
      },
    });
  }
  /**
     * @param {Message} msg
     */
  async exec(msg) {
    const streams = await this.client.db.streams.findAll({
      where: {
        channelId: msg.channel.id,
        guildId: msg.guild.id,
      },
    });
    if (streams.length === 0) {
      return msg.reply('No one is being tracked in this channel!');
    }
    const embed = new MessageEmbed()
        .setColor(this.client.colors.ok)
        .setDescription(
            `Streams being tracked in this channel\n
                ${streams.map(stream => `\`${stream.get('username')}\`, `)}`
        )
        .setFooter('Stream Tracker', this.client.user.avatarURL());
    return msg.util.send(embed);
  }
}

module.exports = TrackStreamListCommand;