import { Command, Argument } from 'discord-akairo';
import { Message, MessageEmbed } from 'discord.js';

type UnbanCommandArguments = { id: string; reason: string };

export default class UnbanCommand extends Command {
  constructor() {
    super('unban', {
      aliases: ['unban'],
      category: 'admin',
      description: {
        content: 'Unbans a user in this server.',
        usage: '<userId> [reason]',
        examples: ["84238492394239842 i'll give him another chance"]
      },
      ratelimit: 2,
      channel: 'guild',
      clientPermissions: ['BAN_MEMBERS'],
      userPermissions: ['BAN_MEMBERS'],
      args: [
        {
          id: 'id',
          type: async (msg, id) => {
            const bans = await msg.guild.fetchBans();
            if (bans.has(id)) return id;
            return null;
          },
          prompt: {
            start: 'Type the id of the user that you want to be unbanned.\n',
            retry:
              "I can't find that user in bans list, check if the id is valid.",
            retries: 2,
            time: 6e4
          }
        },
        {
          id: 'reason',
          type: Argument.validate(
            'string',
            (_, __, reason) => reason.length <= 1200
          ),
          match: 'rest',
          default: 'No reason given'
        }
      ]
    });
  }

  public async exec(msg: Message, { id, reason }: UnbanCommandArguments) {
    const user = await msg.guild.members.unban(id, reason);
    const { username, id: userId } = user;
    const embed = new MessageEmbed()
      .setColor(this.client.colors.ok)
      .setTitle(
        __('default+action', {
          action: 'Unban'
        })
      )
      .setThumbnail(user.displayAvatarURL())
      .setDescription(
        __('command.unban.success', {
          username,
          id: userId
        })
      )
      .addField('Reason', reason)
      .setFooter(msg.author.tag, msg.author.displayAvatarURL());
    return msg.util!.send(embed);
  }
}
