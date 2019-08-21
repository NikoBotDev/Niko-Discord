const {Command, Argument: {range, union}} = require('discord-akairo');
const {Message, MessageEmbed, GuildMember} = require('discord.js');
const {oneLine} = require('common-tags');
class PurgeCommand extends Command {
  constructor() {
    super('purge', {
      aliases: ['purge'],
      category: 'admin',
      description: {
        content: oneLine`Purge x amount of messages you can use the following types:
                me, command, bot, all or member mention and you can add the -fp flag to filter
                pinned (hyper important) messages from the channel.`,
        usage: '<amount> [type] [-fp flag]',
        examples: [
          '10 me|command|bot|all|@member [-fp]',
          '10 me -fp',
        ],
      },
      ratelimit: 2,
      clientPermissions: ['MANAGE_MESSAGES'],
      userPermissions: ['MANAGE_MESSAGES'],
      args: [
        {
          id: 'amount',
          type: range('integer', 5, 100),
          prompt: {
            start: 'How many messages you want to be deleted?\n',
            retry: 'This isn\'t a valid amount, the range must be 5 ~ 100',
          },
        },
        {
          id: 'type',
          type: union('lowercase', 'memberMention'),
          default: 'all',
        },
        {
          id: 'filterPinned',
          match: 'flag',
          flag: ['-fp', '-filterpinned'],
        },
      ],
    });
  }
  /**
     * @param {Message} msg
     * @param {Object} args
     * @param {number} args.amount
     * @param {GuildMember|string} args.type
     */
  async exec(msg, {amount, type, filterPinned}) {
    let messages = await msg.channel.messages.fetch({limit: amount + 1});
    let filter = null;
    if (filterPinned) {
      messages = messages.filter(m => !m.pinned);
    }
    switch (type) {
      case 'me':
        filter = m => m.author.id === msg.author.id;
        break;
      case 'command':
        filter = m => m.content.startsWith(this.handler.prefix(msg));
        break;
      case 'bot':
        filter = m => m.author.bot;
        break;
      case 'all':
        filter = null;
        break;
      default:
        filter = m => m.author.id === msg.mentions.members.first().id;
    }
    messages = filter ? messages.filter(filter) : messages;
    await msg.channel.bulkDelete(messages, true);
    const embed = new MessageEmbed()
        .setColor(this.client.colors.ok)
        .setDescription(
          __('command.purge.removed', { amount: messages.size })
        )
        .setFooter(__('command.purge.removedIn'));
    const res = await msg.util.send(embed);
        res.deletable ? res.delete({timeout: 5e3}) : null;
  }
}

module.exports = PurgeCommand;