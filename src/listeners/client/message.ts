import { Listener } from 'discord-akairo';
import { Message } from 'discord.js';
import * as xp from '../../services/xp.service';
import IUser from '../../data/interfaces/IUser';
export default class MessageListener extends Listener {
  constructor() {
    super('message', {
      emitter: 'client',
      event: 'message',
      category: 'client'
    });
  }

  public async exec(msg: Message) {
    if (msg.author!.bot) return;
    // Leveling
    const [user]: [IUser, boolean] = await this.client.db.profiles.findOrBuild({
      where: {
        userId: msg.author!.id
      }
    });

    xp.addRewards(user);
    const nextXp = xp.toNextLevel(user.level, true) as number;

    if (user.xp >= nextXp) {
      user.level += 1;
      user.xp = user.xp - nextXp || 1;
      msg.reply(`Congrats you just leveled up to level **${user.level}** !`);
    }

    await user.save();

    // Coin Event
  }
}
