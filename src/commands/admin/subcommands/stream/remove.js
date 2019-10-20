const {Command} = require('discord-akairo');
const {Message, MessageEmbed, GuildChannel} = require('discord.js');
class RemoveStreamCommand extends Command {
  constructor() {
    super('streamRemove', {
      aliases: ['remove'],
      category: 'admin',
      clientPermissions: ['EMBED_LINKS'],
      userPermissions: ['MANAGE_GUILD'],
      description: {
        content: 'Remove a user that\'s being tracked in the given channel.',
        usage: '<username> <channel>',
        examples: ['niko #streams'],
      },
      args: [
        {
          id: 'username',
          type: 'lowercase',
          prompt: {
            start: 'What user you want to be removed from tracking?\n',
          },
        },
        {
          id: 'channel',
          type: 'channel',
          prompt: {
            start: (_, {username}) => `What channel you want to remove the tracking for \`${username}\`?\n`,
          },
        },
      ],
    });
  }
  /**
     * @param {Message} msg
     * @param {Object} args
     * @param {string} args.username
     * @param {GuildChannel} args.channel
     */
  async exec(msg, {username, channel}) {
    const destroyed = await this.client.db.streams.destroy({
      where: {
        username,
        channelId: channel.id,
      },
    });
    if (destroyed === 1) {
      const embed = new MessageEmbed()
          .setColor(this.client.colors.ok)
          .setDescription(
              `\`${username}\` is no longer being tracked in ${channel}`
          );
      return msg.util.send(embed);
    }
    return msg.reply('That user isn\'t being tracked in this channel!');
  }
}

module.exports = RemoveStreamCommand;