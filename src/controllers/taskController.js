const Task = require("../models/taskModel");

const createTask = async (req, res) => {
  const { description, owner, columnId, order } = req.body;
  try {
    const task = await Task.create({ description, owner, columnId, order });
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ error: "Error creating task" });
  }
};

// Add other CRUD operations for tasks similarly

module.exports = { createTask };
