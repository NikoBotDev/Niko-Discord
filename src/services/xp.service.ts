import IUser from '../data/interfaces/IUser';

interface Bounds {
  low: number;
  high: number;
}
/**
 * Calculates necessary xp to the next level
 */
function toNextLevel(
  level: number,
  calcOnly: boolean = false
): Bounds | number {
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

function addRewards(user: IUser): IUser {
  const { xp, coins } = getRewardValues();
  /* eslint-disable */
  user.xp += xp;
  user.coins += coins;
  return user;
  /* eslint-enable */
}

function getXpRewardForLevel(level: number) {
  return 10 * level;
}
export { toNextLevel, getRewardValues, addRewards, getXpRewardForLevel };
