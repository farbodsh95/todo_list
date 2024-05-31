const Column = require("../models/columnModel");

const createColumn = async (req, res) => {
  const { name } = req.body;
  try {
    const column = await Column.create({ name });
    res.status(201).json(column);
  } catch (error) {
    res.status(500).json({ error: "Error creating column" });
  }
};

// Add other CRUD operations for columns similarly

module.exports = { createColumn };
