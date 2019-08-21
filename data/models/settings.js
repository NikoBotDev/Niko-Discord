const Settings = (sequelize, DataTypes) => {
  return sequelize.define('settings', {
    guildId: {
      type: DataTypes.STRING,
      unique: true,
      primaryKey: true,
    },
    settings: DataTypes.JSON,
  });
};

module.exports = Settings;
