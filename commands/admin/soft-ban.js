const {
  Command,
  Argument: { validate }
} = require('discord-akairo');
const { MessageEmbed } = require('discord.js');

class SoftBanCommand extends Command {
  constructor() {
    super('softban', {
      aliases: ['softban', 'sb'],
      category: 'admin',
      description: {
        content: 'Bans and then unbans after some seconds.',
        usage: '<member> [reason]',
        examples: ['@toxicmember he is toxic']
      },
      ratelimit: 2,
      clientPermissions: ['BAN_MEMBERS'],
      userPermissions: ['BAN_MEMBERS'],
      args: [
        {
          id: 'member',
          type: validate(
            'member',
            member => member.id !== member.guild.ownerID && member.bannable
          ),
          prompt: {
            start: 'What member you want to ban?\n',
            retry: "I can't find or ban that user, maybe pick another one?"
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

  async exec(msg, { member, reason }) {
    // Permission check
    await member.ban({ reason, days: 2 });
    setTimeout(() => {
      msg.guild.members.unban(member, 'Soft ban timeout').catch(() => null);
    }, 4e4);
    const embed = new MessageEmbed()
      .setColor(this.client.colors.ok)
      .setTitle('Action: Soft Ban')
      .setThumbnail(member.user.displayAvatarURL())
      .setDescription(
        __('command.soft-ban.banned', {
          tag: member.user.tag,
          id: member.id
        })
      )
      .addField('Reason', reason)
      .setFooter(msg.author.tag, msg.author.displayAvatarURL());
    msg.util.send(embed);
  }

  // eslint-disable-next-line no-unused-vars
  async testHierarchy(mod, member) {
    // TODO
  }
}

module.exports = SoftBanCommand;
