const {
  Command,
  Argument: { union }
} = require('discord-akairo');
const { Message, MessageEmbed } = require('discord.js');

class ReloadCommand extends Command {
  constructor() {
    super('reload', {
      aliases: ['reload', 'rel'],
      ownerOnly: true,
      category: 'owner',
      description: {
        content: 'Reload a command',
        usage: '[command]'
      },
      args: [
        {
          id: 'command',
          description: 'command to reload',
          type: union('command', 'commandAlias'),
          prompt: {
            start: 'What command you want to be reloaded?\n',
            retry: 'I cannot find that command, try again.'
          }
        }
      ]
    });
  }

  /**
   * @param {Message} msg
   * @param {Object} args
   * @param {Command} args.command
   */
  exec(msg, { command }) {
    command.reload();
    const embed = new MessageEmbed()
      .setColor(this.client.colors.ok)
      .setDescription(`The command ${command} has been reloaded!`);
    msg.util.send('', embed);
  }
}

module.exports = ReloadCommand;
