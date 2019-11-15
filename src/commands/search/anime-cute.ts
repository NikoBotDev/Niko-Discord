import { Command } from 'discord-akairo';
import { Message, MessageEmbed } from 'discord.js';
import { stringify } from 'querystring';
import { requests } from '../../util';
export default class MoeCommand extends Command {
  constructor() {
    super('anime-cute', {
      aliases: ['anime-cute', 'moe', 'cute', 'acte'],
      category: 'search',
      description: {
        content: 'Get a random hyper super duper cute image from awwnime',
        usage: '<tags>'
      },
      args: [
        {
          id: 'tags',
          match: 'separate',
          type: (_: Message, phrase: string) => {
            return phrase.split(' ');
          },
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
    const images = await requests.getJSON(this.getUrl(tags));
    if (!images || images.length === 0) {
      return msg.reply('No images found');
    }
    const image = images[Math.floor(Math.random() * images.length)].cdnUrl;
    const embed = new MessageEmbed()
      .setColor(this.client.colors.ok)
      .setAuthor(msg.author.tag, msg.author.displayAvatarURL())
      .setDescription(tags.join(', '))
      .setImage(image)
      .setFooter('Powered by Awwnime');
    msg.util!.send(embed);
  }

  private getUrl(tags: string[]) {
    const query = stringify({
      limit: 100,
      q: tags.join(' ')
    });
    return `https://awwnime.redditbooru.com/images/?${query}`;
  }
}
