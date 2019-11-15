import { Listener, Command } from 'discord-akairo';

import { Message } from 'discord.js';
import { oneLine } from 'common-tags';
export default class CommandCooldownListener extends Listener {
  constructor() {
    super('cooldown', {
      emitter: 'commandHandler',
      event: 'cooldown',
      category: 'commandHandler'
    });
  }

  public exec(msg: Message, command: Command, remaining: number) {
    return msg.reply(
      oneLine`⏳ The command **${command.id}** is in cooldown,
            please wait **${(remaining / 1000).toFixed(2)}** sec(s)!`
    );
  }
}
