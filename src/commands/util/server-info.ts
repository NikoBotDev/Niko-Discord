import { Command } from 'discord-akairo';
import { Message, MessageEmbed } from 'discord.js';
import format from 'date-fns/format';
export default class ServerInfoCommand extends Command {
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

  public exec(msg: Message) {
    const guild = msg.guild!;
    const { channels } = guild;
    const textChannels = channels.filter((ch) => ch.type === 'text');
    const voiceChannels = channels.filter((ch) => ch.type === 'voice');
    const createdAt = format(guild.createdAt, 'MM-dd-yyyy HH:mm:ss');
    const emojis = guild.emojis.map((emoji) => {
      return `\`${emoji.name}\` <${emoji.animated ? 'a' : ''}:${emoji.name}:${
        emoji.id
      }>`;
    });
    const embed = new MessageEmbed()
      .setColor(this.client.colors.ok)
      .setAuthor(guild.name)
      .setImage(guild.iconURL() || '')
      .addField('ID', guild.id, true)
      .addField('Owner', guild.owner!.user.tag, true)
      .addField('Members', guild.memberCount, true)
      .addField('Text Channels', textChannels.size, true)
      .addField('Voice Channels', voiceChannels.size, true)
      .addField('Created At', createdAt, true)
      .addField('Region', guild.region, true)
      .addField('Roles', guild.roles.size - 1, true)
      .addField('Features', guild.features.join(', ') || '-', true)
      .addField(
        `Emojis(${emojis.length})`,
        emojis.length ? emojis.splice(0, 10).join(' ') : '-',
        true
      );
    msg.util!.send(embed);
  }
}
