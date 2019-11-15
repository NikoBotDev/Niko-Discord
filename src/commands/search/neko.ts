import { Command } from 'discord-akairo';
import { Message, MessageEmbed } from 'discord.js';
import { getJSON } from '../../util/requests';

export default class NekoCommand extends Command {
  constructor() {
    super('neko', {
      aliases: ['neko'],
      category: 'search',
      description: {
        content: 'Get a random nekomimi image from nekos.life'
      }
    });
  }

  public async exec(msg: Message) {
    const data = await getJSON('https://nekos.life/api/neko');
    if (!data) return;
    const embed = new MessageEmbed()
      .setColor(this.client.colors.ok)
      .setImage(data.neko);
    return msg.util!.send('', embed);
  }
}
