function DB() {
  const fs = require('fs');
  const path = require('path');
  const sequelizeConfig = global.config.database;
  const Sequelize = require('sequelize');
  let db = {};
  const sequelize = new Sequelize(
    sequelizeConfig.database,
    sequelizeConfig.username,
    sequelizeConfig.password,
    {
      host: sequelizeConfig.host,
      dialect: sequelizeConfig.dialect,
      operatorsAliases: sequelizeConfig.operatorsAliases,
      pool: sequelizeConfig.pool
    }
  );

  fs
    .readdirSync(path.join(__dirname, '../models/'))
    .filter(function(file) {
      return (file.indexOf('.') !== 0);
    })
    .forEach(function(file) {
      if (file.slice(-3) !== '.js') return;
      let model = sequelize['import'](path.join(__dirname, '../models/', file));
      db[model.name] = model;
    });

  Object.keys(db).forEach(function(modelName) {
    if (db[modelName].associate) {
      db[modelName].associate(db);
    }
  });
  db.sequelize = sequelize;
  db.Sequelize = Sequelize;
  return db;
}

module.exports = DB;
