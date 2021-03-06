'use strict';
import Niko from '../classes/Client';
import { Message, GuildMember } from 'discord.js';
import { Canvas } from 'canvas-constructor';
import { readFile } from 'fs-nextra';
import { join } from 'path';
import { getImage } from '../util/requests';
import * as exp from './xp.service';
import * as rank from './rank.service';
import IUser from '../data/interfaces/IUser';
const basePath = join(process.cwd(), 'data', 'resources');

function shortName(entireTag: string): string {
  if (entireTag.length > 7) {
    return `${entireTag.substring(0, 7)}...`;
  }
  return entireTag;
}
// eslint-disable-next-line
function getGlobalRank(users: IUser[], userId: string): number | string {
  const globalRank = users.findIndex((user) => user.userId === userId);
  if (globalRank === -1) return 'Unknown';
  return globalRank;
}
// Taken from https://goo.gl/5iqP8v
/**
 * Format a number as 2.5K if a thousand or more
 */
function kFormatter(num: number, decimals = 1) {
  return num > 999 ? `${(num / 1000).toFixed(decimals)}k` : num;
}

function fontFile(name: string): string {
  return join(basePath, 'fonts', name);
}

/**
 *
 * @param {Sequelize.Model} data
 * @param {Message} msg
 */
async function getImageFor(data: IUser, member: GuildMember, msg: Message) {
  Canvas.registerFont(fontFile('Roboto.ttf'), { family: 'Roboto' });
  Canvas.registerFont(fontFile('NotoEmoji-Regular.ttf'), { family: 'Roboto' });
  Canvas.registerFont(fontFile('Roboto-Bold.ttf'), { family: 'RbtB' });
  const client: Niko = msg.client as Niko;
  const users = await rank.getAllUsers(client.db);
  // let guildRank = sortRows(client.levels.fetchEverything(), msg);
  // guildRank = guildRank.findIndex((row) => row.userId === user.id);
  const marryUser = data.married
    ? await client.users.fetch(data.married)
    : null;
  data.get;
  const marryName = marryUser ? shortName(marryUser.tag) : '';
  const { coins, xp, level, userId, profile_bg } = data.get({
    plain: true
  }) as IUser;
  const calculated = exp.toNextLevel(level, true) as number;
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
      .addText(level.toString(), 105, 205)
      // Add Rank Data
      .setTextFont('14px RbtB')
      .setColor('#707070')
      .addText(<string>kFormatter(globalRank), 140, 254)
      .addText('1', 140, 286)
      // Add Coins Amount
      .addText(<string>kFormatter(coins, 2), 369, 253)
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
      .addImage(avatar as Buffer, 208, 23, 105, 105);
    return canvas.toBufferAsync();
  };
  const buffer = await generate();
  return buffer;
}

export { getImageFor };
