'use strict';
module.exports = (sequelize, DataTypes) => {
  const Facility = sequelize.define('Facility', {
    name: DataTypes.STRING,
    desc: DataTypes.STRING
  }, {});
  Facility.associate = function(models) {
    // associations can be defined here
    Facility.hasMany(models.Equipment, {as:'equipments'});
    Facility.hasMany(models.Subfacility, {as:'subfacilities'});
  };
  return Facility;
};