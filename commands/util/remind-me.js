const {Command, Argument: {validate}} = require('discord-akairo');
const {Message, MessageEmbed} = require('discord.js');
const {createTimer, parseTime} = require('../../services/remind.service');
class RemindMeCommand extends Command {
  constructor() {
    super('remind-me', {
      aliases: ['remind-me'],
      category: 'util',
      description: {
        content: 'Create a reminder'
      },
      args: [
        {
          id: 'time',
          type: validate('string', (_, time) => {
            if (!parseTime(time)) return false;
            return true;
          }),
          prompt: {
            start: 'What\'s the relative time that this reminder will be sent? Eg: 1d',
            retry: 'You provided an invalid time, please try again!'
          }
        },
        {
          id: 'of_',
          match: 'rest',
          type: validate('string', (_, of_) => {
            if (of_.length > 1000) return false;
            return true;
          }),
          prompt: {
            start: 'What you want to me reminded of?\n',
            retry: 'The message length should be less than 1000 characters!'
          }
        }
      ]
    });
  }
  /**
     * @param {Message} msg
     * @param {Object} args
     * @param {string} args.time
     * @param {string} args.of_
     */
  async exec(msg, {time, of_}) {
    const milliseconds = parseTime(time);
    const {created, relative} = await createTimer(msg, milliseconds, of_);
    if (!created) {
      return msg.util.reply('An error occurred while making the timer...');
    }
    return msg.util.reply(`Alright, i'll remind you of *${of_}* **${relative}**`);
  }
}

module.exports = RemindMeCommand;