const { Listener } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');

class GuildMemberRemoveListener extends Listener {
  constructor() {
    super('guildMemberRemove', {
      emitter: 'client',
      event: 'guildMemberRemove',
      category: 'client'
    });
  }

  /**
   * @param {GuildMember} member
   */
  exec(member) {
    if (member.user.bot) return;
    const { guild } = member;
    const bye = this.client.settings.get(guild.id, 'bye');
    if (!bye) return;
    const channel = guild.channels.get(bye.channel);
    if (!channel) return;
    const replaces = {
      $user: member.user.username,
      $server: member.guild.name
    };
    const embed = new MessageEmbed()
      .setColor(this.client.colors.error)
      .setDescription(
        bye.message.replace(/\$user|\$server/g, matched => {
          return replaces[matched];
        })
      );
    channel.send(embed).catch(() => null);
  }
}

module.exports = GuildMemberRemoveListener;
