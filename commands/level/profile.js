const {Command} = require('discord-akairo');
const {Message, MessageAttachment} = require('discord.js');
const {profiles} = require('../../services');
class ProfileCommand extends Command {
  constructor() {
    super('profile', {
      aliases: ['profile'],
      category: 'level',
      cooldown: 20000,
      clientPermissions: ['EMBED_LINKS'],
      description: {
        content: '',
      },
      args: [
        {
          id: 'member',
          type: 'member',
          default: msg => msg.member
        }
      ]
    });
  }
  /**
     * @param {Message} msg
     */
  async exec(msg, {member}) {
    const [user] = await this.client.db.profiles.findOrBuild({
      where: {
        userId: member.id
      }
    });
    const image = await profiles.getImageFor(user, member, msg);
    const attachment = new MessageAttachment(image, `${msg.author.id}_profile.png`);
    return msg.channel.send(attachment);
  }
}

module.exports = ProfileCommand;