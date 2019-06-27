'use strict';
module.exports = (sequelize, DataTypes) => {
  const LogImage = sequelize.define('LogImage', {
    logId: DataTypes.INTEGER,
    path: DataTypes.STRING
  }, {});
  LogImage.associate = function(models) {
    // associations can be defined here
    LogImage.belongsTo(models.Log, {foreignKey: 'logId', as: 'log'});
  };
  return LogImage;
};