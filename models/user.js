'use strict';
let crypto = require('crypto');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    passwordHash: DataTypes.STRING,
    salt: DataTypes.STRING
  }, {
    setterMethods: {
      password(value) {
        let salt = User.generateSalt();
        this.setDataValue('salt', salt);
        this.setDataValue('passwordHash', User.encrypt(value, salt));
      }
    }
  });
  User.associate = function(models) {
  };

  User.generateSalt = function(length = 12) {
    return crypto.randomBytes(Math.ceil(length/2))
      .toString('hex')
      .slice(0,length);
    }
  User.encrypt = function(password, salt) {
    let hash = crypto.createHmac('sha512', salt);
    hash.update(password);
    return hash.digest('hex');
  }

  User.prototype.validatePassword = function(password) {
    return (User.encrypt(password, this.salt) == this.passwordHash);
  }

  return User;
};
