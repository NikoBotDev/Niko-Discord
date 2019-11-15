import { Command } from 'discord-akairo';
import { Message, MessageEmbed } from 'discord.js';
import { getJSON } from '../../util/requests';
export default class CatFactCommand extends Command {
  constructor() {
    super('cat-fact', {
      aliases: ['cat-fact', 'ctf'],
      category: 'search',
      description: {
        content: 'Get a random cat fact from catfact API'
      }
    });
  }

  public async exec(msg: Message) {
    const data: { fact: string } = await getJSON('https://catfact.ninja/fact');
    if (!data) return;
    const embed = new MessageEmbed()
      .setColor(this.client.colors.ok)
      .setTitle(':cat2: fact')
      .setDescription(data.fact);
    msg.util!.send('', embed);
  }
}
