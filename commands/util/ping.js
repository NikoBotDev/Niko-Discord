const { Command } = require('discord-akairo');

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
    const pingMsg = await msg.util.send('Pinging~');
    const latency = msg.createdTimestamp - pingMsg.createdTimestamp;
    return msg.util.send([
      `**Gateway Ping~ ${latency.toString()}ms**`,
      `**API Ping~ ${Math.round(this.client.ws.ping).toString()}ms**`
    ]);
  }
}

module.exports = PingCommand;
