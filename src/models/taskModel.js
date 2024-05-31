const { Sequelize } = require("sequelize");
const sequelize = require("../database");
const Column = require("./columnModel");

const Task = sequelize.define("Task", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  description: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  owner: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  columnId: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: Column,
      key: "id",
    },
  },
  order: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
});

module.exports = Task;
