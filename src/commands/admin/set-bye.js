const {
  Command,
  Argument: { validate }
} = require('discord-akairo');

const { oneLine } = require('common-tags');

class SetByeCommand extends Command {
  constructor() {
    super('set-bye', {
      aliases: ['set-bye', 'stb'],
      category: 'admin',
      userPermissions: ['MANAGE_GUILD'],
      channel: 'guild',
      description: {
        content: oneLine`Changes the bye message for this server.
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
            start: 'What will be the bye message?\n'
          }
        }
      ]
    });
  }

  async exec(msg, { message, channel }) {
    const bye = this.client.settings.get(msg.guild.id, 'bye', {});
    bye.channel = channel.id;
    bye.message = message === '=' ? bye.message : message;
    await this.client.settings.set(msg.guild.id, 'bye', bye);
    if (message === '=') {
      return msg.reply(
        __('command.bye.channelSet', {
          channel: channel.toString()
        })
      );
    }
    return msg.reply(
      __('channel.bye.set', {
        channel: channel.toString(),
        message
      })
    );
  }
}

module.exports = SetByeCommand;
