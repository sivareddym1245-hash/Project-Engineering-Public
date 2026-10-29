const express = require('express');
const cors = require('cors');

const taskRoutes = require('./routes/tasks');
const scoreRoutes = require('./routes/score');
const aiRoutes = require('./routes/ai');
const healthController = require('./controllers/healthController');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '32kb' }));

app.get('/health', healthController.getHealth);

app.use('/tasks', taskRoutes);
app.use('/score', scoreRoutes);
app.use('/ai', aiRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
