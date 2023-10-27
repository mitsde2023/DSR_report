const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('cdrreport', 'root', 'root', {
  host: 'localhost',
  dialect: 'mysql', 
});

module.exports = sequelize;
