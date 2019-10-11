const Tags = (sequelize, DataTypes) => {
  return sequelize.define(
    'tags',
    {
      name: {
        type: DataTypes.STRING(20),
        validate: {
          len: [3, 20]
        }
      },
      content: {
        type: DataTypes.TEXT,
        validate: {
          len: [10, 1000]
        }
      },
      guildId: DataTypes.STRING,
      userId: DataTypes.STRING
    },
    {
      indexes: [
        {
          name: 'tag_name_guildId',
          unique: true,
          fields: ['name', 'guildId']
        }
      ]
    }
  );
};

module.exports = Tags;
