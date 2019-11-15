import { Command } from 'discord-akairo';
import { Message, MessageEmbed, MessageAttachment } from 'discord.js';
import axios from 'axios';
import { extname } from 'path';
export default class CatCommand extends Command {
  constructor() {
    super('cat', {
      aliases: ['cat'],
      category: 'search',
      clientPermissions: ['EMBED_LINKS'],
      description: {
        content: 'Get a random cat image from thecatapi'
      }
    });
  }

  public async exec(msg: Message) {
    const res = await axios.get('http://thecatapi.com/api/images/get', {
      responseType: 'arraybuffer'
    });
    if (res.status !== 200) return;
    const {
      data: image,
      request: {
        res: { responseUrl }
      }
    } = res;
    const ext = extname(responseUrl);
    const name = `cat.${ext}`;
    const embed = new MessageEmbed()
      .setColor(this.client.colors.ok)
      .attachFiles([new MessageAttachment(image as Buffer, name)])
      .setImage(`attachment://${name}`);
    msg.util!.send('', embed);
  }
}
