require('dotenv').config();

const express = require('express');
const cors = require('cors');

const workflowRoutes = require('./routes/workflowRoutes');
const runRoutes = require('./routes/runRoutes');
const healthRoutes = require('./routes/healthRoutes');
const { errorHandler } = require('./utils/errorHandler');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/workflows', workflowRoutes);
app.use('/api/run', runRoutes);
app.use('/api/runs', runRoutes);
app.use('/api/health', healthRoutes);

// Error handling middleware
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`🚀 Workflow Builder Lite server running on port ${PORT}`);
});

module.exports = app;
