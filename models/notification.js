'use strict';
module.exports = function(sequelize, DataTypes) {
  var Notification = sequelize.define('Notification', {
    zip: { type: DataTypes.INTEGER, validate: { notEmpty: true, isNumeric: true }},
    optimum: { type: DataTypes.BOOLEAN, validate: { notEmpty: true, isIn: [[true, false, 1, 0]]}},
    userId: { 
      type: DataTypes.INTEGER,
      references: {
        model: 'Users',
        key: 'id'
      },
      validate: {
        notEmpty: true,
        isNumeric: true
      }
    }
  }, {
    classMethods: {
      associate: function(models) {
        Notification.belongsTo(models.User, {
          foreignKey: 'userId'
        });
      }
    }
  });
  return Notification;
};