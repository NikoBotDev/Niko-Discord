/**
 * Get user rank based on their index
 * @param {Model[]} rows
 * @param {string} userId
 * @return {number}
 */
function getGlobalRank(rows, userId) {
  return rows.findIndex(row => row.userId === userId) + 1;
}
/**
 * Get user rank based on their index
 * @param {Model[]} rows
 * @param {Message} msg
 * @return {Object[]}
 */
function sortRows(rows, msg) {
  const filtered = rows.filter(row => !!row[msg.guild.id]);
  if (filtered.size === 0) return null;
  return filtered
    .map(row => row[msg.guild.id])
    .sort((a, b) => b.level - a.level || b.xp - a.xp);
}
/**
 * Get all users from database
 * @param {Sequelize} db
 * @return {Model[]}
 */
async function getAllUsers(db) {
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
    order: [['level', 'DESC'], ['xp', 'DESC']]
  });
  return profiles;
}

module.exports = {
  getGlobalRank,
  sortRows,
  getAllUsers
};
