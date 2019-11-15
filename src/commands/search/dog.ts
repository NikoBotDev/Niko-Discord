import { Command } from 'discord-akairo';
import { Message, MessageEmbed } from 'discord.js';
import axios from 'axios';
export default class DogCommand extends Command {
  constructor() {
    super('dog', {
      aliases: ['dog'],
      category: 'search',
      clientPermissions: ['EMBED_LINKS'],
      description: {
        content: 'Get a random dog image from random.dog'
      }
    });
  }

  public async exec(msg: Message) {
    const res = await axios.get('http://random.dog/woof', {
      responseType: 'text'
    });
    if (res.status !== 200) return null;
    const { data: image } = res;
    const embed = new MessageEmbed()
      .setColor(this.client.colors.ok)
      .setImage(`http://random.dog/${image as string}`);
    return msg.util!.send(msg.author, embed);
  }
}
