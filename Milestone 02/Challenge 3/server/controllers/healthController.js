const prisma = require('../db');

const getHealth = async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return res.json({ status: 'ok' });
  } catch (error) {
    console.error('Backend readiness check failed:', error);
    return res.status(503).json({ status: 'unavailable', error: 'Database is not ready.' });
  }
};

module.exports = { getHealth };
