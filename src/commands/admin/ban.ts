import { Command, Argument } from 'discord-akairo';
import { Message, GuildMember, MessageEmbed } from 'discord.js';

type BanCommandArguments = { member: GuildMember; reason?: string };

export default class BanCommand extends Command {
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
          type: Argument.validate(
            'member',
            (_, __, member: GuildMember) =>
              member.id !== member.guild.ownerID && member.bannable
          ),
          prompt: {
            start: 'What member you want to ban?\n',
            retry: "I can't find or ban that user, maybe pick another one?"
          }
        },
        {
          id: 'reason',
          type: Argument.validate(
            'string',
            (_, reason: string) => reason.length <= 1200
          ),
          match: 'rest'
        }
      ]
    });
  }

  public async exec(msg: Message, { member, reason }: BanCommandArguments) {
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
    return msg.util!.send(embed);
  }
}
