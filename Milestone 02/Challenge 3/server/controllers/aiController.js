const prisma = require('../db');
const { assertAiConfigured, generateTaskPlan } = require('../services/aiPlanner');

const createPlan = async (req, res) => {
  const goal = typeof req.body?.goal === 'string' ? req.body.goal.trim() : '';
  if (goal.length < 3 || goal.length > 500) {
    return res.status(400).json({ error: 'Goal must be between 3 and 500 characters.' });
  }

  try {
    assertAiConfigured();
    const tasks = await prisma.task.findMany({
      where: { completed: false },
      orderBy: [{ isImportant: 'desc' }, { createdAt: 'asc' }],
      take: 30,
      select: { id: true, title: true, isImportant: true }
    });
    const result = await generateTaskPlan(goal, tasks);
    return res.json(result);
  } catch (error) {
    console.error('Error creating AI task plan:', error);
    return res.status(error.statusCode || 500).json({
      error: error.statusCode ? error.message : 'Failed to create a task plan.'
    });
  }
};

module.exports = { createPlan };
