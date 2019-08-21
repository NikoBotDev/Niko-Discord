'use strict';

const { Canvas } = require('canvas-constructor');
const { readFile } = require('fs-nextra');
const { join } = require('path');
const { getImage } = require('../util/requests');
const exp = require('./xp.service');
const rank = require('./rank.service');

const basePath = join(process.cwd(), 'data', 'resources');

/**
 * @param {string} entireTag Discord tag eg: User#0000
 * @return {string} fixed string
 */
function shortName(entireTag) {
  if (entireTag.length > 7) {
    return `${entireTag.substring(0, 7)}...`;
  }
  return entireTag;
}
// eslint-disable-next-line
function getGlobalRank(users, userId) {
  const globalRank = users.findIndex(user => user.userId === userId);
  if (globalRank === -1) return 'Unknown';
  return globalRank;
}
// Taken from https://goo.gl/5iqP8v
/**
 * Format a number as 2.5K if a thousand or more
 * @param {number} num
 * @param {?number} [decimals=1]
 * @return {string|number}
 */
function kFormatter(num, decimals = 1) {
  return num > 999 ? `${(num / 1000).toFixed(decimals)}k` : num;
}

function fontFile(name) {
  return join(basePath, 'fonts', name);
}

/**
 *
 * @param {Sequelize.Model} data
 * @param {Message} msg
 */
async function getImageFor(data, member, msg) {
  Canvas.registerFont(fontFile('Roboto.ttf'), { family: 'Roboto' });
  Canvas.registerFont(fontFile('NotoEmoji-Regular.ttf'), { family: 'Roboto' });
  Canvas.registerFont(fontFile('Roboto-Bold.ttf'), { family: 'RbtB' });
  const { client } = msg;
  const users = await rank.getAllUsers(client.db);
  // let guildRank = sortRows(client.levels.fetchEverything(), msg);
  // guildRank = guildRank.findIndex((row) => row.userId === user.id);
  const marryUser = data.married
    ? await client.users.fetch(data.married)
    : null;
  const marryName = marryUser ? shortName(marryUser.tag) : '';
  const { coins, xp, level, userId, profile_bg } = data.get({ plain: true });
  const calculated = exp.toNextLevel(level, true);
  const globalRank = rank.getGlobalRank(users, userId);
  const canvas = new Canvas(520, 318);
  const barSize = Math.PI * 2 * Math.min(Math.max(0, xp / calculated || 1), 1);
  const bg = await readFile(join(basePath, 'backgrounds', `${profile_bg}.png`));
  const avatar = await getImage(
    member.user.displayAvatarURL({ format: 'png', size: 1024 })
  );
  const generate = async () => {
    canvas
      .addImage(bg, 0, 0, 520, 318)
      .scale(1, 1)
      .setPatternQuality('bilinear')
      .setAntialiasing('subpixel')
      .setTextAlign('left')
      // Add XP Data
      .setTextFont('15px RbtB')
      .setColor('#FFFFFF')
      .addText(`${xp}/${calculated}`, 255, 155)
      // Add Level
      .setTextFont('30px RbtB')
      .setColor('#333333')
      .addText(level, 105, 205)
      // Add Rank Data
      .setTextFont('14px RbtB')
      .setColor('#707070')
      .addText(kFormatter(globalRank), 140, 254)
      .addText(1, 140, 286)
      // Add Coins Amount
      .addText(kFormatter(coins, 2), 369, 253)
      // Add married user tag
      .addText(marryName, 375, 283)
      .save()
      // Draw xp bar
      .translate(318 / 2, 318 / 2)
      .rotate((-1 / 2 + 0 / 180) * Math.PI)
      .beginPath()
      .arc(85, 100, 53, 0, barSize, false)
      .setStroke('#30bae7')
      .setLineCap('round')
      .setLineWidth(5)
      .stroke()
      // Draw the user avatar
      .restore()
      .beginPath()
      .arc(260, 75, 51, 0, Math.PI * 2, true)
      .closePath()
      .clip()
      .setShadowBlur(5)
      .setShadowColor('rgba(0, 0, 0, 0.2)')
      .addImage(avatar, 208, 23, 105, 105);
    return canvas.toBufferAsync();
  };
  const buffer = await generate();
  return buffer;
}

module.exports = {
  getImageFor
};
