'use strict';
module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define('User', {
    email: { type: DataTypes.STRING, validate: { isEmail: true }},
    name: DataTypes.STRING,
    stormpathHref: { type: DataTypes.STRING, validate: { notEmpty: true }}
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return User;
};