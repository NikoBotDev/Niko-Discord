import { Listener } from 'discord-akairo';
import { TextChannel, GuildMember, MessageEmbed } from 'discord.js';
interface IGMREventStringReplacements {
  $user: string;
  $server: string;
  [key: string]: string;
}
export default class GuildMemberRemoveListener extends Listener {
  constructor() {
    super('guildMemberRemove', {
      emitter: 'client',
      event: 'guildMemberRemove',
      category: 'client'
    });
  }

  public exec(member: GuildMember) {
    if (member.user.bot) return;
    const { guild } = member;
    const bye = this.client.settings.get(guild.id, 'bye', '');
    const channel = guild.channels.get(bye?.channel ?? '') as TextChannel;
    if (
      !channel ||
      !channel.permissionsFor(this.client.user!)!.has('SEND_MESSAGES')
    ) {
      return;
    }
    const replaces: IGMREventStringReplacements = {
      $user: member.user.username,
      $server: member.guild.name
    };
    const embed = new MessageEmbed()
      .setColor(this.client.colors.error)
      .setDescription(
        bye.message.replace(/\$user|\$server/g, (matched: string) => {
          return replaces[matched];
        })
      );

    channel.send(embed);
  }
}
