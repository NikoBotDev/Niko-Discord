import { Listener } from 'discord-akairo';
import { DiscordAPIError, TextChannel } from 'discord.js';
import { Op, Model } from 'sequelize';
import addMinutes from 'date-fns/addMinutes';
import logger from '../../classes/Logger';
import {
  getStreamData,
  getAlertEmbed,
  getOfflineEmbed
} from '../../util/streams';

function fallback() {
  /* empty */
}

export default class ReadyListener extends Listener {
  constructor() {
    super('ready', {
      emitter: 'client',
      event: 'ready',
      category: 'client'
    });
  }

  public exec() {
    const botUser = this.client.user;
    logger.info(`[READY STATE - USER: ${botUser!.tag}]`);
    this.client.user!.setActivity(`@${botUser!.username} help`);
    setInterval(this.checkMutes.bind(this), 6e4);
    setInterval(this.checkStreams.bind(this), 3e5);
    setInterval(this.checkReminders.bind(this), 3e4);
  }

  private async checkStreams() {
    const streams = await this.client.db.streams.findAll();
    if (streams.length === 0) return;
    const promises: Array<Promise<any>> = [];
    streams.forEach(async (stream: Model) => {
      try {
        const guild = this.client.guilds.get(stream.get('guildId') as string);
        const channel = guild
          ? (guild.channels.get(stream.get(
              'channelId'
            ) as string) as TextChannel)
          : null;
        if (!channel) return;
        const data = await getStreamData(stream.get('username') as string);
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
            stream.get('username') as string,
            this.client.colors.error
          );
          channel.send(embed).catch(fallback);
        }
      } catch (err) {
        if (!(err instanceof DiscordAPIError)) logger.error(err);
        stream.destroy();
      }
    });
    Promise.all(promises).catch((e) => logger.error(e.message));
  }

  private async checkMutes() {
    const mutes = await this.client.db.mutes.findAll({
      where: {
        endDate: {
          [Op.lte]: new Date()
        }
      }
    });
    if (mutes.length === 0) return;
    mutes.forEach((mute: Model) => {
      try {
        const guild = this.client.guilds.get(mute.get('guildId') as string);
        if (!guild) throw new Error('');
        const member = guild.members.get(mute.get('userId') as string);
        const muteRoleId = this.client.settings.get(
          guild.id,
          'muteRoleId',
          ''
        ) as string;
        const role = guild.roles.get(muteRoleId);
        if (!muteRoleId) throw new Error('');
        if (!role || !role.editable) throw new Error('');
        if (member) member.roles.remove(role);
        mute.destroy();
      } catch (err) {
        mute.destroy();
      }
    });
  }

  private async checkReminders() {
    const expiredReminders: Model[] = await this.client.db.reminders.findAll({
      where: {
        in_: {
          [Op.lte]: new Date()
        }
      }
    });
    if (expiredReminders.length === 0) return;
    expiredReminders.forEach((reminder) => {
      const { of_, userId, channelId, guildId } = reminder.get({
        plain: true
      }) as any;
      const user = this.client.users.get(userId);
      if (!channelId && user) {
        user.send(`You wanted me to remind you of: *${of_}*`).catch(fallback);
      } else {
        const guild = this.client.guilds.get(guildId);
        const channel = guild
          ? (guild.channels.get(channelId) as TextChannel)
          : null;
        if (guild && channel) {
          channel.send(`${user}, You wanted me to remind you of: ${of_}`);
        }
      }
      reminder.destroy();
    });
  }
}
