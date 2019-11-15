import { Command } from 'discord-akairo';
import { Message, MessageAttachment } from 'discord.js';
import { getJSON } from '../../util/requests';
import { getPalette } from '../../services/image.service';
export default class PaletteCommand extends Command {
  constructor() {
    super('palette', {
      aliases: ['palette', 'ptt'],
      category: 'util',
      description: {
        content: 'Send a random beautiful palette'
      },
      ratelimit: 2
    });
  }

  public async exec(msg: Message) {
    const data = await getJSON('http://colormind.io/api/', {
      method: 'POST',
      data: {
        model: 'default'
      }
    });
    if (!data) return;

    const { result: colors } = data;
    const buffer = await getPalette(colors);
    const attachment = new MessageAttachment(buffer, 'palette.png');
    msg.channel.send(msg.author, attachment);
  }
}
