const {
  Command,
  Argument: { validate }
} = require('discord-akairo');
const { MessageEmbed } = require('discord.js');
const { UniqueConstraintError } = require('sequelize');
const { oneLine } = require('common-tags');
const axios = require('axios');

const { TWITCH_KEY } = process.env;
const tokens = {
  '{everyone}': '@everyone',
  '{here}': '@here'
};

class TrackStreamCommand extends Command {
  constructor() {
    super('streamAdd', {
      aliases: ['add'],
      category: 'admin',
      clientPermissions: ['EMBED_LINKS'],
      userPermissions: ['MANAGE_GUILD'],
      description: {
        content: 'Start tracking streams for the given twitch user.',
        usage: '<username> <channel> [message]',
        examples: ['niko #streams Hey {everyone}, {user} is streaming!!!']
      },
      args: [
        {
          id: 'username',
          type: 'lowercase',
          prompt: {
            start: 'What user you want to be tracked?\n'
          }
        },
        {
          id: 'channel',
          type: 'channel',
          unordered: [1, 2],
          default: msg => msg.channel
        },
        {
          id: 'message',
          type: validate('string', msg => {
            return msg.length < 1000;
          }),
          match: 'phrase',
          unordered: [1, 2]
        }
      ]
    });
  }

  async exec(msg, { username, channel, message }) {
    const res = await axios.get(this.getUrl(username));
    if (res.status !== 200) {
      return msg.reply(__('command.track-stream+add+doNotExists'));
    }
    try {
      await this.client.db.streams.create({
        username,
        channelId: channel.id,
        guildId: msg.guild.id,
        message: message
          ? TrackStreamCommand.replaceTokens(message, username)
          : null
      });
    } catch (err) {
      if (err instanceof UniqueConstraintError) {
        return msg.reply(__('command.track-stream+add+alreadyBeingTracked'));
      }
    }
    const embed = new MessageEmbed()
      .setColor(this.client.colors.ok)
      .setDescription(
        __('command.track-stream+add+success', {
          username,
          channel: channel.toString(),
          message
        })
      );
    return msg.util.send(embed);
  }

  getUrl(username) {
    return `https://api.twitch.tv/kraken/channels/${encodeURIComponent(
      username
    )}?client_id=${TWITCH_KEY}`;
  }

  static replaceTokens(message, username) {
    return message.replace(
      /{everyone}|{here}|{user}/gi,
      match => tokens[match] || username
    );
  }
}

module.exports = TrackStreamCommand;
