const {Command} = require('discord-akairo');
const {Message, MessageEmbed} = require('discord.js');
const {join} = require('path');
class LoadCommand extends Command {
  constructor() {
    super('load', {
      aliases: ['load'],
      category: 'owner',
      ownerOnly: true,
      description: {
        content: 'Load a command',
        usage: '[command]',
        examples: ['category:alias'],
      },
      args: [
        {
          id: 'command',
          description: 'Command to be loaded, format: category:command',
          prompt: {
            start: 'What command you want to load?\n',
          },
        },
      ],
    });
  }
  /**
     * @param {Message} msg
     * @param {Object} args
     * @param {string} args.command
     */
  async exec(msg, {command}) {
    const splitted = command.split(':');
    const path = join(__dirname, '..', splitted[0], `${splitted[1]}.js`);
    command = this.client.commandHandler.load(path);
    if (!command) {
      return msg.util.reply('Failed to load the command');
    }
    const embed = new MessageEmbed()
        .setColor(this.client.colors.ok)
        .setDescription(`Successfully loaded the command ${command.id}`);
    msg.util.send('', embed);
  }
}

module.exports = LoadCommand;