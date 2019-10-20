const { Command } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');

class AvatarCommand extends Command {
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
          default: msg => msg.author,
          description: 'User to fetch avatar',
          prompt: {
            start: 'What user would you like to get the avatar?\n'
          }
        }
      ]
    });
  }

  exec(msg, { user }) {
    const embed = new MessageEmbed()
      .setColor(this.client.colors.ok)
      .setDescription(`Avatar for **${user.tag}**`)
      .setImage(
        user.displayAvatarURL({
          format: 'png',
          size: 2048
        })
      );
    msg.util.send('', embed);
  }
}

module.exports = AvatarCommand;
