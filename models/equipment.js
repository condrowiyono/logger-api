'use strict';
module.exports = (sequelize, DataTypes) => {
  const Equipment = sequelize.define('Equipment', {
    facilityId: DataTypes.INTEGER,
    subfacilityId: DataTypes.INTEGER,
    location: DataTypes.STRING,
    name: DataTypes.STRING,
    attributes: DataTypes.STRING,
    brand: DataTypes.STRING,
    quantity: DataTypes.INTEGER,
    yearInstalled: DataTypes.INTEGER,
    desc: DataTypes.STRING,
    qrcode: DataTypes.STRING,
  }, {});
  Equipment.associate = function(models) {
    // associations can be defined here
    Equipment.belongsTo(models.Facility, {foreignKey: 'facilityId', as: 'facility'});
    Equipment.belongsTo(models.Subfacility, {foreignKey: 'subfacilityId', as: 'subfacility'});
  };
  return Equipment;
};