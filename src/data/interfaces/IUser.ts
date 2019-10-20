import { Model } from 'sequelize';
interface PropertyGetterOptions {
  plain: boolean;
}
type PropertyGetter = (options?: PropertyGetterOptions) => IUser | any;
interface IUser {
  userId: string;
  level: number;
  xp: number;
  coins: number;
  married?: string;
  profile_bg: string;
  daily: number;
  badges: string[];
  streak: number;
  get: PropertyGetter;
}

export default IUser;
