'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn(
      'Notifications',
      'userId',
      {
        type: Sequelize.INTEGER
      }
    );
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn(
      'Notifications',
      'userId'
    );
  }
};
