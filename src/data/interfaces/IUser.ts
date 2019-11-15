import { Model } from 'sequelize';
interface IUser extends Model {
  userId: string;
  level: number;
  xp: number;
  coins: number;
  married?: string;
  profile_bg: string;
  daily: number;
  badges: string[];
  streak: number;
}

export default IUser;
