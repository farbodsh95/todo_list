const Joi = require("joi");

const createTaskSchema = Joi.object({
  description: Joi.string().max(150).required(),
  owner: Joi.string().email().required(),
  columnId: Joi.number().integer().optional(),
  state: Joi.string()
    .valid("Backlog", "To Do", "In Progress", "Done")
    .optional(),
  order: Joi.number().integer().optional(),
});

const editTaskSchema = Joi.object({
  description: Joi.string().max(150).optional(),
  owner: Joi.string().email().optional(),
  columnId: Joi.number().integer().optional(),
  state: Joi.string()
    .valid("Backlog", "To Do", "In Progress", "Done")
    .optional(),
  order: Joi.number().integer().optional(),
});

module.exports = { createTaskSchema, editTaskSchema };
