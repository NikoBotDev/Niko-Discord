import { Command } from 'discord-akairo';
import { Message } from 'discord.js';
export default class PingCommand extends Command {
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

  async exec(msg: Message) {
    const pingMsg = await msg.util!.send('Pinging~');
    const latency = pingMsg.createdTimestamp - msg.createdTimestamp;
    return msg.util!.send([
      `**Gateway Ping~ ${latency}ms**`,
      `**API Ping~ ${Math.round(this.client.ws.ping)}ms**`
    ]);
  }
}
