const ms = require('ms');
const formatRelative = require('date-fns/formatRelative');

function parseTime(relative) {
  return ms(relative);
}

async function createTimer(msg, milliseconds, of_) {
  const calculatedTime = new Date().getTime() + milliseconds;
  const { reminders } = msg.client.db.models;
  const reminder = await reminders.create({
    in_: calculatedTime,
    userId: msg.author.id,
    guildId: msg.guild ? msg.guild.id : null,
    channelId: msg.channel.type !== 'dm' ? msg.channel.id : null,
    of_
  });
  return {
    created: !!reminder,
    relative: reminder ? formatRelative(calculatedTime, new Date()) : null
  };
}

module.exports = {
  parseTime,
  createTimer
};
