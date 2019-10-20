const {
  Command,
  Argument: { range, validate }
} = require('discord-akairo');

const { oneLine } = require('common-tags');

class SetSlowModeCommand extends Command {
  constructor() {
    super('set-slow-mode', {
      aliases: ['set-slow-mode', 'ssmd'],
      category: 'admin',
      description: {
        content: oneLine`Add or change the rate limit settings for this channel.^
                If you want to disable just type \`0\` for seconds.`,
        usage: '<seconds> [reason]',
        examples: ['30 People was spamming a lot lol', "0 they're good again"]
      },
      clientPermissions: ['MANAGE_CHANNELS'],
      userPermissions: ['MANAGE_CHANNELS'],
      args: [
        {
          id: 'seconds',
          type: range('integer', 0, 120),
          prompt: {
            start:
              'What is the amount of seconds that users will be limited to?\n',
            retry:
              "That isn't a valid amount, please type a number in the range 0-120\n"
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

  async exec(msg, { seconds, reason }) {
    await msg.channel.setRateLimitPerUser(seconds, reason);
    msg.reply(
      __('command.slow-mode.set', {
        seconds
      })
    );
  }
}

module.exports = SetSlowModeCommand;
