const express = require("express");
const {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
} = require("../controllers/taskController");
const validate = require("../middleware/validate");
const {
  createTaskSchema,
  editTaskSchema,
} = require("../validators/taskValidator");

const router = express.Router();

router.post("/tasks", validate(createTaskSchema), createTask);
router.get("/tasks", getTasks);
router.get("/tasks/:id", getTaskById);
router.put("/tasks/:id", validate(editTaskSchema), updateTask);
router.delete("/tasks/:id", deleteTask);

module.exports = router;
