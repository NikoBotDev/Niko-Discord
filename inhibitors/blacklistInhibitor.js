const { Inhibitor } = require('discord-akairo');

class BlacklistInhibitor extends Inhibitor {
  constructor() {
    super('blacklist', {
      reason: 'blacklist',
      type: 'all'
    });
  }

  exec(msg) {
    if (msg.channel.type === 'dm') return false;
    const blacklist = this.client.settings.get(msg.guild.id, 'blacklist', []);
    return blacklist.includes(msg.author.id);
  }
}

module.exports = BlacklistInhibitor;
