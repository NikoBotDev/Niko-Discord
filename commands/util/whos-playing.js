const { Command } = require('discord-akairo');
const { Message, MessageEmbed } = require('discord.js');

class WhosPlayingCommand extends Command {
  constructor() {
    super('whos-playing', {
      aliases: ['whos-playing', 'whpl'],
      category: 'util',
      channel: 'guild',
      args: [
        {
          id: 'game',
          type: 'lowercase',
          match: 'rest',
          prompt: {
            start: 'What game would you like to use as search query?'
          }
        }
      ]
    });
  }

  /**
   * @param {Message} msg
   * @param {Object} args
   */
  exec(msg, { game }) {
    console.log('Hello');
    const members = msg.guild.members.filter(member =>
      this.gameFilter(member, game)
    );
    const stringArray = members.map(
      member => `**${member.displayName}${member.user.tag}**`
    );
    const embed = new MessageEmbed()
      .setColor(this.client.colors.ok)
      .setAuthor("Who's playing", msg.guild.iconURL())
      .setDescription(stringArray.join('\n'))
      .setFooter(msg.author.tag, msg.author.avatarURL())
      .setTimestamp();
    return msg.channel.send(embed);
  }

  gameFilter(member, game) {
    if (
      member.presence.activity &&
      member.presence.activity.name.toLowerCase() === game.toLowerCase()
    ) {
      return true;
    }
    return false;
  }
}

module.exports = WhosPlayingCommand;
