const { Listener } = require('discord-akairo');
const { oneLine } = require('common-tags');

class CommandCooldownListener extends Listener {
  constructor() {
    super('cooldown', {
      emitter: 'commandHandler',
      event: 'cooldown',
      category: 'commandHandler'
    });
  }

  /**
   * @param {Message} msg
   * @param {Command} command
   * @param {number} remaining
   */
  exec(msg, command, remaining) {
    return msg.reply(
      oneLine`⏳ The command **${command.id}** is in cooldown, 
            please wait **${(remaining / 1000).toFixed(2)}** sec(s)!`
    );
  }
}

module.exports = CommandCooldownListener;
