const express = require('express');
const { rateLimit } = require('express-rate-limit');
const aiController = require('../controllers/aiController');

const router = express.Router();

router.post(
  '/plan',
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 10,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    message: { error: 'Too many planning requests. Please try again in 15 minutes.' }
  }),
  aiController.createPlan
);

module.exports = router;
