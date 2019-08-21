const {
  Command,
  Argument: { validate }
} = require('discord-akairo');
const { MessageEmbed } = require('discord.js');

class UnbanCommand extends Command {
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
          type: async (id, msg) => {
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
          type: validate('string', reason => reason.length <= 1200),
          match: 'rest',
          default: 'No reason given'
        }
      ]
    });
  }

  async exec(msg, { id, reason }) {
    // Permission check
    // ? Get from soft-ban
    const user = await msg.guild.members.unban(id, reason);
    const { username, userId } = user;
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
    return msg.util.send(embed);
  }
}

module.exports = UnbanCommand;
