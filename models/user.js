'use strict';
import { hashSync } from 'bcrypt';

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    name: DataTypes.STRING,
    username: {
      type: DataTypes.STRING,
      unique: {
        args: true,
        msg: 'Username already in use!'
      }
    },
    email: {
      type:  DataTypes.STRING,
      validate: {
        isEmail: {
          msg: "Email must in format foo@bar.com"
        }
      },
      unique: {
        args: true,
        msg: 'Email address already in use!'
      }
    },
    phoneNumber: DataTypes.STRING,
    password: DataTypes.STRING,
    role: {
      type: DataTypes.STRING,
      defaultValue: 'member',
    },
    position: DataTypes.STRING,
    address: DataTypes.STRING,
    resetPasswordToken: DataTypes.STRING,
    resetPasswordExpires: DataTypes.DATE
  }, {});
  User.associate = function(models) {
    // associations can be defined here
  };
  User.beforeCreate((user) => {
    user.password = hashSync(user.password,10);
  });
  User.prototype.toJSON =  function () {
    var values = Object.assign({}, this.get());
  
    delete values.password; 
    return values;
  };
  return User;
};