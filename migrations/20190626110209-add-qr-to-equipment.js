'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
    let migrations = [];

    migrations.push(queryInterface.addColumn(
        'Equipment',
        'qrcode',
        {
            type: Sequelize.STRING,
        }
    ));

    return Promise.all(migrations);
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
    let migrations = [];

    migrations.push(queryInterface.removeColumn(
        'Equipment',
        'qrcode',
    ));
    
    return Promise.all(migrations);
  }
};
