const prisma = require('../db');

const getTasks = async (req, res) => {
  try {
    const tasks = await prisma.task.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
};

const createTask = async (req, res) => {
  const { title, isImportant = false } = req.body ?? {};
  if (typeof title !== 'string' || !title.trim()) {
    return res.status(400).json({ error: 'Task title is required' });
  }
  if (typeof isImportant !== 'boolean') {
    return res.status(400).json({ error: 'isImportant must be a boolean' });
  }

  try {
    const task = await prisma.task.create({
      data: { title: title.trim(), isImportant }
    });
    res.status(201).json(task);
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ error: 'Failed to create task' });
  }
};

const updateTask = async (req, res) => {
  const id = Number(req.params.id);
  const body = req.body ?? {};
  const { completed, isImportant } = body;
  const updatesCompletion = Object.prototype.hasOwnProperty.call(body, 'completed');
  const updatesImportance = Object.prototype.hasOwnProperty.call(body, 'isImportant');

  if (!Number.isInteger(id) || id < 1) {
    return res.status(400).json({ error: 'Task id must be a positive integer' });
  }
  if (!updatesCompletion && !updatesImportance) {
    return res.status(400).json({ error: 'Provide completed or isImportant to update' });
  }
  if (updatesCompletion && typeof completed !== 'boolean') {
    return res.status(400).json({ error: 'completed must be a boolean' });
  }
  if (updatesImportance && typeof isImportant !== 'boolean') {
    return res.status(400).json({ error: 'isImportant must be a boolean' });
  }

  try {
    const currentTask = await prisma.task.findUnique({ where: { id } });
    if (!currentTask) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const data = {};
    if (updatesCompletion) {
      data.completed = completed;
      if (completed !== currentTask.completed) {
        data.completedAt = completed ? new Date() : null;
      }
    }
    if (updatesImportance) data.isImportant = isImportant;

    const task = await prisma.task.update({
      where: { id },
      data
    });
    res.json(task);
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ error: 'Failed to update task' });
  }
};

const deleteTask = async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id < 1) {
    return res.status(400).json({ error: 'Task id must be a positive integer' });
  }

  try {
    await prisma.task.delete({
      where: { id }
    });
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ error: 'Failed to delete task' });
  }
};

module.exports = {
  getTasks,
  createTask,
  updateTask,
  deleteTask
};
