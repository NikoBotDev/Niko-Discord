import IUser from '../data/interfaces/IUser';
import { Message } from 'discord.js';
import { Sequelize } from 'sequelize';
/**
 * Get user rank based on their index
 * @param {Model[]} rows
 * @param {string} userId
 * @return {number}
 */
function getGlobalRank(rows: IUser[], userId: string): number {
  return rows.findIndex((row) => row.userId === userId) + 1;
}
/**
 * Get user rank based on their index
 */
function sortRows(rows: any, msg: Message) {
  const filtered = rows.filter((row: any) => !!row![msg.guild!.id]);
  if (filtered.size === 0) return null;
  return filtered
    .map((row: any) => row![msg.guild!.id])
    .sort((a: any, b: any) => b.level - a.level || b.xp - a.xp);
}
/**
 * Get all users from database
 */
async function getAllUsers(db: any) {
  const profiles = await db.profiles.findAll({
    attributes: [
      'userId',
      'xp',
      'level',
      'coins',
      'married',
      'profile_bg',
      'badges'
    ],
    order: [
      ['level', 'DESC'],
      ['xp', 'DESC']
    ]
  });
  return profiles;
}

export { getGlobalRank, sortRows, getAllUsers };
