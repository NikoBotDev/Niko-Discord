const {
  Command,
  Argument: { validate }
} = require('discord-akairo');
const { oneLine } = require('common-tags');

class TrackStreamCommand extends Command {
  constructor() {
    super('track-stream', {
      aliases: ['track-stream', 'tstrm'],
      category: 'admin',
      clientPermissions: ['EMBED_LINKS'],
      userPermissions: ['MANAGE_GUILD'],
      description: {
        content: oneLine`Add or remove a stream from tracking and lists all the
                streams that are being tracked in this channel`,
        usage: '<add|remove|list> *args*]',
        examples: [
          'add niko #streams Hey {everyone}, {user} is streaming!!!',
          'remove niko #streams',
          'list'
        ]
      },
      args: [
        {
          id: 'type',
          type: validate('lowercase', type => {
            return ['add', 'remove', 'list'].includes(type);
          }),
          prompt: {
            start: oneLine`You want to \`remove\` or \`add\` a user?
                        You can also use \`list\` to list all the users being tracked in this channel.`
          }
        },
        {
          id: 'args',
          match: 'rest',
          prompt: {
            start: (_, { type }) => {
              if (type === 'add') {
                return 'Please type a user, channel and a optional message for tracking\n';
              }
              return 'Please type a user and channel that you want to remove the tracking\n';
            },
            optional: true
          },
          default: ''
        }
      ]
    });
  }

  async exec(msg, { type, args }) {
    const command = this.handler.modules.get(
      {
        add: 'streamAdd',
        remove: 'streamRemove',
        list: 'stream-list'
      }[type]
    );
    return this.handler.handleDirectCommand(msg, args, command);
  }
}

module.exports = TrackStreamCommand;
