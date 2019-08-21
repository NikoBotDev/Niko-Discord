const { Command } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');
const format = require('date-fns/format');

class UserInfoCommand extends Command {
  constructor() {
    super('user-info', {
      aliases: ['user-info', 'uinfo'],
      category: 'util',
      description: {
        content: 'Fetch member information and send it in a fashion way.',
        usage: '[member]'
      },
      channel: 'guild',
      ratelimit: 2,
      args: [
        {
          id: 'member',
          description: 'Member to get information about.',
          type: 'member',
          default: msg => msg.member
        }
      ]
    });
  }

  exec(msg, { member }) {
    const { activity } = member.presence;
    const embed = new MessageEmbed()
      .setColor(this.client.colors.ok)
      .setAuthor(member.displayName, member.user.displayAvatarURL())
      .addField('ID', member.id, true)
      .addField(
        'Joined At',
        format(member.joinedAt, 'dd-MM-yyyy HH:mm:ss') || '?'
      )
      .addField(
        'Joined Discord',
        format(member.user.createdTimestamp, 'dd-MM-yyyy HH:mm:ss') || '?'
      )
      .addField(
        'Roles',
        `**(${member.roles.size - 1})** ${member.roles
          .filter(({ id }) => id !== msg.guild.id)
          .map(({ name }) => name)
          .splice(0, 5)
          .join('\n')}`
      )
      .addField('Status', member.presence.status)
      .setFooter(`Now Playing: ${activity ? activity.name : ''}`);
    msg.util.send('', embed);
  }
}

module.exports = UserInfoCommand;
