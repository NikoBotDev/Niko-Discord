import { Command, Argument } from 'discord-akairo';
import { Message, GuildMember, MessageEmbed } from 'discord.js';
import logger from '../../classes/Logger';
type SoftBanCommandArguments = { member: GuildMember; reason: string };

export default class SoftBanCommand extends Command {
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
            (_, __, reason: string) => reason.length <= 1200
          ),
          match: 'rest'
        }
      ]
    });
  }

  public async exec(msg: Message, { member, reason }: SoftBanCommandArguments) {
    // Permission check
    if (!member.bannable || !SoftBanCommand.testHierarchy(msg.member, member)) {
      return; // TODO i18n
    }
    await member.ban({ reason, days: 2 });
    setTimeout(() => {
      msg.guild.members.unban(member, 'Soft ban timeout').catch((err) => {
        logger.error(
          `Couldn't unban user [${member.displayName}](${member.id}) because of ${err}`
        );
      });
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
    msg.util!.send(embed);
  }
  /**
   * Checks if moderator's highest role is higher than member's role
   */
  public static testHierarchy(mod: GuildMember, member: GuildMember): boolean {
    return mod.roles.highest.comparePositionTo(member.roles.highest) > 0;
  }
}
