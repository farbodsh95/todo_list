const express = require("express");
const { createColumn } = require("../controllers/columnController");
const { createTask } = require("../controllers/taskController");

const router = express.Router();

router.post("/columns", createColumn);
// Add other routes for columns similarly

router.post("/tasks", createTask);
// Add other routes for tasks similarly

module.exports = router;
