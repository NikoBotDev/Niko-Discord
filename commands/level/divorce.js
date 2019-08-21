const {Command} = require('discord-akairo');
const {Message, MessageEmbed, GuildMember} = require('discord.js');
const {oneLine, stripIndent} = require('common-tags');
class DivorceCommand extends Command {
  constructor() {
    super('divorce', {
      aliases: ['divorce'],
      category: 'level',
      clientPermissions: ['EMBED_LINKS'],
      cooldown: 30000,
      description: {
        content: stripIndent`Divorce...
        You will need **1000** coins to use this command`,
        usage: '<member>',
        example: '@Niko'
      },
      args: [
        {
          id: 'member',
          type: 'member',
          prompt: {
            start: 'What user you want to divorce?\n'
          }
        }
      ]
    });
  }
  /**
     * @param {Message} msg
     * @param {Object} args
     * @param {GuildMember} args.member
     */
  async exec(msg, {member}) {
    const author = await this.client.db.profiles.findOne({
      where: {
        userId: msg.author.id
      }
    });
    const user = await this.client.db.profiles.findOne({
      where: {
        userId: member.id
      }
    });
    if (!user || !author) {
      return msg.util.reply(
          oneLine`Sorry, you or the user you mentioned doesn't 
        have an account, please type anything to make one!`
      );
    }
    if (author.get('coins') < 1000) {
      return msg.reply(
          'You need **1000** coins to divorce'
      );
    }
    try {
      const transaction = await this.client.db.transaction();
      try {
        await author.decrement({coins: 1000}, {transaction});
        await author.update({married: null}, {transaction});
        await user.update({married: null}, {transaction});
        await transaction.commit();
      } catch (err) {
        await transaction.rollback();
        throw new Error(`Transaction process failed, rolling back: ${err}`);
      }
    } catch (err) {
      return msg.reply('Something went wrong.');
    }

    const embed = new MessageEmbed()
        .setDescription(
            `${msg.author} and ${member} are now divorced...`
        )
        .setThumbnail(member.user.displayAvatarURL({format: 'png'}))
        .setImage(msg.author.displayAvatarURL())
        .setTimestamp();
    return msg.util.send(embed);
  }
}

module.exports = DivorceCommand;