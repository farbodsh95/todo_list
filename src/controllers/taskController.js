const pool = require("../database");
const { sendTaskDoneEmail } = require("../services/emailService");

// Reorder tasks within a column
const reorderTasks = async (column_id) => {
  const [tasks] = await pool.query(
    "SELECT id FROM tasks WHERE column_id = ? ORDER BY `order` ASC",
    [column_id]
  );
  for (let i = 0; i < tasks.length; i++) {
    await pool.query("UPDATE tasks SET `order` = ? WHERE id = ?", [
      i + 1,
      tasks[i].id,
    ]);
  }
};

// Get all tasks
const getTasks = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT t.id, t.description, t.owner, c.state, t.order
       FROM tasks t
       JOIN columns c ON t.column_id = c.id
       ORDER BY FIELD(c.state, 'backlog', 'to do', 'in progress', 'done'), t.order`
    );
    res.json(rows);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({ error: "Error fetching tasks" });
  }
};

// Get a specific task by ID
const getTaskById = async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await pool.query(
      `SELECT t.id, t.description, t.owner, c.state, t.order
       FROM tasks t
       JOIN columns c ON t.column_id = c.id
       WHERE t.id = ?`,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error("Error fetching task:", error);
    res.status(500).json({ error: "Error fetching task" });
  }
};

// Create a new task
const createTask = async (req, res) => {
  const { description, owner, state = "backlog", order } = req.body;
  let column_id;

  try {
    // Get the column ID for the given state
    const [columns] = await pool.query(
      "SELECT id FROM columns WHERE state = ?",
      [state]
    );
    if (columns.length === 0) {
      return res.status(400).json({ error: "Invalid state" });
    }
    column_id = columns[0].id;

    // Determine the order if not provided
    let taskOrder = order;
    if (!taskOrder) {
      const [result] = await pool.query(
        "SELECT MAX(`order`) AS max_order FROM tasks WHERE column_id = ?",
        [column_id]
      );
      taskOrder = (result[0].max_order || 0) + 1;
    } else {
      const [result] = await pool.query(
        "SELECT COUNT(*) AS count FROM tasks WHERE column_id = ?",
        [column_id]
      );
      if (taskOrder > result[0].count + 1) {
        taskOrder = result[0].count + 1;
      }
      await pool.query(
        "UPDATE tasks SET `order` = `order` + 1 WHERE column_id = ? AND `order` >= ?",
        [column_id, taskOrder]
      );
    }

    // Insert the new task
    const [result] = await pool.query(
      "INSERT INTO tasks (description, owner, column_id, `order`) VALUES (?, ?, ?, ?)",
      [description, owner, column_id, taskOrder]
    );

    // Reorder tasks
    await reorderTasks(column_id);

    res.status(201).json({
      id: result.insertId,
      description,
      owner,
      state,
      order: taskOrder,
    });
  } catch (error) {
    console.error("Error creating task:", error);
    res.status(500).json({ error: "Error creating task" });
  }
};

// Update a task
const updateTask = async (req, res) => {
  const { id, description, owner, state, order } = req.body;

  try {
    // Fetch the current task details
    const [tasks] = await pool.query("SELECT * FROM tasks WHERE id = ?", [id]);
    if (tasks.length === 0) {
      return res.status(404).json({ error: "Task not found" });
    }
    const currentTask = tasks[0];
    const currentColumnId = currentTask.column_id;

    let newColumnId = currentColumnId;
    if (state) {
      // Get the new column ID for the given state
      const [columns] = await pool.query(
        "SELECT id FROM columns WHERE state = ?",
        [state]
      );
      if (columns.length === 0) {
        return res.status(400).json({ error: "Invalid state" });
      }
      newColumnId = columns[0].id;
    }

    let newOrder = order;
    if (!newOrder) {
      // Get the maximum order in the new column if order is not provided
      const [maxOrder] = await pool.query(
        "SELECT MAX(`order`) as maxOrder FROM tasks WHERE column_id = ?",
        [newColumnId]
      );
      newOrder = (maxOrder[0].maxOrder || 0) + 1;
    }

    // Update the task
    const updateQuery = `
      UPDATE tasks SET
      description = COALESCE(?, description),
      owner = COALESCE(?, owner),
      column_id = COALESCE(?, column_id),
      \`order\` = COALESCE(?, \`order\`)
      WHERE id = ?;
    `;
    await pool.query(updateQuery, [
      description,
      owner,
      newColumnId,
      newOrder,
      id,
    ]);

    // Reorder tasks in the original column if the task has moved to a new column
    if (newColumnId !== currentColumnId) {
      await reorderTasks(currentColumnId);
      await reorderTasks(newColumnId);
    } else {
      await reorderTasks(newColumnId);
    }

    // Send email if task is moved to "Done"
    if (state === "Done") {
      await sendTaskDoneEmail(currentTask.owner, currentTask.description);
    }

    res.json({ message: "Task updated successfully" });
  } catch (error) {
    console.error("Error updating task:", error);
    res.status(500).json({ error: "Error updating task" });
  }
};

// // Update a task
// const updateTask = async (req, res) => {
//   const { id, description, owner, state, order } = req.body;

//   try {
//     // Fetch the current task details
//     const [tasks] = await pool.query("SELECT * FROM tasks WHERE id = ?", [id]);
//     if (tasks.length === 0) {
//       return res.status(404).json({ error: "Task not found" });
//     }
//     const currentTask = tasks[0];
//     const currentColumnId = currentTask.column_id;

//     let newColumnId = currentColumnId;
//     if (state) {
//       // Get the new column ID for the given state
//       const [columns] = await pool.query(
//         "SELECT id FROM columns WHERE state = ?",
//         [state]
//       );
//       if (columns.length === 0) {
//         return res.status(400).json({ error: "Invalid state" });
//       }
//       newColumnId = columns[0].id;
//     }

//     let newOrder = order;
//     if (!newOrder) {
//       // Get the maximum order in the new column if order is not provided
//       const [maxOrder] = await pool.query(
//         "SELECT MAX(`order`) as maxOrder FROM tasks WHERE column_id = ?",
//         [newColumnId]
//       );
//       newOrder = (maxOrder[0].maxOrder || 0) + 1;
//     }

//     // Update the task
//     const updateQuery = `
//       UPDATE tasks SET
//       description = COALESCE(?, description),
//       owner = COALESCE(?, owner),
//       column_id = COALESCE(?, column_id),
//       \`order\` = COALESCE(?, \`order\`)
//       WHERE id = ?;
//     `;
//     await pool.query(updateQuery, [
//       description,
//       owner,
//       newColumnId,
//       newOrder,
//       id,
//     ]);

//     // Reorder tasks in the original column if the task has moved to a new column
//     if (newColumnId !== currentColumnId) {
//       await reorderTasks(currentColumnId);
//       await reorderTasks(newColumnId);
//     } else {
//       await reorderTasks(newColumnId);
//     }

//     res.json({ message: "Task updated successfully" });
//   } catch (error) {
//     console.error("Error updating task:", error);
//     res.status(500).json({ error: "Error updating task" });
//   }
// };

// Delete a task
const deleteTask = async (req, res) => {
  const { id } = req.body;

  try {
    const [tasks] = await pool.query("SELECT * FROM tasks WHERE id = ?", [id]);
    if (tasks.length === 0) {
      return res.status(404).json({ error: "Task not found" });
    }
    const task = tasks[0];

    await pool.query("DELETE FROM tasks WHERE id = ?", [id]);

    // Reorder tasks
    await reorderTasks(task.column_id);

    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error("Error deleting task:", error);
    res.status(500).json({ error: "Error deleting task" });
  }
};

const bulkUpdateTasks = async (req, res) => {
  const { ids, state } = req.body;
  let newColumnId;

  try {
    // Get the new column ID for the given state
    const [columns] = await pool.query(
      "SELECT id FROM columns WHERE state = ?",
      [state]
    );
    if (columns.length === 0) {
      return res.status(400).json({ error: "Invalid state" });
    }
    newColumnId = columns[0].id;

    // Find current column ids and owners of tasks to be updated
    const [tasks] = await pool.query(
      "SELECT id, column_id, owner, description FROM tasks WHERE id IN (?)",
      [ids]
    );
    const currentColumnIds = tasks.map((task) => task.column_id);
    const tasksToUpdate = tasks.filter((task) => ids.includes(task.id));

    // Update the tasks
    await pool.query("UPDATE tasks SET column_id = ? WHERE id IN (?)", [
      newColumnId,
      ids,
    ]);

    // Reorder tasks in affected columns
    const uniqueColumnIds = Array.from(new Set(currentColumnIds));
    for (const columnId of uniqueColumnIds) {
      await reorderTasks(columnId);
    }
    await reorderTasks(newColumnId);

    // Send email if tasks are moved to "Done"
    if (state === "Done") {
      for (const task of tasksToUpdate) {
        await sendTaskDoneEmail(task.owner, task.description);
      }
    }

    res.json({ message: "Tasks updated successfully" });
  } catch (error) {
    console.error("Error bulk updating tasks:", error);
    res.status(500).json({ error: "Error bulk updating tasks" });
  }
};

// const bulkUpdateTasks = async (req, res) => {
//   const { ids, state } = req.body;
//   let newColumnId;

//   try {
//     // Get the new column ID for the given state
//     const [columns] = await pool.query(
//       "SELECT id FROM columns WHERE state = ?",
//       [state]
//     );
//     if (columns.length === 0) {
//       return res.status(400).json({ error: "Invalid state" });
//     }
//     newColumnId = columns[0].id;

//     // Find current column ids of tasks to be updated
//     const [tasks] = await pool.query(
//       "SELECT id, column_id FROM tasks WHERE id IN (?)",
//       [ids]
//     );
//     const currentColumnIds = tasks.map((task) => task.column_id);

//     // Update the tasks
//     await pool.query("UPDATE tasks SET column_id = ? WHERE id IN (?)", [
//       newColumnId,
//       ids,
//     ]);

//     // Reorder tasks in affected columns
//     const uniqueColumnIds = Array.from(new Set(currentColumnIds));
//     for (const columnId of uniqueColumnIds) {
//       await reorderTasks(columnId);
//     }
//     await reorderTasks(newColumnId);

//     res.json({ message: "Tasks updated successfully" });
//   } catch (error) {
//     console.error("Error bulk updating tasks:", error);
//     res.status(500).json({ error: "Error bulk updating tasks" });
//   }
// };

const bulkDeleteTasks = async (req, res) => {
  const { ids } = req.body;

  try {
    // Find the columns of the tasks to be deleted
    const [tasks] = await pool.query(
      "SELECT column_id FROM tasks WHERE id IN (?)",
      [ids]
    );
    const columnsToReorder = tasks.map((task) => task.column_id);

    await pool.query("DELETE FROM tasks WHERE id IN (?)", [ids]);

    // Reorder tasks in affected columns
    const uniqueColumnIds = Array.from(new Set(columnsToReorder));
    for (const column_id of uniqueColumnIds) {
      await reorderTasks(column_id);
    }

    res.json({ message: "Tasks deleted successfully" });
  } catch (error) {
    console.error("Error bulk deleting tasks:", error);
    res.status(500).json({ error: "Error bulk deleting tasks" });
  }
};

module.exports = {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  bulkUpdateTasks,
  bulkDeleteTasks,
};
