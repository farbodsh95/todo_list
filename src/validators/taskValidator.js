const Joi = require("joi");

const createTaskSchema = Joi.object({
  description: Joi.string().required(),
  owner: Joi.string().email().required(),
  state: Joi.string()
    .valid("Backlog", "To Do", "In Progress", "Done")
    .optional(),
  order: Joi.number().integer().optional(),
});

const updateTaskSchema = Joi.object({
  id: Joi.number().integer().required(),
  description: Joi.string().optional(),
  owner: Joi.string().email().optional(),
  state: Joi.string()
    .valid("Backlog", "To Do", "In Progress", "Done")
    .optional(),
  order: Joi.number().integer().optional(),
});

const bulkUpdateTasksStateSchema = Joi.object({
  ids: Joi.array().items(Joi.number().integer()).required(),
  state: Joi.string()
    .valid("Backlog", "To Do", "In Progress", "Done")
    .required(),
});

const bulkDeleteTasksSchema = Joi.object({
  ids: Joi.array().items(Joi.number().integer()).required(),
});

const validateCreate = (req, res, next) => {
  const { error } = createTaskSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};

const validateUpdate = (req, res, next) => {
  const { error } = updateTaskSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};

const validateBulkUpdate = (req, res, next) => {
  const { error } = bulkUpdateTasksStateSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};

const validateBulkDelete = (req, res, next) => {
  const { error } = bulkDeleteTasksSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};

module.exports = {
  validateCreate,
  validateUpdate,
  validateBulkUpdate,
  validateBulkDelete,
};
