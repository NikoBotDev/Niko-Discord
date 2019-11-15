import { Command } from 'discord-akairo';
import { Message, MessageEmbed, GuildMember } from 'discord.js';

export default class WhosPlayingCommand extends Command {
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

  public exec(msg: Message, { game }: { game: string }) {
    const members = msg.guild!.members.filter((member) =>
      this.gameFilter(member, game)
    );
    const stringArray = members.map(
      (member) => `**${member.displayName}${member.user.tag}**`
    );
    const embed = new MessageEmbed()
      .setColor(this.client.colors.ok)
      .setAuthor("Who's playing", msg.guild!.iconURL() as string)
      .setDescription(stringArray.join('\n'))
      .setFooter(msg.author.tag, msg.author.avatarURL() as string)
      .setTimestamp();
    return msg.channel.send(embed);
  }

  private gameFilter(member: GuildMember, game: string): boolean {
    if (
      member.presence.activity &&
      member.presence.activity.name.toLowerCase() === game.toLowerCase()
    ) {
      return true;
    }
    return false;
  }
}
