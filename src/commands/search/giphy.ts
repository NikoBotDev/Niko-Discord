import { Command } from 'discord-akairo';
import { Message, MessageEmbed } from 'discord.js';
import { stringify } from 'querystring';
import { oneLine } from 'common-tags';
import { getJSON } from '../../util/requests';
const { GIPHY_KEY } = process.env;
export default class GiphyCommand extends Command {
  constructor() {
    super('giphy', {
      aliases: ['giphy', 'gpy'],
      category: 'search',
      description: {
        content: oneLine`Get a random gif from giphy which
                can or not be related to te given tags`,
        usage: '<tags>'
      },
      args: [
        {
          id: 'tags',
          match: 'separate',
          prompt: {
            start: [
              'What tags you want to search?\n',
              'Type `stop` when you are done.'
            ],
            infinite: true
          }
        }
      ]
    });
  }

  public async exec(msg: Message, { tags }: { tags: string[] }) {
    const offset = Math.floor(Math.random() * 4 + 1);
    const query = stringify({
      q: tags.join(' '),
      api_key: GIPHY_KEY,
      limit: 30,
      offset
    });
    let gifs = await getJSON(`http://api.giphy.com/v1/gifs/search?${query}`);
    if (!gifs || gifs.data.length === 0) return;
    gifs = gifs.data;
    const index = Math.floor(Math.random() * gifs.length);
    const gif = gifs[index];
    const embed = new MessageEmbed()
      .setColor(this.client.colors.ok)
      .setAuthor(msg.author.tag, msg.author.displayAvatarURL())
      .setImage(gif.images.original.url)
      .setFooter('Powered by Giphy api');
    return msg.util!.send(embed);
  }
}
