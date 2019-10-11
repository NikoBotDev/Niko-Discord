const { inspect } = require('util');
const { Message, MessageEmbed } = require('discord.js');
const escapeRegex = require('escape-string-regexp');
const { Command } = require('discord-akairo');
const axios = require('axios');
const {
  requests: { getJSON }
} = require('../../util');
const { logger } = require('../../classes');

const nlr = '!!NL!!';
const nlPattern = new RegExp(nlr, 'g');
const FormData = require('form-data');

const fakeToken = 'MzEyAr3zHy0uDuyNaA3Dr3t.4rd3d;.HZxAw9wvn--E8UQWT5aEN8dyYZ0';
module.exports = class EvalCommand extends Command {
  constructor() {
    super('eval', {
      aliases: ['eval', 'e'],
      ownerOnly: true,
      category: 'owner',
      description: {
        content: 'Allow execution of javascript code',
        usage: '[code]'
      },
      args: [
        {
          id: 'script',
          match: 'content',
          prompt: 'What code would you like to evaluate?\n',
          description: 'code to evaluate'
        }
      ]
    });
  }

  /**
   *
   * @param {Message} msg
   * @param {Object} args
   * @param {string} args.script
   */
  async exec(msg, { script }) {
    script = script.replace('exit', 'process.exit()');
    const message = msg;
    const { client } = msg;
    // Run the code and measure its execution time
    let hrDiff;
    try {
      const hrStart = process.hrtime();
      this.lastResult = await eval(script);
      hrDiff = process.hrtime(hrStart);
    } catch (err) {
      return msg.util.reply(`Error while evaluating: \`${err}\``);
    }

    // Prepare for callback time and respond
    this.hrStart = process.hrtime();

    const response = await this.makeResultMessages(
      this.lastResult,
      hrDiff,
      script
    );
    if (!response) return;
    const color =
      message.member && message.member.roles.highest.color !== 0
        ? message.member.roles.highest.color
        : this.client.colors.bot;
    response.setColor(color);
    msg.util.send('', response);
  }

  async makeResultMessages(result, hrDiff, input) {
    const inspected = inspect(result, { depth: 0 })
      .replace(nlPattern, '\n')
      .replace(this.sensitivePattern, fakeToken);
    if (inspected.length > 1500) {
      logger.info(inspected);
      return;
    }
    const data = await getJSON('https://nekos.life/api/neko');
    const embed = new MessageEmbed()
      .setTitle('Evaluated JS')
      .setThumbnail(data ? data.neko : '')
      .setFooter(`Type: ${typeof result}`);
    if (inspected.length >= 1500) {
      const a = await axios.post('https://pastebin.com/api/api_post.php', {
        data: this.createFormData(inspected)
      });
      embed.setDescription(
        `:inbox_tray: Input\n\`\`\`javascript\n${input}\n\`\`\`\n:outbox_tray: Output ${
          hrDiff[0] > 0 ? `${hrDiff[0]}s ` : ''
        }${hrDiff[1] /
          1000000}ms.\n\`\`\`javascript\nOutput is too long and was uploaded to pastebin: ${
          a ? await a.text() : '[Fail]'
        }\n\`\`\``
      );
    } else {
      embed.setDescription(
        `:inbox_tray: Input\n\`\`\`javascript\n${input}\n\`\`\`\n:outbox_tray: Output ${
          hrDiff[0] > 0 ? `${hrDiff[0]}s ` : ''
        }${hrDiff[1] / 1000000}ms.\n\`\`\`javascript\n${inspected}\n\`\`\``
      );
    }
    return embed;
  }

  get sensitivePattern() {
    if (!this._sensitivePattern) {
      const { client } = this;
      let pattern = '';
      if (client.token) pattern += escapeRegex(client.token);
      Object.defineProperty(this, '_sensitivePattern', {
        value: new RegExp(pattern, 'gi')
      });
    }
    return this._sensitivePattern;
  }

  createFormData(string) {
    const form = new FormData();
    form.append('api_option', 'paste');
    form.append('api_dev_key', process.env.PASTEBIN_KEY);
    form.append('api_paste_private', 1);
    form.append('api_paste_name', 'eval_result');
    form.append('api_paste_format', 'javascript');
    form.append('api_paste_code', string);
    return form;
  }
};
