module.exports = (db, dataTypes) => {
  return db.define(
    'reminders',
    {
      userId: {
        type: dataTypes.STRING,
        allowNull: false
      },
      guildId: {
        type: dataTypes.STRING,
        allowNull: true
      },
      channelId: {
        type: dataTypes.STRING,
        allowNull: true
      },
      of_: {
        type: dataTypes.TEXT,
        allowNull: false,
        validate: {
          len: [1, 1500]
        }
      },
      in_: {
        type: dataTypes.DATE,
        allowNull: false
      }
    },
    {
      timestamps: false,
      indexes: [
        {
          name: 'userId_index',
          unique: false,
          fields: ['userId']
        }
      ]
    }
  );
};
