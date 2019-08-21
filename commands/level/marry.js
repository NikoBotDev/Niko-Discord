const {Command, Argument: {validate}} = require('discord-akairo');
const {Message, MessageEmbed, GuildMember} = require('discord.js');
const {oneLine, stripIndent} = require('common-tags');
class MarryCommand extends Command {
  constructor() {
    super('marry', {
      aliases: ['marry'],
      category: 'level',
      clientPermissions: ['EMBED_LINKS'],
      cooldown: 30000,
      description: {
        content: stripIndent`Marry with a member.
        You will need **1000** coins to use this command`,
        usage: '<member>',
        example: '@Niko'
      },
      args: [
        {
          id: 'member',
          type: validate('member', (msg, _, member) => {
            if (member.id === msg.author.id) return false;
            return true;
          }),
          prompt: {
            start: 'What user you want to get married?\n',
            retry: 'You cannot marry with yourself or with bots, pick another member!'
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
          oneLine`Sorry, you or the member you mentioned doesn't 
        have an account, please type anything to make one!`
      );
    }
    if (author.married || user.married) {
      return msg.util.reply(
          `You are breaking the main rule of marriage: don't try to steal or betray.`
      );
    }
    if (author.get('coins') < 1000) {
      return msg.reply(
          'You need **1000** coins to marry'
      );
    }
    await msg.reply(
        `Hey ${member} do you accept marry with ${msg.author}?\nType \`yes\` or \`no\``
    );
    const allowed = await this.getUserResponse(msg, member);
    if (!allowed || allowed === 'no') {
      return msg.reply(
          oneLine`That user doesn't want to marry with you!`
      );
    }
    const transaction = await this.client.db.transaction();
    try {
      await author.decrement({coins: 1000}, {transaction});
      await author.update({married: member.id}, {transaction});
      await user.update({married: author.get('userId')}, {transaction});
      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      return msg.reply('Something went wrong.');
    }

    const embed = new MessageEmbed()
        .setColor(this.client.colors.love)
        .setDescription(
            `${msg.author} and ${member} are now married!!!`
        )
        .setThumbnail(member.user.displayAvatarURL({format: 'png'}))
        .setImage(msg.author.displayAvatarURL())
        .setTimestamp();
    return msg.util.send(embed);
  }
  /**
   *
   * @param {Message} msg
   * @param {GuildMember} member
   */
  async getUserResponse(msg, member) {
    return new Promise(resolve => {
      const filter = message => {
        return ['yes', 'no'].includes(message.content.toLowerCase()) &&
        message.author.id === member.id;
      };
      const collector = msg.channel.createMessageCollector(filter, {
        time: 30000,
        max: 1
      });
      collector.once('collect', msg => resolve(msg.content));
      collector.once('end', collection => {
        if (collection.size === 0) resolve(null);
        else resolve(collection.first().content);
      });
    });
  }
}

module.exports = MarryCommand;