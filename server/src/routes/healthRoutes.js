const express = require('express');
const router = express.Router();
const healthController = require('../controllers/healthController');

// Full health check
router.get('/', (req, res, next) => healthController.getHealth(req, res, next));

// Simple liveness check
router.get('/live', (req, res) => healthController.getLiveness(req, res));

module.exports = router;
