'use strict';
module.exports = (sequelize, DataTypes) => {
  const Log = sequelize.define('Log', {
    userId: DataTypes.INTEGER,
    equipmentId: DataTypes.INTEGER,
    date: DataTypes.DATEONLY,
    shift: DataTypes.STRING,
    time: DataTypes.TIME,
    jobDesc: DataTypes.STRING,
    followUp: DataTypes.STRING,
    desc: DataTypes.STRING
  }, {});
  Log.associate = function(models) {
    // associations can be defined here
    Log.belongsTo(models.Equipment, {foreignKey: 'equipmentId', as: 'equipment'});
    Log.belongsTo(models.User, {foreignKey: 'userId', as: 'user'});
    Log.hasMany(models.LogImage, {as:'images'});
  };
  return Log;
};