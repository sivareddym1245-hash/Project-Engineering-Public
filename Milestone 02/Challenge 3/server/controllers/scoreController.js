const prisma = require('../db');

const getScore = async (req, res) => {
  try {
    const tasks = await prisma.task.findMany({
      where: { completed: true },
      select: { completed: true, isImportant: true, completedAt: true }
    });

    const { calculateProductivity } = require('../utils/scoreHelper');
    res.json(calculateProductivity(tasks));

  } catch (error) {
    console.error('Error fetching productivity score:', error);
    res.status(500).json({ error: 'Failed to fetch score' });
  }
};

module.exports = {
  getScore
};
