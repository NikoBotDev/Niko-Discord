const { Listener } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');

class GuildMemberAddListener extends Listener {
  constructor() {
    super('guildMemberAdd', {
      emitter: 'client',
      event: 'guildMemberAdd',
      category: 'client'
    });
  }

  /**
   * @param {GuildMember} member
   */
  exec(member) {
    if (member.user.bot) return;
    const { guild } = member;
    const greeting = this.client.settings.get(guild.id, 'greeting');
    if (!greeting) return;
    const channel = guild.channels.get(greeting.channel);
    if (!channel) return;
    const replaces = {
      $user: member.user,
      $server: member.guild.name
    };
    const embed = new MessageEmbed()
      .setColor(this.client.colors.ok)
      .setDescription(
        greeting.message.replace(/\$user|\$server/g, matched => {
          return replaces[matched];
        })
      );
    channel.send(embed).catch(() => null);
  }
}

module.exports = GuildMemberAddListener;
