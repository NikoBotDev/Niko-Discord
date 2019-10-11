const { Command } = require('discord-akairo');

class AvatarCommand extends Command {
  constructor() {
    super('choice', {
      aliases: ['choice'],
      category: 'util',
      description: {
        content: 'Choose between things',
        usage: '<things>',
        examples: ['one|two|three']
      },
      args: [
        {
          id: 'choices',
          type: 'string',
          description: 'Available choices',
          prompt: {
            start: 'What will be the available choices?\n'
          }
        }
      ]
    });
  }

  exec(msg, { choices }) {
    const availableChoices = choices.split('|');
    if (availableChoices.length === 1) return;
    const choice =
      availableChoices[Math.floor(Math.random() * availableChoices.length)];
    msg.util.send(`I chose **${choice}**`);
  }
}

module.exports = AvatarCommand;
