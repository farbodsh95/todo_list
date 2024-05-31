const { Sequelize } = require("sequelize");
const sequelize = require("../database");

const Column = sequelize.define("Column", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

module.exports = Column;
