import { Command } from 'discord-akairo';
import { Message, MessageEmbed, User } from 'discord.js';
export default class AvatarCommand extends Command {
  constructor() {
    super('avatar', {
      aliases: ['avatar'],
      category: 'util',
      clientPermissions: ['EMBED_LINKS'],
      ratelimit: 2,
      description: {
        content: "Shows the user's avatar",
        usage: '[user]'
      },
      args: [
        {
          id: 'user',
          type: 'user',
          default: (msg: Message) => msg.author,
          description: 'User to fetch avatar',
          prompt: {
            start: 'What user would you like to get the avatar?\n'
          }
        }
      ]
    });
  }

  public exec(msg: Message, { user }: { user: User }) {
    const embed = new MessageEmbed()
      .setColor(this.client.colors.ok)
      .setDescription(`Avatar for **${user.tag}**`)
      .setImage(
        user.displayAvatarURL({
          format: 'png',
          size: 2048
        })
      );
    msg.util!.send('', embed);
  }
}
