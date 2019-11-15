import { Listener } from 'discord-akairo';
import {
  Message,
  MessageEmbed,
  GuildMember,
  User,
  TextChannel
} from 'discord.js';

export default class GuildMemberAddListener extends Listener {
  constructor() {
    super('guildMemberAdd', {
      emitter: 'client',
      event: 'guildMemberAdd',
      category: 'client'
    });
  }

  public exec(member: GuildMember) {
    if (member.user.bot) return;
    const { guild } = member;
    const greeting = this.client.settings.get(guild.id, 'greeting', '');
    const channel = guild.channels.get(greeting?.channel ?? '') as TextChannel;
    if (!channel) return;
    const replaces: { $user: User; $server: string; [key: string]: any } = {
      $user: member.user,
      $server: member.guild.name
    };
    const embed = new MessageEmbed()
      .setColor(this.client.colors.ok)
      .setDescription(
        greeting.message.replace(/\$user|\$server/g, (matched: string) => {
          return replaces[matched];
        })
      );
    channel.send(embed).catch(() => null);
  }
}
