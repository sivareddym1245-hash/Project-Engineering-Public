require('dotenv').config(); // Load environment variables
const express = require('express');
const confessionRoutes = require('./routes/confessionRoutes');

const app = express();
app.use(express.json());

// Base API route configuration
app.use('/api/v1/confessions', confessionRoutes);

// Port dynamic assignment via env variables
const PORT = process.env.PORT || 3000;

app.listen(PORT, function() {
  console.log(`running on ${PORT}`);
});