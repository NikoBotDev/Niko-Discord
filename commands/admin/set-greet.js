const {
  Command,
  Argument: { validate }
} = require('discord-akairo');
const { oneLine } = require('common-tags');

class SetGreetCommand extends Command {
  constructor() {
    super('set-greet', {
      aliases: ['set-greet', 'stg'],
      category: 'admin',
      userPermissions: ['MANAGE_GUILD'],
      channel: 'guild',
      description: {
        content: oneLine`Changes the greeting message for this server.
                if you just wish to change the channel type **=** for the message like the
                example below`,
        usage: '<channel> <message>',
        examples: ['#channel Welcome $user to $server', '#channel =']
      },
      args: [
        {
          id: 'channel',
          type: 'channel',
          prompt: {
            start: 'What channel the messages will be sent?'
          }
        },
        {
          id: 'message',
          type: validate('string', msg => {
            if ((msg.length < 1000 && msg.length > 10) || msg === '=')
              return true;
            return false;
          }),
          match: 'rest',
          prompt: {
            start: 'What will be the greeting message?\n'
          }
        }
      ]
    });
  }

  async exec(msg, { message, channel }) {
    const greeting = this.client.settings.get(msg.guild.id, 'greeting', {});
    greeting.channel = channel.id;
    greeting.message = message === '=' ? greeting.message : message;
    await this.client.settings.set(msg.guild.id, 'greeting', greeting);
    return msg.reply(
      __('command.greet.set', {
        message,
        channel: channel.toString()
      })
    );
  }
}

module.exports = SetGreetCommand;
