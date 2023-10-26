const Sequelize = require('sequelize');

const sequelize = new Sequelize('cdrreport', 'root', 'root', {
  host: 'localhost',
  dialect: 'mysql', // or 'mysql' | 'postgres' | 'mariadb' | 'sqlite'
});

module.exports = sequelize;
