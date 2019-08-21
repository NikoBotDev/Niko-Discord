/**
 * High and low bounds from xp calculations
 * @typedef {Object} Bounds
 * @property {number} high
 * @property {number} low
 */
/**
 * Calculates necessary xp to the next level
 * @param {number} level
 * @param {?boolean} calcOnly
 * @return {Bounds|number}
 */
function toNextLevel(level, calcOnly = false) {
  const high = Math.ceil((level / 0.3) ** 2.55);
  const low = Math.ceil(((level - 0.3) / 0.3) ** 2.55);
  if (calcOnly) return high - low;
  return {
    high,
    low
  };
}

function getRewardValues() {
  return {
    xp: Math.floor(Math.random() * 6),
    coins: Math.floor(Math.random() * 6)
  };
}

function addRewards(user) {
  const { xp, coins } = getRewardValues();
  /* eslint-disable */
  user.xp += xp;
  user.coins += coins;
  return user;
  /* eslint-enable */
}

function getXpRewardForLevel(level) {
  return 10 * level;
}
module.exports = {
  toNextLevel,
  getRewardValues,
  addRewards,
  getXpRewardForLevel
};
