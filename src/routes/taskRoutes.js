const express = require("express");
const {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  bulkUpdateTasks,
  bulkDeleteTasks,
} = require("../controllers/taskController");
const {
  validateCreate,
  validateUpdate,
  validateBulkUpdate,
  validateBulkDelete,
} = require("../validators/taskValidator");

const router = express.Router();

router.get("/tasks", getTasks);
router.get("/tasks/:id", getTaskById);
router.post("/tasks", validateCreate, createTask);
router.put("/tasks", validateUpdate, updateTask);
router.delete("/tasks", deleteTask);
router.put("/tasks/bulk", validateBulkUpdate, bulkUpdateTasks);
router.delete("/tasks/bulk", validateBulkDelete, bulkDeleteTasks);

module.exports = router;
