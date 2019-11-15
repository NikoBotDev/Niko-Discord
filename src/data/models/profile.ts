import { Sequelize, DataTypes as DT } from 'sequelize';
const Profiles = (sequelize: Sequelize, DataTypes: typeof DT) => {
  return sequelize.define(
    'profiles',
    {
      userId: {
        type: DataTypes.TEXT,
        unique: true,
        primaryKey: true
      },
      level: {
        type: DataTypes.INTEGER,
        defaultValue: 1
      },
      xp: {
        type: DataTypes.INTEGER,
        defaultValue: 1
      },
      coins: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        validate: {
          min: 0
        }
      },
      married: DataTypes.TEXT({ length: 'tiny' }),
      profile_bg: {
        type: DataTypes.STRING,
        defaultValue: 'default'
      },
      daily: {
        type: DataTypes.INTEGER,
        defaultValue: 0
      },
      badges: {
        type: DataTypes.JSON,
        defaultValue: []
      },
      streak: {
        type: DataTypes.INTEGER({ length: 1 }),
        defaultValue: 0
      }
    },
    {
      timestamps: false,
      scopes: {
        rank: {
          attributes: ['userId', 'xp', 'level', 'coins'],
          order: [['level', 'DESC'], ['xp', 'DESC']]
        }
      }
    }
  );
};
export default Profiles;
