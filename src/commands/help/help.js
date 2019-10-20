const {
  Command,
  Argument: { union }
} = require('discord-akairo');
const { MessageEmbed } = require('discord.js');
const { stringify } = require('querystring');

class HelpCommand extends Command {
  constructor() {
    super('help', {
      aliases: ['help', 'h'],
      category: 'help',
      description: {
        content:
          'Displays a list of available commands, or detailed information for a specified command.',
        usage: '[command]'
      },
      ratelimit: 2,
      clientPermissions: ['EMBED_LINKS'],
      args: [
        {
          id: 'command',
          description: 'Command to get info about',
          type: union('command', 'commandAlias')
        }
      ]
    });
  }

  exec(msg, { command }) {
    const prefix = this.handler.prefix(msg);
    if (!command) {
      const query = stringify({
        client_id: this.client.user.id,
        permissions: 379904,
        scope: 'bot'
      });
      const url = `https://discordapp.com/oauth2/authorize?${query}`;
      const embed = new MessageEmbed()
        .setColor(this.client.colors.ok)
        .setAuthor(msg.author.username, msg.author.displayAvatarURL())
        .setDescription(
          __('commands.help.helpMessage', {
            userUsername: msg.author.username,
            botUsername: this.client.user.username,
            oauthUrl: url,
            supportServerInvite: 'https://www.google.com.br/'
          })
        )
        .setFooter(
          this.client.user.username,
          this.client.user.displayAvatarURL()
        );
      return msg.util.send(embed);
    }

    const embed = new MessageEmbed()
      .setColor(this.client.colors.bot)
      .setTitle(
        `\`${command.aliases[0]} ${
          command.description.usage ? command.description.usage : ''
        }\``
      )
      .addField(
        __('commands.help.commandDescription'),
        command.description.content || '\u200b'
      );

    if (command.aliases.length > 1)
      embed.addField(
        __('commands.help.commandAliases'),
        `\`${command.aliases.join('` `')}\``,
        true
      );
    if (command.description.examples && command.description.examples.length)
      embed.addField(
        __('commands.help.commandExamples'),
        `\`${prefix + command.aliases[0]} ${command.description.examples.join(
          `\`\n\`${prefix + command.aliases[0]} `
        )}\``,
        true
      );

    return msg.util.send(embed);
  }
}

module.exports = HelpCommand;
