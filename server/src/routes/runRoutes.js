const express = require('express');
const router = express.Router();
const runController = require('../controllers/runController');

// Execute a workflow (POST /api/run)
router.post('/', (req, res, next) => runController.runWorkflow(req, res, next));

// Get run history (GET /api/runs?limit=5)
router.get('/', (req, res, next) => runController.getRuns(req, res, next));

// Get a single run (GET /api/runs/:id)
router.get('/:id', (req, res, next) => runController.getRunById(req, res, next));

module.exports = router;
