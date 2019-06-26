'use strict';
module.exports = (sequelize, DataTypes) => {
  const Subfacility = sequelize.define('Subfacility', {
    name: DataTypes.STRING,
    facilityId: DataTypes.INTEGER,
    desc: DataTypes.STRING
  }, {});
  Subfacility.associate = function(models) {
    // associations can be defined here
    Subfacility.hasMany(models.Equipment, {as:'equipments'});
    Subfacility.belongsTo(models.Facility, {foreignKey: 'facilityId', as: 'facility'});
  };
  return Subfacility;
};