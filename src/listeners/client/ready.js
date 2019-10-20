const { Listener } = require('discord-akairo');
const { DiscordAPIError } = require('discord.js');
const { Op } = require('sequelize');
const { addMinutes } = require('date-fns');
const { logger } = require('../../classes');
const {
  Streams: { getStreamData, getAlertEmbed, getOfflineEmbed }
} = require('../../util');

function fallback() {
  /* empty */
}

class ReadyListener extends Listener {
  constructor() {
    super('ready', {
      emitter: 'client',
      event: 'ready',
      category: 'client'
    });
  }

  exec() {
    const {
      user,
      user: { tag }
    } = this.client;
    logger.info(`[READY STATE - USER: ${tag}]`);
    this.client.user.setActivity(`@${user.username} help`);
    setInterval(this.checkMutes.bind(this), 6e4);
    setInterval(this.checkStreams.bind(this), 3e5);
    setInterval(this.checkReminders.bind(this), 3e4);
  }

  async checkStreams() {
    const streams = await this.client.db.streams.findAll();
    if (streams.length === 0) return;
    const promises = [];
    streams.forEach(async stream => {
      try {
        const guild = this.client.guilds.get(stream.get('guildId'));
        const channel = guild
          ? guild.channels.get(stream.get('channelId'))
          : null;
        if (!channel) return;
        const data = await getStreamData(stream.get('username'));
        if (!data) return;
        if (
          data.stream &&
          data.stream.stream_type === 'live' &&
          stream.get('streaming') === false
        ) {
          promises.push(
            stream.update({
              streaming: true,
              startedAt: addMinutes(new Date(), 3)
            })
          );
          const embed = getAlertEmbed(data);
          channel
            .send(stream.get('message') || '', {
              embed,
              disableEveryone: false
            })
            .catch(fallback);
        } else if (!data.stream && stream.get('streaming') === true) {
          promises.push(stream.update({ streaming: false }));
          const embed = getOfflineEmbed(
            stream.get('username'),
            this.client.colors.error
          );
          channel.send(embed).catch(fallback);
        }
      } catch (err) {
        if (!(err instanceof DiscordAPIError)) logger.error(err);
        stream.destroy();
      }
    });
    Promise.all(promises).catch(e => logger.error(e.message));
  }

  async checkMutes() {
    const mutes = await this.client.db.mutes.findAll({
      where: {
        endDate: {
          [Op.lte]: new Date()
        }
      }
    });
    if (mutes.length === 0) return;
    mutes.forEach(mute => {
      try {
        const guild = this.client.guilds.get(mute.get('guildId'));
        if (!guild) throw new Error('');
        const member = guild.members.get(mute.get('userId'));
        const muteRoleId = this.client.settings.get(guild.id, 'muteRoleId');
        const role = guild.roles.get(muteRoleId);
        if (!muteRoleId) throw new Error('');
        if (!role.editable) throw new Error('');
        member.roles.remove(role).catch(fallback);
        mute.destroy();
      } catch (err) {
        mute.destroy();
      }
    });
  }

  async checkReminders() {
    const expiredReminders = await this.client.db.reminders.findAll({
      where: {
        in_: {
          [Op.lte]: new Date()
        }
      }
    });
    if (expiredReminders.length === 0) return;
    expiredReminders.forEach(reminder => {
      const { of_, userId, channelId, guildId } = reminder.get({ plain: true });
      const user = this.client.users.get(userId);
      if (!channelId) {
        user.send(`You wanted me to remind you of: *${of_}*`).catch(fallback);
      } else {
        const guild = this.client.guilds.get(guildId);
        const channel = guild ? guild.channels.get(channelId) : null;
        channel
          .send(`${user}, You wanted me to remind you of: ${of_}`)
          .catch(fallback);
      }
      reminder.destroy();
    });
  }
}

module.exports = ReadyListener;
