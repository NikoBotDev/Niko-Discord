const { Command } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');

class PingCommand extends Command {
  constructor() {
    super('ping', {
      aliases: ['ping'],
      category: 'util',
      description: {
        content: 'Calculates the bot ping and shows it.'
      },
      ratelimit: 2
    });
  }

  async exec(msg) {
    const m = await msg.util.send('Ping!');
    const embed = new MessageEmbed()
      .setColor(this.client.colors.ok)
      .setDescription(
        __('command.ping.is', {
          ping: m.createdTimestamp - msg.createdTimestamp
        })
      );

    await msg.util.edit('', embed);
  }
}

module.exports = PingCommand;
