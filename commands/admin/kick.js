const {
  Command,
  Argument: { validate }
} = require('discord-akairo');
const { Message, MessageEmbed, GuildMember } = require('discord.js');
class KickCommand extends Command {
  constructor() {
    super('kick', {
      aliases: ['kick'],
      category: 'admin',
      description: {
        content: 'Kicks the member out of the server.',
        usage: '<member> [reason]',
        examples: ['@toxicmember he is toxic']
      },
      ratelimit: 2,
      clientPermissions: ['KICK_MEMBERS'],
      userPermissions: ['KICK_MEMBERS'],
      args: [
        {
          id: 'member',
          type: validate(
            'member',
            member => member.id !== member.guild.ownerID && member.kickable
          ),
          prompt: {
            start: 'What member you want to kick?\n',
            retry: "I can't find or kick that user, maybe pick another one?"
          }
        },
        {
          id: 'reason',
          type: validate('string', reason => reason.length <= 1200),
          match: 'rest'
        }
      ]
    });
  }
  /**
   * @param {Message} msg
   * @param {Object} args
   * @param {GuildMember} args.member
   * @param {string} args.reason
   */
  async exec(msg, { member, reason }) {
    // Permission check
    await member.kick(reason);

    const embed = new MessageEmbed()
      .setColor(this.client.colors.ok)
      .setTitle(
        __('default+action', {
          action: 'Kick'
        })
      )
      .setThumbnail(member.user.displayAvatarURL())
      .setDescription(
        __('command.kick.kicked', {
          username: member.user.username,
          id: member.id
        })
      )
      .addField(__('default+reason'), reason)
      .setFooter(msg.author.tag, msg.author.displayAvatarURL());
    return msg.util.send(embed);
  }
}

module.exports = KickCommand;
