'use strict';
module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define('User', {
    email: { type: DataTypes.STRING, validate: { isEmail: true }},
    firstname: DataTypes.STRING,
    lastname: DataTypes.STRING,
    stormpathHref: { type: DataTypes.STRING, validate: { notEmpty: true }}
  }, {
    classMethods: {
      associate: function(models) {
        User.hasMany(models.Notification, {
          foreignKey: 'userId'
        });
      }
    }
  });
  return User;
};