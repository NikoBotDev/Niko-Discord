import { Command } from 'discord-akairo';
import { Message, MessageEmbed, GuildMember } from 'discord.js';
import format from 'date-fns/format';
export default class UserInfoCommand extends Command {
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
          default: (msg: Message) => msg.member
        }
      ]
    });
  }

  public exec(msg: Message, { member }: { member: GuildMember }) {
    const { activity } = member.presence;
    const embed = new MessageEmbed()
      .setColor(this.client.colors.ok)
      .setAuthor(member.displayName, member.user.displayAvatarURL())
      .addField('ID', member.id, true)
      .addField(
        'Joined At',
        format(member.joinedAt as Date, 'dd-MM-yyyy HH:mm:ss') || '?'
      )
      .addField(
        'Joined Discord',
        format(member.user.createdTimestamp, 'dd-MM-yyyy HH:mm:ss') || '?'
      )
      .addField(
        'Roles',
        `**(${member.roles.size - 1})** ${member.roles
          .filter(({ id }) => id !== msg.guild!.id)
          .map(({ name }) => name)
          .splice(0, 5)
          .join('\n')}`
      )
      .addField('Status', member.presence.status)
      .setFooter(`Now Playing: ${activity ? activity.name : ''}`);
    return msg.util!.send('', embed);
  }
}
