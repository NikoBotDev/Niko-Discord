const {Command} = require('discord-akairo');
const {Message} = require('discord.js');
const {exec} = require('child_process');
class ExecuteCommand extends Command {
  constructor() {
    super('exec', {
      aliases: ['exec', 'sudo'],
      category: 'owner',
      ownerOnly: true,
      description: {
        content: 'Allow execution of bash code',
        usage: '[code]',
      },
      args: [
        {
          id: 'bash',
          type: 'string',
          match: 'content',
          prompt: {
            start: 'What script you want to be executed?\n',
          },
        },
      ],
    });
  }
  /**
     * @param {Message} msg
     * @param {Object} args
     * @param {string} bash
     */
  async exec(msg, {bash}) {
    try {
      const result = await this.executeScript(bash);
      return msg.util.send(`➡ Input: \`\`\`${bash}\`\`\` \n✅ Output:\n\`\`\`${result}\`\`\``);
    } catch (err) {
      return msg.util.send(`➡ Input: \`\`\`${bash}\`\`\` \n❌ Output:\n\`\`\`${err}\`\`\``);
    }
  }
  executeScript(code) {
    return new Promise((resolve, reject) => {
      exec(code, (error, stdout, stderr) => {
        if (error) reject(`error: ${error}\n\n${stderr}`);
        resolve(stdout);
      });
    });
  }
}

module.exports = ExecuteCommand;