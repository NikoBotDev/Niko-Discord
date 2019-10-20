const {
  Command,
  Argument: { validate }
} = require('discord-akairo');
const { MessageEmbed } = require('discord.js');
const { stripIndents, oneLine } = require('common-tags');
const { dirname } = require('path');

class CommandListCommand extends Command {
  constructor() {
    super('commands', {
      aliases: ['commands', 'cmds'],
      category: 'help',
      description: {
        content: oneLine`Shows the command list, pass no args to see the
        list of available categories.`,
        usage: '[category]',
        examples: ['util', '']
      },
      args: [
        {
          id: 'category',
          prompt: {
            start: msg => {
              const embed = this.getGroupList();
              msg.util.send(
                'What group you want to see the commands in?',
                embed
              );
              return Promise.resolve();
            }
          },
          validate: validate('lowercase', category => category !== 'owner'),
          default: ''
        }
      ]
    });
  }

  async exec(msg, { category }) {
    const { modules } = this.handler;
    const commands = modules.filter(mdl => {
      return (
        !dirname(mdl.filepath).includes('subcommands') &&
        this.isAllowed(mdl, category, msg)
      );
    });
    const embed = new MessageEmbed()
      .setColor(this.client.colors.bot)
      .setDescription(__('command.commands.list'))
      .addField(
        category,
        commands.map(mdl => `${this.handler.prefix(msg)}${mdl.id}`).join('\n'),
        true
      )
      .setFooter(__('command.commands.filterMessage'));

    return msg.util.send('', embed);
  }

  getGroupList() {
    const categories = this.handler.categories
      .filter(cat => cat.id !== 'owner')
      .map(cat => `[**${cat.id}**]`);

    const embed = new MessageEmbed()
      .setColor(this.client.colors.bot)
      .setTitle(__('command.commands.groups'))
      .setDescription(
        stripIndents`${categories.join('\n')}\n
            ${__('command.commands.howToSearch')}`
      );
    return embed;
  }

  isAllowed(mdl, category, msg) {
    if (
      mdl.ownerOnly ||
      (mdl.categoryID && mdl.categoryID !== category.toLowerCase())
    ) {
      return false;
    }
    if (mdl.channel === 'guild') {
      if (
        mdl.userPermissions &&
        msg.member.permissions.missing(mdl.userPermissions).length !== 0
      ) {
        return false;
      }
      return true;
    }
    return true;
  }
}

module.exports = CommandListCommand;
