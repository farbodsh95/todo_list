const Task = require("../models/taskModel");
const Column = require("../models/columnModel");
const {
  createTaskSchema,
  editTaskSchema,
} = require("../validators/taskValidator");

const createTask = async (req, res) => {
  const { error, value } = createTaskSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  const { state = "Backlog", ...taskData } = value;

  try {
    // Ensure the state exists in the columns table
    const column = await Column.findOne({ where: { state } });
    if (!column) {
      return res.status(500).json({ error: `${state} column not found` });
    }

    // Get the current number of tasks in the column to set the order
    const taskCount = await Task.count({ where: { column_id: column.id } });
    const task = await Task.create({
      ...taskData,
      column_id: column.id,
      order: taskCount + 1,
    });

    res.status(201).json(task);
  } catch (error) {
    console.error("Error creating task:", error);
    res.status(500).json({ error: "Error creating task" });
  }
};

const getTasks = async (req, res) => {
  try {
    const tasks = await Task.findAll();
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ error: "Error fetching tasks" });
  }
};

const getTaskById = async (req, res) => {
  const { id } = req.params;
  try {
    const task = await Task.findByPk(id);
    if (task) {
      res.status(200).json(task);
    } else {
      res.status(404).json({ error: "Task not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error fetching task" });
  }
};

const updateTask = async (req, res) => {
  const { id } = req.params;
  const { error, value } = editTaskSchema.validate(req.body, {
    allowUnknown: true,
  });
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  try {
    const task = await Task.findByPk(id);
    if (task) {
      await task.update(value);
      res.status(200).json(task);
    } else {
      res.status(404).json({ error: "Task not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error updating task" });
  }
};

const deleteTask = async (req, res) => {
  const { id } = req.params;
  try {
    const task = await Task.findByPk(id);
    if (task) {
      await task.destroy();
      res.status(204).send();
    } else {
      res.status(404).json({ error: "Task not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error deleting task" });
  }
};

module.exports = { createTask, getTasks, getTaskById, updateTask, deleteTask };
