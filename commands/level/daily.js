const {Command} = require('discord-akairo');
const {Message} = require('discord.js');
const day = 24 * 60 * 60 * 1000;
const format = require('date-fns/format');
const differenceInMilliseconds = require('date-fns/differenceInMilliseconds');
const {xp: exp} = require('../../services');
class DailyCommand extends Command {
  constructor() {
    super('daily', {
      aliases: ['daily'],
      category: 'level',
      clientPermissions: ['EMBED_LINKS'],
      description: {
        content: 'Get your daily reward!',
      },
    });
  }
  /**
     * @param {Message} msg
     */
  async exec(msg) {
    const user = await this.client.db.profiles.findOne({
      where: {
        userId: msg.author.id
      }
    });
    if (!user) {
      return msg.reply('Sorry, you don\'t have an account, type anything to make one');
    }
    const diff = differenceInMilliseconds(new Date(parseInt(user.daily)), new Date());
    const date = new Date(diff);

    if (((new Date) - user.daily) < day) {
      const timeLasting = format(date.setHours(date.getHours() + 24), 'kk:mm:ss');
      return msg.reply(
          `You already claimed your daily, wait **${timeLasting}** to get it again!`
      );
    }
    const xp = exp.getXpRewardForLevel(user.level);
    user.xp += xp;
    user.coins += 100;
    user.daily = Date.now();
    await user.save();
    msg.reply(`⬆ You claimed your daily reward: +${xp} xp & +100 coins`);
  }
}

module.exports = DailyCommand;