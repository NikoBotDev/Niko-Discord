'use strict';

const {
  Command,
  Argument: { validate }
} = require('discord-akairo');
const { MessageEmbed } = require('discord.js');

class BanCommand extends Command {
  constructor() {
    super('ban', {
      aliases: ['ban'],
      category: 'admin',
      description: {
        content: 'Apply ban in a member.',
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

    const embed = new MessageEmbed()
      .setColor(this.client.colors.ok)
      .setTitle(__('default+action', { action: 'Ban' }))
      .setThumbnail(member.user.displayAvatarURL())
      .setDescription(
        __('command.ban.banned', {
          username: member.user.username,
          id: member.id
        })
      )
      .addField(__('default+reason'), reason)
      .setFooter(msg.author.tag, msg.author.displayAvatarURL());
    return msg.util.send(embed);
  }
}

module.exports = BanCommand;
