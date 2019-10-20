const Mute = (sequelize, DataTypes) => {
  return sequelize.define(
    'mutes',
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        unique: true,
        defaultValue: DataTypes.UUIDV4
      },
      userId: DataTypes.STRING,
      modId: DataTypes.STRING,
      guildId: DataTypes.STRING,
      endDate: DataTypes.DATE
    },
    {
      indexes: [
        {
          name: 'mute_guildId_userId',
          unique: true,
          fields: ['userId', 'guildId']
        }
      ]
    }
  );
};

module.exports = Mute;
