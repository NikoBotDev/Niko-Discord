const {Command, Argument: {validate}} = require('discord-akairo');
const {Message, MessageAttachment} = require('discord.js');
const {requests: {getImage}} = require('../../util');
const {stringify} = require('querystring');
class OsuProfileCommand extends Command {
  constructor() {
    super('osu-profile', {
      aliases: ['osu-profile', 'osup'],
      category: 'search',
      description: {
        content: 'Show a picture with information about a user.',
        usage: '<username> [mode] [(-color|-c) hexCode]',
        examples: ['FlyingTuna standard -c #4286f4'],
      },
      args: [
        {
          id: 'username',
          type: validate('string', username => {
            return /\w+/.test(username);
          }),
          prompt: {
            start: 'What user you want to get profile information?',
            retry: 'The username cannot contain special characters!',
          },
        },
        {
          id: 'mode',
          prompt: {
            start: 'What mode you want to get info for that user?\n (One of the following => standard, taiko, ctb or mania)',
          },
        },
        {
          id: 'color',
          type: 'hexCode',
          match: 'option',
          flag: ['-c', '-color'],
          prompt: {
            retry: 'The color must be a valid hex code eg: #4286f4!',
          },
          default: '#4286f4',
        },
      ],
    });
  }
  /**
  * @param {Message} msg
  * @param {Object} args
  * @param {string} args.username
  * @param {string} args.color
  */
  async exec(msg, {username, color, mode}) {
    const query = stringify({
      colour: `hex${color.replace('#', '')}`,
      uname: username,
      mode: OsuProfileCommand.modeToNumber(mode),
      pp: 0,
      countryrank: '',
      flagstroke: '',
      darktriangles: '',
      avatarrounding: 50,
    });
    const buffer = await getImage(`https://lemmmy.pw/osusig/sig.php?${query}`);
    const attachment = new MessageAttachment(buffer, 'profile.jpg');
    return msg.channel.send(attachment);
  }
  static modeToNumber(mode) {
    switch (mode) {
      case 'std':
      case 'standard':
        return 0;

      case 'taiko':
        return 1;

      case 'ctb':
      case 'catchthebeat':
        return 2;

      case 'mania':
      case 'osu!mania':
        return 3;

      default:
        return 0;
    }
  }
}

module.exports = OsuProfileCommand;