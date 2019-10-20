const Streams = (sequelize, DataTypes) => {
  return sequelize.define(
    'streams',
    {
      id: {
        type: DataTypes.INTEGER,
        unique: true,
        autoIncrement: true,
        primaryKey: true
      },
      channelId: DataTypes.STRING,
      guildId: DataTypes.STRING,
      message: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      username: {
        type: DataTypes.STRING,
        validate: { isLowercase: true }
      },
      streaming: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      startedAt: {
        type: DataTypes.DATE,
        defaultValue: new Date().toISOString()
      }
    },
    {
      timestamps: false,
      indexes: [
        {
          name: 'streams_channelId_username',
          unique: true,
          fields: ['channelId', 'username']
        }
      ]
    }
  );
};

module.exports = Streams;
