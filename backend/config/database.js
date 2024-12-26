const { Sequelize } = require("sequelize");
const config = require("./config");

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: config.database.path,
  logging: false,
});

module.exports = sequelize;
