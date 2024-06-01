const { Sequelize } = require("sequelize");
const sequelize = require("../database");

const Column = sequelize.define(
  "Column",
  {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    state: {
      type: Sequelize.ENUM("Backlog", "To Do", "In Progress", "Done"),
      allowNull: false,
    },
  },
  {
    tableName: "columns",
    timestamps: false,
  }
);

module.exports = Column;
