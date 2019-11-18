import ms from 'ms';
import formatRelative from 'date-fns/formatRelative';
import { Message } from 'discord.js';
import Niko from '../classes/Client';
function parseTime(relative: number) {
  return ms(relative);
}

async function createTimer(msg: Message, milliseconds: number, of_: string) {
  const calculatedTime = new Date().getTime() + milliseconds;
  const client = msg.client as Niko;
  const { reminders } = client.db.models;
  const reminder = await reminders.create({
    in_: calculatedTime,
    userId: msg.author!.id,
    guildId: msg.guild ? msg.guild.id : null,
    channelId: msg.channel.type !== 'dm' ? msg.channel.id : null,
    of_
  });
  return {
    created: !!reminder,
    relative: reminder ? formatRelative(calculatedTime, new Date()) : null
  };
}

export { parseTime, createTimer };
