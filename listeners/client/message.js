const { Listener } = require('discord-akairo');
const { xp } = require('../../services');

class MessageListener extends Listener {
  constructor() {
    super('message', {
      emitter: 'client',
      event: 'message',
      category: 'client'
    });
  }

  /**
   * @param {Message} msg
   */
  async exec(msg) {
    if (msg.author.bot) return;
    // Leveling
    const [user] = await this.client.db.profiles.findOrBuild({
      where: {
        userId: msg.author.id
      }
    });

    xp.addRewards(user);
    const nextXp = xp.toNextLevel(user.level, true);

    if (user.xp >= nextXp) {
      user.level += 1;
      user.xp = user.xp - nextXp || 1;
      msg.reply(`Congrats you just leveled up to level **${user.level}** !`);
    }

    await user.save();

    // Coin Event
  }
}

module.exports = MessageListener;
